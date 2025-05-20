import { initMask } from './mask.js';

import { carouselData, carouselData2, carouselData3, carouselData4, mobileAboutCarouselData } from './carousel-data';
import { initCanvasCarousel } from './canvas/carousel';
import { initHorizontalCanvasCarousel } from './canvas/horizontalCarousel.js';

const initedCarousel: Record<string, boolean> = {
  '1': false,
  '3': false,
  '4': false,
}

const recalcCarouselBySectionId: Record<string, (() => void)[] > = {
  '1': [],
  '3': [],
  '4': [],
}

const stopCarouselBySectionId: Record<string, (() => void)[] > = {
  '1': [],
  '3': [],
  '4': [],
}

const initCarouselBySectionId: Record<string, (() => void) > = {
  '1': () => {
    if (initedCarousel['1']) {
      console.log('recalc 1');
      recalcCarouselBySectionId['1'].forEach(recalculate => recalculate());
      return;
    }
    const [start1, stop1] = initCanvasCarousel('about-carousel-1', carouselData, { speed: 2, gap: 20 })!;
    const [start2, stop2] = initCanvasCarousel('about-carousel-2', carouselData2, { speed: 3, gap: 20 })!;
    const [start3, stop3] = initHorizontalCanvasCarousel('about-carousel-mobile', mobileAboutCarouselData, { speed: 1, gap: 10, columnMode: true })!;
    initedCarousel['1'] = true;
    stopCarouselBySectionId['1'].push(stop1, stop2, stop3);
    recalcCarouselBySectionId['1'].push(start1, start2, start3);
  },
  '3': () => {
    if (initedCarousel['3']) {
      recalcCarouselBySectionId['3'].forEach(recalculate => recalculate());
      return;
    }
    const [start1, stop1] = initCanvasCarousel('brands-carousel', carouselData3, { speed: 3, gap: 20 })!;
    const [start2, stop2] = initHorizontalCanvasCarousel('brands-media-mobile-carousel', carouselData3, { speed: 1, gap: 10 })!;
    initedCarousel['3'] = true;
    stopCarouselBySectionId['3'].push(stop1, stop2);
    recalcCarouselBySectionId['3'].push(start1, start2);
  },
  '4': () => {
    if (initedCarousel['4']) {
      recalcCarouselBySectionId['4'].forEach(recalculate => recalculate());
      return;
    }
    const [start1, stop1] = initCanvasCarousel('sellers-carousel', carouselData4, { speed: 3, gap: 20 })!;
    const [start2, stop2] = initHorizontalCanvasCarousel('sellers-carousel-mobile', carouselData4, { speed: 1, gap: 10 })!;
    initedCarousel['4'] = true;
    stopCarouselBySectionId['4'].push(stop1, stop2);
    recalcCarouselBySectionId['4'].push(start1, start2);
  },
}

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
      (heroSection as HTMLElement).style.setProperty('height', `${section.clientHeight}px`);
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
        updateHeroSectionHeight(sectionId);
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

      if (stopCarouselBySectionId[activeSection]) {
        stopCarouselBySectionId[activeSection].forEach(stop => stop());
      }
      activeSection = sectionId;
      if (initCarouselBySectionId[activeSection]) {
        console.log('initCarouselBySectionId', activeSection);
        initCarouselBySectionId[activeSection]();
      }
      setTimeout(() => {
        navigateToSection(sectionId);
      }, 100);
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

  const elementsToScale = document.querySelectorAll('.scale-element') as NodeListOf<HTMLElement>;

  elementsToScale.forEach(item => {
    const scale = item.getAttribute('data-scale');
    const windowWidth = window.innerWidth;
    const itemWidth = item.clientWidth;
    const targetWidth = windowWidth * Number(scale);
    const scaleFactor = targetWidth / itemWidth;

    if (scale) {
      item.style.transform = `scale(${scaleFactor})`;
    }

    window.addEventListener('resize', () => {
      const windowWidth = window.innerWidth;
      const itemWidth = item.clientWidth;
      const targetWidth = windowWidth * Number(scale);
      const scaleFactor = targetWidth / itemWidth;

      if (scale) {
        item.style.transform = `scale(${scaleFactor})`;
      }
    });
  });
 });

