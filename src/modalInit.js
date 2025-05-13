// Инициализация модального окна
document.addEventListener('DOMContentLoaded', function() {
  console.log('modalInit.js загружен');
  
  // Находим все кнопки открытия модалки и само модальное окно
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const modal = document.getElementById('modal');
  const brandModal = document.getElementById('brandModal');
  const closeBtn = document.querySelector('.close-modal-btn');
  const successModal = document.getElementById('successModal');
  const successCloseBtn = document.getElementById('successModalClose');
  const successCloseBtnFooter = document.getElementById('successModalCloseBtn');
  
  // Находим специально кнопки открытия в разных секциях
  const mainButtons = document.querySelectorAll('[data-section-id="1"] .open-modal-btn');
  const brandButtons = document.querySelectorAll('[data-section-id="2"] .open-modal-btn');
  // Находим кнопку для брендов в секции 3
  const brandSection3Button = document.querySelector('[data-section-id="3"] .hero-section__desktop-button');
  // Находим кнопки для блоггеров
  const bloggerButton = document.getElementById('openBloggerModalBtn');
  const bloggerMobileButton = document.getElementById('openBloggerMobileBtn');
  // Находим кнопку для продавцов (seller) в секции 4
  const sellerButton = document.getElementById('openSellerModalBtn');

  console.log('Кнопки в секции 1:', mainButtons.length);
  console.log('Кнопки в секции 2:', brandButtons.length);
  console.log('Кнопка бренда в секции 3:', brandSection3Button ? 'найдена' : 'не найдена');
  console.log('Кнопка блоггера в секции 2:', bloggerButton ? 'найдена' : 'не найдена');
  console.log('Мобильная кнопка блоггера:', bloggerMobileButton ? 'найдена' : 'не найдена');
  console.log('Кнопка продавца в секции 4:', sellerButton ? 'найдена' : 'не найдена');
  
  // Инициализация событий только если найдены нужные элементы
  if (modal) {
    console.log('Найдено', openButtons.length, 'кнопок открытия модального окна');
    
    // Сохраняем позицию скролла
    let scrollPosition = 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Функция открытия модального окна
    function openModal() {
      // Сохраняем текущую позицию скролла
      scrollPosition = window.pageYOffset;
      
      // Показываем модальное окно
      modal.style.display = 'flex';
      
      // Добавляем класс для блокировки прокрутки и компенсируем сдвиг
      document.body.classList.add('modal-open');
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Анимируем появление
      setTimeout(function() {
        modal.classList.add('active');
      }, 10);
    }
    
    // Функция закрытия модального окна
    function closeModal() {
      modal.classList.remove('active');
      
      setTimeout(function() {
        modal.style.display = 'none';
        
        // Восстанавливаем прокрутку
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPosition);
      }, 300);
    }
    
    // Функция открытия модального окна успеха
    function openSuccessModal() {
      // Сохраняем текущую позицию скролла, если еще не сохранена
      if (!document.body.classList.contains('modal-open')) {
        scrollPosition = window.pageYOffset;
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Показываем модальное окно успеха
      successModal.style.display = 'flex';
      
      // Анимируем появление
      setTimeout(function() {
        successModal.classList.add('active');
      }, 10);
    }
    
    // Функция закрытия модального окна успеха
    function closeSuccessModal() {
      successModal.classList.remove('active');
      
      setTimeout(function() {
        successModal.style.display = 'none';
        
        // Восстанавливаем прокрутку только если нет других открытых модальных окон
        if (!modal.classList.contains('active') && (!brandModal || !brandModal.classList.contains('active'))) {
          document.body.classList.remove('modal-open');
          document.body.style.top = '';
          document.body.style.paddingRight = '';
          window.scrollTo(0, scrollPosition);
        }
      }, 300);
    }
    
    // Функция открытия модального окна для брендов
    function openBrandModal() {
      if (typeof openBrandModalFunction === 'function') {
        openBrandModalFunction();
      } else if (window.brandMultiSelect) {
        // Прямой вызов функции из brandModals.js
        const brandModalElement = document.getElementById('brandModal');
        if (brandModalElement) {
          brandModalElement.style.display = 'flex';
          setTimeout(function() {
            brandModalElement.classList.add('active');
          }, 10);
        } else {
          console.warn('Элемент модального окна для брендов не найден');
          openModal();
        }
      } else {
        console.warn('Модальное окно для брендов не найдено');
        console.log('Открываем обычное модальное окно вместо модального окна брендов');
        openModal();
      }
    }
    
    // Функция для определения, активна ли секция с данным ID
    function isSectionActive(sectionId) {
      const sections = document.querySelectorAll(`[data-section-id="${sectionId}"]`);
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].classList.contains('section-active')) {
          return true;
        }
      }
      return false;
    }
    
    // Обработчик клика по кнопке с проверкой активной секции
    document.addEventListener('click', function(e) {
      // Проверка на кнопку блоггеров
      if (e.target === bloggerButton || e.target.closest('#openBloggerModalBtn')) {
        e.preventDefault();
        if (isSectionActive('2')) {
          console.log('Клик по кнопке блоггеров в активной секции 2');
          openModal();
        }
      }
      
      // Проверка на мобильную кнопку блоггеров
      if (e.target === bloggerMobileButton || e.target.closest('#openBloggerMobileBtn')) {
        e.preventDefault();
        if (isSectionActive('2')) {
          console.log('Клик по мобильной кнопке блоггеров в активной секции 2');
          openModal();
        }
      }
      
      // Проверка на кнопку брендов
      if (e.target === brandSection3Button || e.target.closest('[data-section-id="3"] .hero-section__desktop-button')) {
        e.preventDefault();
        if (isSectionActive('3')) {
          console.log('Клик по кнопке брендов в активной секции 3');
          openBrandModal();
        }
      }
      
      // Проверка на кнопку продавцов
      if (e.target === sellerButton || e.target.closest('#openSellerModalBtn')) {
        e.preventDefault();
        if (isSectionActive('4')) {
          console.log('Клик по кнопке продавцов в активной секции 4');
          openModal();
        }
      }
    });
    
    // Добавляем обработчики событий для кнопок в секции 1
    mainButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (isSectionActive('1')) {
          console.log('Клик по кнопке в активной секции 1');
          openModal();
        }
      });
    });
    
    // Закрытие основного модального окна
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие по клику на оверлей
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Закрытие модального окна успеха
    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', closeSuccessModal);
    }
    
    if (successCloseBtnFooter) {
      successCloseBtnFooter.addEventListener('click', closeSuccessModal);
    }
    
    // Закрытие по клику на оверлей
    if (successModal) {
      successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
          closeSuccessModal();
        }
      });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (modal.classList.contains('active')) {
          closeModal();
        } else if (successModal && successModal.classList.contains('active')) {
          closeSuccessModal();
        }
      }
    });
    
    // Глобальные объекты для доступа из других частей приложения
    window.modalFunctions = {
      openModal,
      closeModal,
      openSuccessModal,
      closeSuccessModal
    };
  }
}); 