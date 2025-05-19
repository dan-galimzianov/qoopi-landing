import type { CarouselData } from "./carousel";

export type LoadedSource = {       
  type: 'video' | 'image';
  media: HTMLImageElement | HTMLVideoElement;
  height: number;
  width: number;
  outlineImg?: LoadedSource;
}

export const loadImg = async (src: string) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
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

  return new Promise<HTMLVideoElement>(resolve => {
    video.addEventListener('loadeddata', () => {
      video.play();
      resolve(video);
    });
  });
}

export function loadSources(sources: CarouselData[]): Promise<LoadedSource[]> {
  return Promise.all(sources.map(item => {
    return new Promise<LoadedSource>(async (resolve) => {
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';

        const videoItem: LoadedSource = {
          type: 'video',
          media: video,
          height: 0,
          width: 0
        }

        if (item.outlineSrc) {
          const outlineImg = await loadImg(item.outlineSrc);

          videoItem.outlineImg = {
            type: 'image',
            media: outlineImg,
            height: outlineImg.height,
            width: outlineImg.width
          }
        }

        video.addEventListener('loadeddata', () => {
          video.play();
          videoItem.height = video.videoHeight;
          videoItem.width = video.videoWidth;
          resolve(videoItem);
        });

      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.src;
        img.onload = () => {
          resolve({ type: 'image', media: img, height: img.height, width: img.width });
        };
      }
    });
  }));
}
