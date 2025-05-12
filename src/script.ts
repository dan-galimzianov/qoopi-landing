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


  async function initCarousel(id: string, scrollSpeed: number) {
    const mediaStack = document.getElementById(id);

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
        
        mediaStack.style.transform = `translateY(${currentPosition}px)`;
        requestAnimationFrame(animate);
    }
    
    // Ожидаем загрузки медиа
    Promise.all([
        waitForAllVideos(Array.from(mediaStack.querySelectorAll('video'))),
        waitForAllImages(Array.from(mediaStack.querySelectorAll('img')))
    ]).then(() => {
        mediaItems.forEach(item => {
            totalHeight += item.clientHeight + 16;
        });
        requestAnimationFrame(animate);
    });
  }
  
  // Инициализация вертикальных каруселей для десктопа
  initCarousel('carousel1', 1.5);
  initCarousel('carousel2', 0.9);

  // Функция для инициализации горизонтальной карусели для мобильных устройств
  async function initHorizontalCarousel(containerId: string, scrollSpeed: number) {
    const mobileSlider = document.querySelector(`.hero-sliders-mobile[data-section-id="${containerId}"] .hero-sliders-mobile__slider`);
    
    if (!mobileSlider) return;
    
    // Очищаем содержимое слайдера перед добавлением элементов
    mobileSlider.innerHTML = '';
    
    // Создаем контейнер для горизонтальной карусели
    const horizontalCarousel = document.createElement('div');
    horizontalCarousel.className = 'horizontal-carousel';
    horizontalCarousel.style.display = 'flex';
    horizontalCarousel.style.position = 'relative';
    horizontalCarousel.style.width = 'auto';
    horizontalCarousel.style.height = '100%';
    horizontalCarousel.style.overflow = 'hidden';
    
    // Создаем контейнер для медиа-элементов
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'horizontal-carousel__container';
    mediaContainer.style.display = 'flex';
    mediaContainer.style.position = 'absolute';
    mediaContainer.style.height = '100%';
    mediaContainer.style.willChange = 'transform'; // Улучшает производительность анимации
    
    // Получаем все медиа-элементы из обоих вертикальных каруселей
    const carousel1 = document.getElementById('carousel1');
    const carousel2 = document.getElementById('carousel2');
    
    if (!carousel1 || !carousel2) return;
    
    const mediaItems1 = Array.from(carousel1.querySelectorAll('.media-item'));
    const mediaItems2 = Array.from(carousel2.querySelectorAll('.media-item'));
    
    // Создаем пары элементов (столбики) из медиа-элементов
    const maxLength = Math.min(mediaItems1.length, mediaItems2.length);
    
    // Создаем колонки с парами элементов
    for (let i = 0; i < maxLength; i++) {
      const columnDiv = document.createElement('div');
      columnDiv.className = 'media-column';
      columnDiv.style.display = 'flex';
      columnDiv.style.flexDirection = 'column';
      columnDiv.style.marginRight = '6px';
      columnDiv.style.width = 'calc(33.33vw - 6px)';
      
      // Чередуем высоту элементов в столбиках
      const isFirstPattern = i % 2 === 0; // Для четных индексов - первый тип соотношения, для нечетных - второй
      
      // Верхний элемент (из первой карусели)
      if (mediaItems1[i]) {
        const topItem = mediaItems1[i].cloneNode(true) as HTMLElement;
        
        // Назначаем высоту в зависимости от типа столбца
        if (isFirstPattern) {
          // Первый тип: верхний элемент занимает 1/3 высоты
          topItem.style.height = 'calc(33.33% - 3px)';
        } else {
          // Второй тип: верхний элемент занимает 2/3 высоты
          topItem.style.height = 'calc(66.66% - 3px)';
        }
        
        topItem.style.marginBottom = '6px';
        
        // Добавляем атрибуты для видео
        const topVideo = topItem.querySelector('video');
        if (topVideo) {
          topVideo.setAttribute('loop', '');
          topVideo.setAttribute('muted', '');
          topVideo.setAttribute('autoplay', '');
          topVideo.setAttribute('playsinline', '');
        }
        
        columnDiv.appendChild(topItem);
      }
      
      // Нижний элемент (из второй карусели)
      if (mediaItems2[i]) {
        const bottomItem = mediaItems2[i].cloneNode(true) as HTMLElement;
        
        // Назначаем высоту в зависимости от типа столбца
        if (isFirstPattern) {
          // Первый тип: нижний элемент занимает 2/3 высоты
          bottomItem.style.height = 'calc(66.66% - 3px)';
        } else {
          // Второй тип: нижний элемент занимает 1/3 высоты
          bottomItem.style.height = 'calc(33.33% - 3px)';
        }
        
        // Добавляем атрибуты для видео
        const bottomVideo = bottomItem.querySelector('video');
        if (bottomVideo) {
          bottomVideo.setAttribute('loop', '');
          bottomVideo.setAttribute('muted', '');
          bottomVideo.setAttribute('autoplay', '');
          bottomVideo.setAttribute('playsinline', '');
        }
        
        columnDiv.appendChild(bottomItem);
      }
      
      mediaContainer.appendChild(columnDiv);
    }
    
    // Дублируем колонки для бесшовной прокрутки
    const columns = Array.from(mediaContainer.querySelectorAll('.media-column'));
    columns.forEach(column => {
      const columnClone = column.cloneNode(true) as HTMLElement;
      
      // Активируем видео в клонированных элементах
      const videos = columnClone.querySelectorAll('video');
      videos.forEach(video => {
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        
        // Явно воспроизводим видео
        video.play().catch(e => console.log('Autoplay prevented:', e));
      });
      
      mediaContainer.appendChild(columnClone);
    });
    
    horizontalCarousel.appendChild(mediaContainer);
    mobileSlider.appendChild(horizontalCarousel);
    
    // Вычисляем общую ширину для бесконечной прокрутки
    let totalWidth = 0;
    columns.forEach(column => {
      const columnElement = column as HTMLElement;
      totalWidth += columnElement.offsetWidth + 6; // Ширина колонки + правый margin (6px)
    });
    
    // Анимация прокрутки
    let currentPosition = 0;
    
    const animate = () => {
      currentPosition -= scrollSpeed;
      
      if (-currentPosition >= totalWidth) {
        currentPosition += totalWidth;
      }
      
      mediaContainer.style.transform = `translateX(${currentPosition}px)`;
      requestAnimationFrame(animate);
    };
    
    // Ожидаем загрузки медиа
    Promise.all([
      waitForAllVideos(Array.from(mediaContainer.querySelectorAll('video'))),
      waitForAllImages(Array.from(mediaContainer.querySelectorAll('img')))
    ]).then(() => {
      // Запускаем анимацию прокрутки
      requestAnimationFrame(animate);
    });
    
    // Повторно запускаем видео при видимости страницы
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        const videos = mediaContainer.querySelectorAll('video');
        videos.forEach(video => {
          video.play().catch(e => console.log('Play prevented:', e));
        });
      }
    });
  }
  
  // Функция для определения потребности в мобильном представлении
  function checkWindowSize() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      // Инициализируем горизонтальные карусели для секций
      initHorizontalCarousel('1', 1.2);
      initHorizontalCarousel('2', 1.2);
    }
  }
  
  // Проверяем размер окна при загрузке страницы
  checkWindowSize();
  
  // Проверяем размер окна при изменении размера окна
  window.addEventListener('resize', checkWindowSize);
}); 

