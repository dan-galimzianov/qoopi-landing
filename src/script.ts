import { initMask } from './mask.js';

import { initCarousel } from './carousel.js';

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

document.addEventListener('DOMContentLoaded', async () => {
  initMask();
  
  // Получаем все пункты навигации
  const navItems = document.querySelectorAll('.hero-section__nav-link');
  
  // Обработчик клика по пункту меню
  let activeSection = "1";

  const updateHeroSectionHeight = (sectionId: string) => {
    const heroSection = document.querySelector('.hero-section__content-container');
    const section = document.querySelector(`.hero-section__content[data-section-id="${sectionId}"]`);
    
    if (heroSection && section) {
      heroSection.style.setProperty('height', `${section.clientHeight}px`);
    }
  }

  // Функция для сброса всех blots
  const resetBlots = () => {
    document.body.classList.remove('blot_1', 'blot_2', 'blot_3', 'blot_4');
  };

  // Функция для навигации к секции
  const navigateToSection = (sectionId: string) => {
    if (!sectionId) return;
    
    // Сначала сбрасываем все blots
    resetBlots();
    
    // Выделяем активный пункт меню в основной навигации
    navItems.forEach(navItem => {
      navItem.classList.remove('hero-section__nav-link_active');
      if (navItem.getAttribute('data-section-id') === sectionId) {
        navItem.classList.add('hero-section__nav-link_active');
      }
    });
    
    // Показываем/скрываем соответствующие секции
    const allSections = document.querySelectorAll('[data-section-id]:not(.hero-section__nav-link):not(.menu-nav-link)');
    
    // Добавляем новый blot только после сброса предыдущего
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
        updateHeroSectionHeight(sectionId);
        initCarousel('carousel1', 0.5);
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
      activeSection = sectionId;
      navigateToSection(sectionId);
    });
  });

  const firstNavItem = navItems[0] as HTMLElement;
      if (firstNavItem) {
        firstNavItem.click();
      }

  // Объект для хранения инициализированных каруселей

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

  
  window.addEventListener('resize', () => {
    updateHeroSectionHeight(activeSection);
  });

  updateHeroSectionHeight(activeSection);

  const textarea = document.querySelectorAll('.textarea-auto-resize');

  textarea?.forEach(item => {
    item.addEventListener('input', () => {
      (item as HTMLTextAreaElement).style.height = 'auto'; // сбросить текущую высоту
      (item as HTMLTextAreaElement).style.height = (item as HTMLTextAreaElement).scrollHeight + 'px'; // установить высоту по содержимому
    });
  });
}); 

