import type { CarouselData } from "./carousel";

export type LoadedSource = {       
  type: 'video' | 'image';
  media: HTMLImageElement | HTMLVideoElement;
  height: number;
  width: number;
  outlineImg?: LoadedSource;
  posterImg?: LoadedSource;
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
    video.play();
    return video;
  }

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

        

        Promise.all([
          new Promise<void>(async () => {
            if (item.posterSrc && video.readyState <= 3) {
              video.play();
              const posterImg = await loadImg(item.posterSrc);
              videoItem.height = posterImg.height;
              videoItem.width = posterImg.width;
              video.poster = item.posterSrc;
              resolve(videoItem);
            }
          }),
          new Promise<void>(async () => {
            if (item.outlineSrc) {
            const outlineImg = await loadImg(item.outlineSrc);
            videoItem.outlineImg = {
              type: 'image',
              media: outlineImg,
              height: outlineImg.height,
              width: outlineImg.width
            }
          }
          })
        ])

        if (video.readyState > 3) {
          videoItem.media = video;
          videoItem.height = video.videoHeight;
          videoItem.width = video.videoWidth;
          resolve(videoItem);
        }

        video.addEventListener('loadeddata', () => {
          video.play();
          videoItem.media = video;
          videoItem.height = video.videoHeight;
          videoItem.width = video.videoWidth;
          resolve(videoItem);
        });
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.src;
        if (img.complete) {
          resolve({ type: 'image', media: img, height: img.height, width: img.width });
        } else {
          img.onload = () => {
            resolve({ type: 'image', media: img, height: img.height, width: img.width });
          };
        }
      }
    });
  }));
}
