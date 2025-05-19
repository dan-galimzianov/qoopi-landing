import { loadSources, type LoadedSource } from "./loadSources";
import { drawRoundedMedia } from "./drawRoundedVideo";
import type { CarouselData } from "./carousel";

type InitHorizontalCanvasCarouselOptions = {
    speed: number;
    gap: number;
    fadeInDuration?: number; // Продолжительность анимации появления в миллисекундах
    columnMode?: boolean; // Режим колонок, объединяющий элементы
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
  const canvasWithRect = canvas as HTMLCanvasElementWithRect;
  const rect = canvasWithRect.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx!.scale(dpr, dpr);
  return ctx;
}

/**
 * Рассчитывает размеры слайдов на основе самого высокого элемента
 */
function calculateItemSizes(ctx: CanvasRenderingContext2D, items: any[]) {
  const containerHeight = ctx.canvas.height / dpr;
  
  // Находим самый высокий элемент
  let maxHeight = 0;
  items.forEach((item) => {
    if (item.height > maxHeight) {
      maxHeight = item.height;
    }
  });
  
  // Коэффициент масштабирования на основе самого высокого элемента
  const scaleFactor = containerHeight / maxHeight;
  
  // Рассчитываем размеры для каждого элемента, сохраняя их пропорции
  return items.map(item => {
    // Сохраняем оригинальные пропорции, применяя одинаковый коэффициент масштабирования
    const itemHeight = item.height * scaleFactor;
    const itemWidth = item.width * scaleFactor;
    
    return {
      ...item,
      displayHeight: itemHeight,
      displayWidth: itemWidth,
      scaleFactor
    };
  });
}

/**
 * Создает элементы в режиме колонок с чередующимися пропорциями 2/3 и 3/2
 */
function createColumnItems(ctx: CanvasRenderingContext2D, items: any[], gap: number) {
  const containerHeight = ctx.canvas.height / dpr;
  const columnItems = [];
  
  // Формируем массив пар элементов для колонок
  for (let i = 0; i < items.length; i += 2) {
    const firstItem = items[i];
    const secondItem = items[i + 1 < items.length ? i + 1 : 0];
    
    // Чередуем пропорции для колонок (2/3 и 3/2)
    const isEvenColumn = Math.floor(i / 2) % 2 === 0;
    
    // Определяем размеры для первого и второго элемента в колонке
    const firstRatio = isEvenColumn ? 2/5 : 3/5; // 2/5 от высоты для первого элемента в четных колонках, 3/5 в нечетных
    const secondRatio = isEvenColumn ? 3/5 : 2/5; // 3/5 от высоты для второго элемента в четных колонках, 2/5 в нечетных
    
    // Вычисляем высоту каждого элемента
    const firstHeight = containerHeight * firstRatio;
    const secondHeight = containerHeight * secondRatio;
    
    // Вычисляем ширину, сохраняя соотношение сторон
    const firstWidth = (firstItem.width / firstItem.height) * firstHeight;
    const secondWidth = (secondItem.width / secondItem.height) * secondHeight;
    
    // Определяем ширину колонки (берем максимальную ширину из элементов колонки)
    const columnWidth = Math.max(firstWidth, secondWidth);
    
    columnItems.push({
      type: 'column',
      first: {
        ...firstItem,
        displayHeight: firstHeight,
        displayWidth: columnWidth, // одинаковая ширина для элементов в колонке
        yOffset: 0, // первый элемент начинается с верхней границы
      },
      second: {
        ...secondItem,
        displayHeight: secondHeight,
        displayWidth: columnWidth, // одинаковая ширина для элементов в колонке
        yOffset: firstHeight + gap / 2, // второй элемент начинается после первого + половина гэпа
      },
      displayWidth: columnWidth,
      displayHeight: containerHeight,
      isEvenColumn,
    });
  }
  
  return columnItems;
}

export const initHorizontalCanvasCarousel = (id: string, data: CarouselData[], options: InitHorizontalCanvasCarouselOptions) => {
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
        if (requestAnimationFrameId) {
            cancelAnimationFrame(requestAnimationFrameId);
        }

        const ctx = setupCanvas(canvas);
        if (!ctx) return;
        let offset = 0;
        const speed = options.speed / dpr;
        const gap = options.gap / dpr;
        const borderRadius = 40 / dpr;

        // В зависимости от режима, рассчитываем элементы обычным способом или в режиме колонок
        const scaledItems = calculateItemSizes(ctx, mediaItems);
        const items = options.columnMode 
            ? createColumnItems(ctx, scaledItems, gap) 
            : scaledItems;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const totalWidth = items.reduce((sum, item) => sum + item.displayWidth + gap, 0);
            let x = -offset % totalWidth;

            let i = 0;

            while (x < canvas.width + 500) {
                const item = items[i % items.length];
                
                if (options.columnMode && item.type === 'column') {
                    // Отрисовка первого элемента колонки
                    drawRoundedMedia(
                        ctx, 
                        item.first.media, 
                        x, 
                        item.first.yOffset, 
                        item.first.displayWidth, 
                        item.first.displayHeight, 
                        borderRadius
                    );
                    
                    if (item.first.outlineImg) {
                        const outlineHeight = item.first.outlineImg.height * (item.first.displayHeight / item.first.height);
                        ctx.drawImage(
                            item.first.outlineImg.media, 
                            x, 
                            item.first.yOffset, 
                            item.first.displayWidth, 
                            outlineHeight
                        );
                    }
                    
                    // Отрисовка второго элемента колонки
                    drawRoundedMedia(
                        ctx, 
                        item.second.media, 
                        x, 
                        item.second.yOffset, 
                        item.second.displayWidth, 
                        item.second.displayHeight, 
                        borderRadius
                    );
                    
                    if (item.second.outlineImg) {
                        const outlineHeight = item.second.outlineImg.height * (item.second.displayHeight / item.second.height);
                        ctx.drawImage(
                            item.second.outlineImg.media, 
                            x, 
                            item.second.yOffset, 
                            item.second.displayWidth, 
                            outlineHeight
                        );
                    }
                } else {
                    // Обычная отрисовка для режима без колонок
                    drawRoundedMedia(ctx, item.media, x, 0, item.displayWidth, item.displayHeight, borderRadius);
                    if (item.outlineImg) {
                        const outlineHeight = item.outlineImg.height * (item.displayHeight / item.height);
                        ctx.drawImage(item.outlineImg.media, x, 0, item.displayWidth, outlineHeight);
                    }
                }
                
                x += item.displayWidth + gap;
                i++;
            }

            offset += speed;
            if (offset >= totalWidth) {
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

    return start
} 