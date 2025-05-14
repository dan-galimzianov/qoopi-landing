import { initMask } from './mask.js';

// Функция debounce для оптимизации обработки событий
const debounce = (func: Function, delay: number) => {
  let timeoutId: number;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func.apply(this, args), delay);
  };
};

const waitForVideo = (video: HTMLVideoElement) => {
  return new Promise((resolve) => {
    if (video.readyState >= 3) {
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

// Функция для загрузки отложенных видео
const loadLazyVideos = (container?: HTMLElement) => {
  const parent = container || document;
  const sources = parent.querySelectorAll('source[data-src]');
  
  sources.forEach(source => {
    const src = source.getAttribute('data-src');
    if (src) {
      source.setAttribute('src', src);
      // Удаляем атрибут data-src, чтобы не загружать повторно
      source.removeAttribute('data-src');
      
      // Перезагружаем видео, чтобы применить новый src
      const video = source.parentElement as HTMLVideoElement;
      if (video) {
        video.load();
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initMask();
  
  
  // Получаем все пункты навигации
  const navItems = document.querySelectorAll('.hero-section__nav-link');
  
  // Обработчик клика по пункту меню
  let activeSection = "1";

  // Функция для навигации к секции
  const navigateToSection = (sectionId: string) => {
    if (!sectionId) return;
    
    // Выделяем активный пункт меню в основной навигации
    navItems.forEach(navItem => {
      navItem.classList.remove('hero-section__nav-link_active');
      if (navItem.getAttribute('data-section-id') === sectionId) {
        navItem.classList.add('hero-section__nav-link_active');
      }
    });
    
    // Показываем/скрываем соответствующие секции
    const allSections = document.querySelectorAll('[data-section-id]:not(.hero-section__nav-link):not(.menu-nav-link)');
    document.body.classList.remove(`blot_${activeSection}`);
    document.body.classList.add(`blot_${sectionId}`);
    activeSection = sectionId;
    document.body.classList.remove('loading');

    allSections.forEach(section => {
      const sectionElement = section as HTMLElement;
      if (section.getAttribute('data-section-id') === sectionId) {
        sectionElement.style.setProperty('opacity', '1');
        sectionElement.style.setProperty('visibility', 'visible');
        
        // Загружаем видео для активной секции
        loadLazyVideos(sectionElement);
      } else {
        sectionElement.style.setProperty('opacity', '0');
        sectionElement.style.setProperty('visibility', 'hidden');
      }
    });
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Получаем id секции из атрибута
      const sectionId = item.getAttribute('data-section-id');
      
      if (!sectionId) return;
      navigateToSection(sectionId);
    });
  });
  


  const firstNavItem = navItems[0] as HTMLElement;
      if (firstNavItem) {
        firstNavItem.click();
      }

  // Объект для хранения инициализированных каруселей
  const initializedCarousels: Record<string, { type: 'vertical' | 'horizontal', wrapper: HTMLElement, duration: number }> = {};

  const initCarousel = async (id: string, duration: number) => {
    const carousel = document.getElementById(id);
    if (!carousel) return;

    const carouselWrapper = carousel.querySelector(".carousel__wrapper") as HTMLElement;
    if (!carouselWrapper) return;

    const images = Array.from(carousel.querySelectorAll('img'));
    const videos = Array.from(carousel.querySelectorAll('video'));

    await waitForAllImages(images);
    
    await waitForAllVideos(videos);

    let totalHeight = carouselWrapper.clientHeight;

    const originalContent = carouselWrapper.innerHTML;
    carouselWrapper.innerHTML = originalContent + originalContent;

    carouselWrapper.style.setProperty('--total-slider-height', `-${totalHeight}px`);
    carouselWrapper.style.setProperty('--iteration-time', `${duration}s`);
    carouselWrapper.style.setProperty('animation', "scroll var(--iteration-time) linear infinite");
    
    // Сохраняем карусель в списке инициализированных
    initializedCarousels[id] = { type: 'vertical', wrapper: carouselWrapper, duration };
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

  // Обработчики для навигационных ссылок в меню
  const menuNavLinks = document.querySelectorAll('.menu-nav-link');
  menuNavLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Получаем id секции из элемента
      const element = event.currentTarget as HTMLElement;
      const sectionId = element.getAttribute('data-section-id');
      
      // Закрываем меню
      document.body.classList.remove('menu-open');
      
      // Переходим к соответствующей секции
      if (sectionId) {
        // Небольшая задержка перед навигацией для плавного закрытия меню
        setTimeout(() => {
          navigateToSection(sectionId);
          
          // Находим соответствующий пункт в основной навигации и делаем скролл к нему
          const mainNavItem = document.querySelector(`.hero-section__nav-link[data-section-id="${sectionId}"]`) as HTMLElement;
          if (mainNavItem) {
            mainNavItem.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'start'
            });
          }
        }, 300);
      }
    });
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
    const originalContent = carouselWrapper.innerHTML;
    carouselWrapper.innerHTML = originalContent + originalContent;

    carouselWrapper.style.setProperty('--total-slider-width', `-${totalWidth}px`);
    carouselWrapper.style.setProperty('--iteration-time', `${duration}s`);
    carouselWrapper.style.setProperty('animation', "scroll-horizontal var(--iteration-time) linear infinite");
    
    // Сохраняем карусель в списке инициализированных
    initializedCarousels[id] = { type: 'horizontal', wrapper: carouselWrapper, duration };
  }
  
  // Функция для обновления размеров карусели
  const updateCarouselSize = (id: string) => {
    if (!initializedCarousels[id]) return;
    
    const { type, wrapper, duration } = initializedCarousels[id];
    
    if (type === 'vertical') {
      // Останавливаем анимацию перед пересчетом размеров
      wrapper.style.animation = 'none';
      // Форсируем перерасчет DOM
      void wrapper.offsetWidth;
      
      const totalHeight = wrapper.clientHeight / 2; // Делим на 2, т.к. контент дублирован
      wrapper.style.setProperty('--total-slider-height', `-${totalHeight}px`);
      wrapper.style.setProperty('animation', `scroll ${duration}s linear infinite`);
    } else {
      // Останавливаем анимацию перед пересчетом размеров
      wrapper.style.animation = 'none';
      // Форсируем перерасчет DOM
      void wrapper.offsetWidth;
      
      const totalWidth = wrapper.clientWidth / 2; // Делим на 2, т.к. контент дублирован
      wrapper.style.setProperty('--total-slider-width', `-${totalWidth}px`);
      wrapper.style.setProperty('animation', `scroll-horizontal ${duration}s linear infinite`);
    }
  };
  
  // Функция для инициализации каруселей в зависимости от размера экрана
  const initCarouselsBasedOnScreenSize = async () => {
    const desktopCarouselIds = ['carousel1', 'carousel2', 'carousel3', 'sellers-media-carousel'];
    const mobileCarouselIds = ['hero-sliders-mobile', 'brands-media-mobile-carousel', 'sellers-media-mobile-carousel'];
    
    const isDesktop = window.innerWidth >= 1200;
    
    // Сбрасываем все предыдущие инициализации
    Object.keys(initializedCarousels).forEach(id => {
      const carousel = document.getElementById(id);
      if (carousel) {
        const wrapper = carousel.querySelector('.carousel__wrapper') as HTMLElement;
        if (wrapper) {
          wrapper.style.animation = 'none';
          
          // Восстанавливаем оригинальный контент (без дублирования)
          if (wrapper.children.length > 0) {
            const childrenCount = wrapper.children.length;
            // Удаляем вторую половину дублированных элементов
            for (let i = childrenCount - 1; i >= childrenCount / 2; i--) {
              wrapper.children[i].remove();
            }
          }
        }
      }
    });
    
    // Очищаем список инициализированных каруселей
    Object.keys(initializedCarousels).forEach(key => {
      delete initializedCarousels[key];
    });
    
    if (isDesktop) {
      // Инициализируем десктопные карусели 
      for (const id of desktopCarouselIds) {
        const duration = id === 'carousel1' ? 17 : 15;
        await initCarousel(id, duration);
      }
    } else {
      // Инициализируем мобильные карусели
      for (const id of mobileCarouselIds) {
        await initHorizontalCarousel(id, 20);
      }
    }
  };
  
  // Функция для обновления всех каруселей
  const updateAllCarousels = () => {
    Object.keys(initializedCarousels).forEach(id => {
      updateCarouselSize(id);
    });
  };
  
  // Инициализируем карусели при загрузке
  initCarouselsBasedOnScreenSize();
  
  // Обработчик изменения размера окна с debounce
  window.addEventListener('resize', debounce(() => {
    // Если ширина окна меняется с десктопа на мобильный или наоборот
    const isDesktopNow = window.innerWidth >= 1200;
    const wasDesktop = Object.keys(initializedCarousels).some(id => 
      ['carousel1', 'carousel2', 'carousel3', 'sellers-media-carousel'].includes(id)
    );
    
    if (isDesktopNow !== wasDesktop) {
      // Полная реинициализация каруселей
      initCarouselsBasedOnScreenSize();
    } else {
      // Только обновляем размеры
      updateAllCarousels();
    }
  }, 150));

  const textarea = document.querySelectorAll('.textarea-auto-resize');

  textarea?.forEach(item => {
    item.addEventListener('input', () => {
      (item as HTMLTextAreaElement).style.height = 'auto'; // сбросить текущую высоту
      (item as HTMLTextAreaElement).style.height = (item as HTMLTextAreaElement).scrollHeight + 'px'; // установить высоту по содержимому
    });
  });
}); 

