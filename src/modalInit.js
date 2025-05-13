// Инициализация модального окна
document.addEventListener('DOMContentLoaded', function() {
  console.log('modalInit.js загружен');
  
  // Отладочные сообщения для глобальных функций
  console.log('openBrandModalFunction существует:', typeof window.openBrandModalFunction === 'function');
  console.log('brandModals существует:', !!window.brandModals);
  console.log('openSellerModalFunction существует:', typeof window.openSellerModalFunction === 'function');
  console.log('sellerModalFunctions существует:', !!window.sellerModalFunctions);
  
  // Находим все кнопки открытия модалки и модальные окна
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const modal = document.getElementById('modal');
  const brandModal = document.getElementById('brandModal');
  const sellerModal = document.getElementById('sellerModal');
  const closeBtn = document.querySelector('.close-modal-btn');
  const successModal = document.getElementById('successModal');
  const successCloseBtn = document.getElementById('successModalClose');
  const successCloseBtnFooter = document.getElementById('successModalCloseBtn');
  
  // Находим кнопки для различных секций
  const mainButtons = document.querySelectorAll('[data-section-id="1"] .open-modal-btn');
  const bloggerButtons = document.querySelectorAll('[data-section-id="2"] .open-modal-btn');
  const brandSection3Button = document.querySelector('[data-section-id="3"] .hero-section__desktop-button');
  const sellerButtons = document.querySelectorAll('[data-section-id="4"] .open-modal-btn');
  
  // Находим ID-идентификаторы кнопок
  const bloggerButton = document.getElementById('openBloggerModalBtn');
  const bloggerMobileButton = document.getElementById('openBloggerMobileBtn');
  const brandButton = document.getElementById('openBrandModalBtn');  
  const sellerButton = document.getElementById('openSellerModalBtn');

  console.log('Кнопки в секции 1:', mainButtons.length);
  console.log('Кнопки в секции 2:', bloggerButtons.length);
  console.log('Кнопка бренда в секции 3:', brandSection3Button ? 'найдена' : 'не найдена');
  console.log('Кнопка блоггера (ID):', bloggerButton ? 'найдена' : 'не найдена');
  console.log('Мобильная кнопка блоггера (ID):', bloggerMobileButton ? 'найдена' : 'не найдена');
  console.log('Кнопка продавца (ID):', sellerButton ? 'найдена' : 'не найдена');
  
  // Инициализация событий только если найдены нужные элементы
  if (modal) {
    console.log('Найдено', openButtons.length, 'кнопок открытия модального окна');
    
    // Сохраняем позицию скролла
    let scrollPosition = 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Функция открытия модального окна блогера
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
        if (!modal.classList.contains('active') && 
            (!brandModal || !brandModal.classList.contains('active')) &&
            (!sellerModal || !sellerModal.classList.contains('active'))) {
          document.body.classList.remove('modal-open');
          document.body.style.top = '';
          document.body.style.paddingRight = '';
          window.scrollTo(0, scrollPosition);
        }
      }, 300);
    }
    
    // Функция открытия модального окна для брендов
    function openBrandModal() {
      if (window.brandModals && window.brandModals.openBrandModal) {
        console.log('Вызываем openBrandModal из объекта brandModals');
        window.brandModals.openBrandModal();
      } else if (typeof window.openBrandModalFunction === 'function') {
        console.log('Вызываем openBrandModalFunction');
        window.openBrandModalFunction();
      } else {
        console.warn('Функция открытия модального окна брендов не найдена, пробуем открыть напрямую');
        // Пробуем открыть модальное окно напрямую
        if (brandModal) {
          // Сохраняем текущую позицию скролла
          scrollPosition = window.pageYOffset;
          
          brandModal.style.display = 'flex';
          
          // Добавляем класс для блокировки прокрутки
          document.body.classList.add('modal-open');
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.paddingRight = `${scrollbarWidth}px`;
          
          // Анимируем появление
          setTimeout(function() {
            brandModal.classList.add('active');
          }, 10);
        } else {
          console.error('Элемент модального окна брендов не найден');
          openModal(); // Fallback на модальное окно блогеров
        }
      }
    }
    
    // Функция открытия модального окна для селлеров
    function openSellerModal() {
      if (window.sellerModalFunctions && window.sellerModalFunctions.openSellerModal) {
        console.log('Вызываем openSellerModal из объекта sellerModalFunctions');
        window.sellerModalFunctions.openSellerModal();
      } else if (typeof window.openSellerModalFunction === 'function') {
        console.log('Вызываем openSellerModalFunction');
        window.openSellerModalFunction();
      } else {
        console.warn('Функция открытия модального окна селлеров не найдена, пробуем открыть напрямую');
        // Пробуем открыть модальное окно напрямую
        if (sellerModal) {
          // Сохраняем текущую позицию скролла
          scrollPosition = window.pageYOffset;
          
          sellerModal.style.display = 'flex';
          
          // Добавляем класс для блокировки прокрутки
          document.body.classList.add('modal-open');
          document.body.style.top = `-${scrollPosition}px`;
          document.body.style.paddingRight = `${scrollbarWidth}px`;
          
          // Анимируем появление
          setTimeout(function() {
            sellerModal.classList.add('active');
          }, 10);
        } else {
          console.error('Элемент модального окна селлеров не найден');
          openModal(); // Fallback на модальное окно блогеров
        }
      }
    }
    
    // Функция для определения активной секции
    function getActiveSectionId() {
      let activeSectionId = null;
      document.querySelectorAll('[data-section-id]').forEach(section => {
        if (section.classList.contains('section-active')) {
          const id = section.getAttribute('data-section-id');
          if (id) activeSectionId = id;
        }
      });
      return activeSectionId;
    }
    
    // Универсальный обработчик клика для всех кнопок
    document.addEventListener('click', function(e) {
      // Находим ближайшую кнопку (либо саму кнопку, либо её дочерний элемент)
      const button = e.target.closest('button');
      if (!button) return; // Если клик не по кнопке, игнорируем
      
      // Получаем активную секцию
      const activeSectionId = getActiveSectionId();
      console.log('Активная секция:', activeSectionId);
      
      // Проверяем, является ли кнопка кнопкой создания витрины или открытия модального окна
      if (button.classList.contains('hero-section__desktop-button') || 
          button.classList.contains('hero-sliders-mobile__button') ||
          button.classList.contains('open-modal-btn')) {
        
        e.preventDefault();
        
        // Проверяем, есть ли у кнопки ID, который явно указывает, какую модалку открывать
        if (button.id === 'openBloggerModalBtn' || button.id === 'openBloggerMobileBtn') {
          console.log('Открываем модальное окно блогера по ID кнопки');
          openModal();
        } 
        else if (button.id === 'openBrandModalBtn') {
          console.log('Открываем модальное окно бренда по ID кнопки');
          openBrandModal();
        } 
        else if (button.id === 'openSellerModalBtn') {
          console.log('Открываем модальное окно селлера по ID кнопки');
          openSellerModal();
        } 
        // Если у кнопки нет явного ID, определяем модалку по активной секции
        else {
          if (activeSectionId === '1') {
            // Секция "О qoopi"
            console.log('Открываем модальное окно в секции О qoopi');
            openModal();
          } 
          else if (activeSectionId === '2') {
            // Секция "Блогерам"
            console.log('Открываем модальное окно в секции Блогерам');
            openModal();
          } 
          else if (activeSectionId === '3') {
            // Секция "Брендам"
            console.log('Открываем модальное окно в секции Брендам');
            openBrandModal();
          } 
          else if (activeSectionId === '4') {
            // Секция "Селлерам"
            console.log('Открываем модальное окно в секции Селлерам');
            openSellerModal();
          }
        }
      }
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
        } else if (brandModal && brandModal.classList.contains('active')) {
          // Закрытие модального окна брендов по Escape
          if (window.brandModals && window.brandModals.closeBrandModal) {
            window.brandModals.closeBrandModal();
          } else {
            brandModal.classList.remove('active');
            setTimeout(function() {
              brandModal.style.display = 'none';
              document.body.classList.remove('modal-open');
              document.body.style.top = '';
              document.body.style.paddingRight = '';
              window.scrollTo(0, scrollPosition);
            }, 300);
          }
        } else if (sellerModal && sellerModal.classList.contains('active')) {
          // Закрытие модального окна селлеров по Escape
          if (window.sellerModalFunctions && window.sellerModalFunctions.closeSellerModal) {
            window.sellerModalFunctions.closeSellerModal();
          } else {
            sellerModal.classList.remove('active');
            setTimeout(function() {
              sellerModal.style.display = 'none';
              document.body.classList.remove('modal-open');
              document.body.style.top = '';
              document.body.style.paddingRight = '';
              window.scrollTo(0, scrollPosition);
            }, 300);
          }
        } else if (successModal && successModal.classList.contains('active')) {
          closeSuccessModal();
        }
      }
    });
    
    // Закрытие модального окна брендов по клику на оверлей
    if (brandModal) {
      brandModal.addEventListener('click', function(e) {
        if (e.target === brandModal) {
          if (window.brandModals && window.brandModals.closeBrandModal) {
            window.brandModals.closeBrandModal();
          } else {
            brandModal.classList.remove('active');
            setTimeout(function() {
              brandModal.style.display = 'none';
              document.body.classList.remove('modal-open');
              document.body.style.top = '';
              document.body.style.paddingRight = '';
              window.scrollTo(0, scrollPosition);
            }, 300);
          }
        }
      });
    }
    
    // Закрытие модального окна селлеров по клику на оверлей
    if (sellerModal) {
      sellerModal.addEventListener('click', function(e) {
        if (e.target === sellerModal) {
          if (window.sellerModalFunctions && window.sellerModalFunctions.closeSellerModal) {
            window.sellerModalFunctions.closeSellerModal();
          } else {
            sellerModal.classList.remove('active');
            setTimeout(function() {
              sellerModal.style.display = 'none';
              document.body.classList.remove('modal-open');
              document.body.style.top = '';
              document.body.style.paddingRight = '';
              window.scrollTo(0, scrollPosition);
            }, 300);
          }
        }
      });
    }
    
    // Глобальные объекты для доступа из других частей приложения
    window.modalFunctions = {
      openModal,
      closeModal,
      openSuccessModal,
      closeSuccessModal
    };
  }
}); 