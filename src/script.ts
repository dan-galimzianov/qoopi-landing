const waitForVideo = (video: HTMLVideoElement) => {
  return new Promise((resolve) => video.readyState >= 3 ? resolve(video) : video.addEventListener('loadeddata', resolve));
}

const waitForImage = (image: HTMLImageElement) => {
  return new Promise((resolve) => image.complete ? resolve(image) : image.addEventListener('load', resolve));
}

const waitForAllVideos = (videos: HTMLVideoElement[]) => {
  return Promise.all(videos.map(video => waitForVideo(video)));
}

const waitForAllImages = (images: HTMLImageElement[]) => {
  return Promise.all(images.map(image => waitForImage(image)));
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Загрузка страницы...');
  
  // Получаем все пункты навигации
  const navItems = document.querySelectorAll('.hero-section__nav-item');
  
  // Обработчик клика по пункту меню
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Получаем id секции из атрибута
      const sectionId = item.getAttribute('data-section-id');
      
      if (!sectionId) return;
      
      // Выделяем активный пункт меню
      navItems.forEach(navItem => {
        navItem.classList.remove('hero-section__nav-item_active');
      });
      item.classList.add('hero-section__nav-item_active');
      
      // Показываем/скрываем соответствующие секции
      const allSections = document.querySelectorAll('[data-section-id]');
      allSections.forEach(section => {
        if (section.getAttribute('data-section-id') === sectionId) {
          section.classList.add('section-active');
        } else {
          section.classList.remove('section-active');
        }
      });
    });
  });
  
  // Активируем первую секцию по умолчанию
  const firstNavItem = navItems[0] as HTMLElement;
  if (firstNavItem) {
    firstNavItem.click();
  }


  async function initCarousel(id: string, scrollSpeed: number, direction: 'vertical' | 'horizontal') {
    const mediaStack = document.getElementById(id);
    const isHorizontal = direction === 'horizontal';

    if (!mediaStack) return;

    const mediaItems = mediaStack.querySelectorAll('.media-item');
    let currentPosition = 0;
    
    // Вычисляем высоту всех элементов с отступами
    let totalHeight = 0;
    
    // Клонируем элементы для бесшовности
    mediaItems.forEach(item => {
        const clone = item.cloneNode(true);
        mediaStack.appendChild(clone);
    });
    
    // Анимация прокрутки
    const animate = () => {
        currentPosition -= scrollSpeed;
        
        if (-currentPosition >= totalHeight) {
            currentPosition += totalHeight;
        }
        
        mediaStack.style.transform = isHorizontal ? `translateX(${currentPosition}px)` : `translateY(${currentPosition}px)`;

        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 10)
    }
    
    // Ожидаем загрузки медиа
    Promise.all([
        waitForAllVideos(Array.from(mediaStack.querySelectorAll('video'))),
        waitForAllImages(Array.from(mediaStack.querySelectorAll('img')))
    ]).then(() => {
        mediaItems.forEach(item => {
            totalHeight += isHorizontal ? item.clientWidth : item.clientHeight + 16;
        });
        requestAnimationFrame(animate);
    });
  }
  
  // Инициализация вертикальных каруселей для десктопа
  initCarousel('carousel1', 1.5, 'vertical');
  initCarousel('carousel2', 0.9, 'vertical');
  initCarousel('horizontal-carousel', 1.5, 'horizontal');

}); 

