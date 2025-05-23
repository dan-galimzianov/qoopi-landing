import { loadSources, type LoadedSource } from "./loadSources";
import { drawRoundedMedia } from "./drawRoundedVideo";
import { scaleMedia } from "./scaleMedia";

export type CarouselData = {
    type: 'image' | 'video';
    src: string;
    outlineSrc?: string;
    posterSrc?: string;
}

type InitCanvasCarouselOptions = {
    speed: number;
    gap: number;
    fadeInDuration?: number; // Продолжительность анимации появления в миллисекундах
    backgroundImgSrc?: string; // Путь до превью картинки
}

const debounce = (func: Function, delay: number) => {
    let timeoutId: number;
    return function(this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => func.apply(this, args), delay);
    };
  };

const dpr = window.devicePixelRatio || 1;

interface HTMLCanvasElementWithRect extends HTMLCanvasElement {
  getBoundingClientRect(): DOMRect;
}

function setupCanvas(canvas: HTMLCanvasElement) {
  // Get the device pixel ratio, falling back to 1.
  const canvasWithRect = canvas as HTMLCanvasElementWithRect;
  const rect = canvasWithRect.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx!.scale(dpr, dpr);
  return ctx;
}

export const initCanvasCarousel = (id: string, data: CarouselData[], options: InitCanvasCarouselOptions) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.style.opacity = '0';
    canvas.style.transition = `opacity ${options.fadeInDuration || 500}ms ease`;
    
    const ctx = setupCanvas(canvas);
    if (!ctx) return;

    let requestAnimationFrameId: number | null = null;
    let mediaItems: LoadedSource[] = [];

    const loadMediaItems = async () => {
        mediaItems = await loadSources(data);
        start();
    }

    loadMediaItems()

    const start = () => {
        if (!mediaItems.length) return;
        if (requestAnimationFrameId) {
            cancelAnimationFrame(requestAnimationFrameId);
        }

        const ctx = setupCanvas(canvas);
        if (!ctx) return;
        let offset = 0;
        const speed = options.speed / dpr;
        const gap = options.gap / dpr;
        const containerWidth = canvas.width / dpr;
        const borderRadius = 60 / dpr;

        const items = mediaItems.map((item) => {
            const media = scaleMedia(ctx, item);
            return media;
        });

        const render = () => {            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const totalHeight = items.reduce((sum, item) => sum + item.height + gap, 0);
            let y = -offset % totalHeight;

                let i = 0;

            while (y < canvas.height + 500) {
                    const item = items[i % items.length];

                    if (item.media instanceof HTMLVideoElement && item.media.readyState === 4) {
                        if (item.media.paused) {
                            item.media.play();
                        }
                        drawRoundedMedia(ctx, item.media, 0, y, containerWidth, item.height, borderRadius);
                    }

                    if (item.media instanceof HTMLVideoElement && item.posterImg && item.media.readyState <= 3) {
                        drawRoundedMedia(ctx, item.posterImg.media, 0, y, containerWidth, item.posterImg.height, borderRadius);
                    }

                    if (item.media instanceof HTMLImageElement) {
                        drawRoundedMedia(ctx, item.media, 0, y, containerWidth, item.height, borderRadius);
                    }

                    if (item.outlineImg) {
                        drawRoundedMedia(ctx, item.outlineImg.media, 0, y, containerWidth, item.outlineImg.height, borderRadius);
                    }
                    y += item.height + gap;
                    i++;
            }

            offset += speed;
            if (offset >= totalHeight) {
                offset = 0;
            }

            requestAnimationFrameId = requestAnimationFrame(render);
        }

        requestAnimationFrameId = requestAnimationFrame(render);
        
        setTimeout(() => {
            canvas.style.opacity = '1';
        }, 50);
    }

    window.addEventListener('resize', debounce(start, 100));

    const stop = () => {
        if (requestAnimationFrameId) {
            cancelAnimationFrame(requestAnimationFrameId);
        }
    }

    return [start, stop]
}
