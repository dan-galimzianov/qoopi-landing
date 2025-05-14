import './modal';
import './forms/main';
import './multiselect/main';

import { initMask } from './mask.js';

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

document.addEventListener('DOMContentLoaded', () => {
  console.log('Загрузка страницы...');
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

    allSections.forEach(section => {
      const sectionElement = section as HTMLElement;
      if (section.getAttribute('data-section-id') === sectionId) {
        sectionElement.style.setProperty('opacity', '1');
        sectionElement.style.setProperty('visibility', 'visible');
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
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
      
      navigateToSection(sectionId);
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
    console.log(totalWidth);
    const originalContent = carouselWrapper.innerHTML;
    carouselWrapper.innerHTML = originalContent + originalContent;

    carouselWrapper.style.setProperty('--total-slider-width', `-${totalWidth}px`);
    carouselWrapper.style.setProperty('--iteration-time', `${duration}s`);
    carouselWrapper.style.setProperty('animation', "scroll-horizontal var(--iteration-time) linear infinite");
  }

  // Инициализация вертикальных каруселей для десктопа
  initCarousel('carousel1', 17);
  initCarousel('carousel2', 15);
  initCarousel('carousel3', 15);
  initCarousel('sellers-media-carousel', 15);
  
  // Инициализация горизонтальной карусели
  initHorizontalCarousel('hero-sliders-mobile', 20);
  initHorizontalCarousel('brands-media-mobile-carousel', 20);
  initHorizontalCarousel('sellers-media-mobile-carousel', 20);
}); 

