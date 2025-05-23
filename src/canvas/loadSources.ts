import type { CarouselData } from "./carousel";

export type LoadedSource = {       
  type: 'video' | 'image';
  media: HTMLImageElement | HTMLVideoElement;
  height: number;
  width: number;
  outlineImg?: LoadedSource;
  posterImg?: LoadedSource;
}

// Очередь для управления загрузкой видео
class VideoLoadQueue {
  private queue: (() => Promise<void>)[] = [];
  private activeLoads = 0;
  private maxConcurrent = 4; // Ограничиваем количество одновременных загрузок видео

  async add(task: () => Promise<void>) {
    if (this.activeLoads >= this.maxConcurrent) {
      await new Promise<void>(resolve => {
        this.queue.push(async () => {
          await task();
          resolve();
        });
      });
    } else {
      this.activeLoads++;
      await task();
      this.activeLoads--;
      this.processQueue();
    }
  }

  private processQueue() {
    if (this.queue.length > 0 && this.activeLoads < this.maxConcurrent) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        this.activeLoads++;
        nextTask().finally(() => {
          this.activeLoads--;
          this.processQueue();
        });
      }
    }
  }
}

export const loadImg = async (src: string) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  if (img.complete) {
    return img;
  }
  await new Promise(resolve => {
    img.onload = () => {
        resolve(img);
    }
    img.onerror = () => {
        resolve(null);
    }
    });
  return img;
}

export const loadVideo = async (src: string) => {
  const video = document.createElement('video');
  video.src = src;
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';

  if (video.readyState > 3) {
    return video;
  }

  return new Promise<HTMLVideoElement>(resolve => {
    video.addEventListener('loadeddata', () => {
      video.play();
      resolve(video);
    });
  });
}

const videoLoadQueue = new VideoLoadQueue();

export async function loadSources(sources: CarouselData[]): Promise<LoadedSource[]> {
  const loadAllImages = async (item: CarouselData): Promise<LoadedSource> => {
    if (item.type === 'image') {
      const img = await loadImg(item.src);
      if (!img) throw new Error(`Failed to load image: ${item.src}`);
      return { type: 'image', media: img, height: img.height, width: img.width };
    }

    // Загружаем постер и аутлайн для видео
    const posterImg = item.posterSrc ? await loadImg(item.posterSrc) : null;

    return {
      type: 'video',
      media: null as any, // Временно null, видео загрузим позже
      height: posterImg?.height || 0,
      width: posterImg?.width || 0,
      posterImg: posterImg ? {
        type: 'image',
        media: posterImg,
        height: posterImg.height,
        width: posterImg.width
      } : undefined
    };
  };

  // Загружаем все изображения параллельно
  const loadedImages = await Promise.all(sources.map(loadAllImages));

  // После загрузки изображений загружаем видео через очередь
  await Promise.all(loadedImages.map(async (result, index) => {
      const source = sources[index];
      if (source.type === 'video') {
        await videoLoadQueue.add(async () => {
          const video = await loadVideo(source.src);
          result.height = video.videoHeight;
          result.width = video.videoWidth;
          result.media = video;
        });
      }
      
      return result;
  }));

  return loadedImages;
}
