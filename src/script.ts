const waitForVideo = (video: HTMLVideoElement) => {
  return new Promise((resolve) => {
    if (video.readyState >= 3) {
      console.log("video is ready");
      resolve(video);
    } else {
      video.addEventListener('loadeddata', resolve);
    }
  });
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

  const initCarousel = async (id: string, duration: number) => {
    const carousel = document.getElementById(id);
    if (!carousel) return;

    const carouselWrapper = carousel.querySelector(".carousel__wrapper") as HTMLElement;
    if (!carouselWrapper) return;

    const images = Array.from(carousel.querySelectorAll('img'));
    const videos = Array.from(carousel.querySelectorAll('video'));

    await waitForAllImages(images);
    await waitForAllVideos(videos);
    console.log("all images and videos are ready");

    let totalHeight = carouselWrapper.clientHeight;

    console.log(totalHeight);
    const originalContent = carouselWrapper.innerHTML;
    carouselWrapper.innerHTML = originalContent + originalContent;

    carouselWrapper.style.setProperty('--total-slider-height', `-${totalHeight}px`);
    carouselWrapper.style.setProperty('--iteration-time', `${duration}s`);
    carouselWrapper.style.setProperty('animation', "scroll var(--iteration-time) linear infinite");
  }

  // Функционал для меню
  const burgerButton = document.querySelector('.header__menu-burger');
  const closeButton = document.getElementById('closeBtn');
  const menuOverlay = document.getElementById('menuOverlay');

  // Открытие меню при клике на бургер
  burgerButton?.addEventListener('click', function(event) {
    event.stopPropagation(); // Предотвращаем всплытие события
    document.body.classList.add('menu-open');
  });

  // Закрытие меню при клике на крестик
  closeButton?.addEventListener('click', function(event) {
    event.stopPropagation(); // Предотвращаем всплытие события
    document.body.classList.remove('menu-open');
  });

  // Закрытие меню при клике вне меню
  document.addEventListener('click', function(event) {
    // Обрабатываем только если меню открыто
    if (document.body.classList.contains('menu-open')) {
      // Если кликнули не по меню и не по кнопке бургера
      if (menuOverlay && burgerButton && 
          !menuOverlay.contains(event.target as Node) && 
          !burgerButton.contains(event.target as Node)) {
        document.body.classList.remove('menu-open');
      }
    }
  });

  const initHorizontalCarousel = async (id: string, duration: number) => {
    const carousel = document.getElementById(id);
    if (!carousel) return;

    const carouselWrapper = carousel.querySelector(".carousel__wrapper") as HTMLElement;
    if (!carouselWrapper) return;

    const images = Array.from(carousel.querySelectorAll('img'));
    const videos = Array.from(carousel.querySelectorAll('video'));

    await waitForAllImages(images);
    await waitForAllVideos(videos);

    let totalWidth = carouselWrapper.clientWidth;
    console.log(totalWidth);
    const originalContent = carouselWrapper.innerHTML;
    carouselWrapper.innerHTML = originalContent + originalContent;

    carouselWrapper.style.setProperty('--total-slider-width', `-${totalWidth}px`);
    carouselWrapper.style.setProperty('--iteration-time', `${duration}s`);
    carouselWrapper.style.setProperty('animation', "scroll-horizontal var(--iteration-time) linear infinite");
  }

  // Инициализация вертикальных каруселей для десктопа
  initCarousel('carousel1', 5);
  initCarousel('carousel2', 15);
  
  // Инициализация горизонтальной карусели
  initHorizontalCarousel('hero-sliders-mobile', 20);
}); 

