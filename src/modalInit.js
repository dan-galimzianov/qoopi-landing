// Инициализация модального окна
console.clear(); // Очищаем консоль при загрузке файла
console.log('%c === МОДАЛЬНЫЕ ОКНА: ОТЛАДКА === ', 'background: #222; color: #bada55; font-size: 14px; padding: 5px;');

// Создаем глобальную функцию для отслеживания открытия модальных окон
window._debugModalOpening = true; // Включаем отладку
window._originalModalDisplay = {}; // Для хранения оригинальных display свойств

// Переопределяем метод Element.prototype.style.__lookupSetter__
const originalStyleSetter = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'display').set;

// Перехватываем все попытки установить display: flex для модальных окон
Object.defineProperty(CSSStyleDeclaration.prototype, 'display', {
  set: function(value) {
    if (window._debugModalOpening && this._owningElement && 
        (this._owningElement.id === 'modal' || 
         this._owningElement.id === 'brandModal' || 
         this._owningElement.id === 'sellerModal')) {
      
      if (value === 'flex') {
        console.log(`%c ОТКРЫТИЕ МОДАЛЬНОГО ОКНА: ${this._owningElement.id}`, 'background: #007ACC; color: white; padding: 3px;');
        console.trace('Стек вызовов для открытия модального окна:');
      } else if (value === 'none') {
        console.log(`%c ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА: ${this._owningElement.id}`, 'background: #6b1b1b; color: white; padding: 3px;');
      }
    }
    return originalStyleSetter.call(this, value);
  },
  configurable: true
});

// НОВЫЕ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ОТЛАДКИ
let bloggerModalFound = false;

document.addEventListener('DOMContentLoaded', function() {
  console.log('modalInit.js загружен');
  
  // СПЕЦИАЛЬНАЯ ОТЛАДКА ДЛЯ КНОПКИ БЛОГЕРОВ
  setTimeout(function() {
    const bloggerBtn = document.getElementById('openBloggerModalBtn');
    if (bloggerBtn) {
      console.log('ОТЛАДКА: Нашли кнопку блогеров', bloggerBtn);
      console.log('ОТЛАДКА: HTML кнопки:', bloggerBtn.outerHTML);
      console.log('ОТЛАДКА: Обработчики событий:', !!bloggerBtn.onclick, !!bloggerBtn._events);
      
      // Проверяем, в какой секции находится кнопка
      const parentSection = bloggerBtn.closest('[data-section-id]');
      if (parentSection) {
        console.log('ОТЛАДКА: Кнопка блогеров находится в секции с ID:', parentSection.getAttribute('data-section-id'));
      } else {
        console.error('ОТЛАДКА: Кнопка блогеров не имеет родительской секции с data-section-id');
      }
      
      // Добавляем прямой обработчик
      bloggerBtn.addEventListener('click', function(e) {
        console.log('ОТЛАДКА: Прямой click на кнопку блогеров');
        e.preventDefault();
        e.stopPropagation();
        
        try {
          // Получаем модальное окно блогеров напрямую
          const modalElement = document.getElementById('modal');
          if (modalElement) {
            console.log('ОТЛАДКА: Нашли модальное окно блогеров по ID modal');
            
            // Сохраняем текущую позицию скролла
            const scrollPosition = window.pageYOffset;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            // Показываем модальное окно напрямую
            modalElement.style.display = 'flex';
            
            // Добавляем класс для блокировки прокрутки
            document.body.classList.add('modal-open');
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            
            // Анимируем появление
            setTimeout(function() {
              modalElement.classList.add('active');
            }, 10);
            
            console.log('ОТЛАДКА: Модальное окно блогеров открыто напрямую');
          } else {
            console.error('ОТЛАДКА: Не удалось найти модальное окно по ID modal');
          }
        } catch (error) {
          console.error('ОШИБКА при открытии модального окна:', error);
        }
      });
      
      // Создаем кнопку аварийного открытия модального окна на странице
      try {
        // Создаем кнопку аварийного открытия
        const emergencyButton = document.createElement('button');
        emergencyButton.innerText = '⚠️ SOS: Открыть модальное окно блогера';
        emergencyButton.style.position = 'fixed';
        emergencyButton.style.right = '10px';
        emergencyButton.style.bottom = '10px';
        emergencyButton.style.zIndex = '9999';
        emergencyButton.style.padding = '10px';
        emergencyButton.style.background = '#ff5722';
        emergencyButton.style.color = 'white';
        emergencyButton.style.border = 'none';
        emergencyButton.style.borderRadius = '5px';
        emergencyButton.style.cursor = 'pointer';
        
        // Добавляем обработчик клика
        emergencyButton.addEventListener('click', function() {
          console.log('ОТЛАДКА: Клик по аварийной кнопке');
          const modalElement = document.getElementById('modal');
          if (modalElement) {
            // Открываем модальное окно напрямую
            modalElement.style.display = 'flex';
            modalElement.classList.add('active');
            
            // Блокируем прокрутку
            document.body.classList.add('modal-open');
          }
        });
        
        // Добавляем кнопку на страницу
        document.body.appendChild(emergencyButton);
        console.log('ОТЛАДКА: Добавлена аварийная кнопка открытия модального окна');
      } catch (e) {
        console.error('ОШИБКА при создании аварийной кнопки:', e);
      }
      
      console.log('ОТЛАДКА: Добавлен прямой обработчик для кнопки блогеров');
    } else {
      console.error('ОТЛАДКА: Кнопка блогеров не найдена по ID openBloggerModalBtn');
      
      // Пробуем найти кнопку по селектору
      const alternativeBtn = document.querySelector('[data-section-id="2"] .hero-section__desktop-button');
      if (alternativeBtn) {
        console.log('ОТЛАДКА: Нашли альтернативную кнопку блогеров', alternativeBtn);
        
        // Добавляем прямой обработчик
        alternativeBtn.addEventListener('click', function(e) {
          console.log('ОТЛАДКА: Клик по альтернативной кнопке блогеров');
          e.preventDefault();
          e.stopPropagation();
          
          // Открываем модальное окно блогеров напрямую
          const modalElement = document.getElementById('modal');
          if (modalElement) {
            modalElement.style.display = 'flex';
            modalElement.classList.add('active');
            document.body.classList.add('modal-open');
          }
        });
        
        console.log('ОТЛАДКА: Добавлен обработчик для альтернативной кнопки блогеров');
      } else {
        console.error('ОТЛАДКА: Не удалось найти ни одну кнопку блогеров');
      }
    }
  }, 1000); // Даем время для полной загрузки DOM
  
  // Отладочные сообщения для глобальных функций
  console.log('openBrandModalFunction существует:', typeof window.openBrandModalFunction === 'function');
  console.log('brandModals существует:', !!window.brandModals);
  console.log('openSellerModalFunction существует:', typeof window.openSellerModalFunction === 'function');
  console.log('sellerModalFunctions существует:', !!window.sellerModalFunctions);
  console.log('bloggerModalFunctions существует:', !!window.bloggerModalFunctions);
  
  // Находим все кнопки открытия модалки и модальные окна
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const modal = document.getElementById('modal');
  const brandModal = document.getElementById('brandModal');
  const sellerModal = document.getElementById('sellerModal');
  const closeBtn = document.querySelector('.close-modal-btn');
  const successModal = document.getElementById('successModal');
  const successCloseBtn = document.getElementById('successModalClose');
  const successCloseBtnFooter = document.getElementById('successModalCloseBtn');
  
  // Находим кнопки для различных секций с конкретными ID
  const bloggerButton = document.getElementById('openBloggerModalBtn');
  const bloggerMobileButton = document.getElementById('openBloggerMobileBtn');
  const brandButton = document.getElementById('openBrandModalBtn');  
  const brandMobileButton = document.getElementById('openBrandMobileBtn');
  const sellerButton = document.getElementById('openSellerModalBtn');
  const sellerMobileButton = document.getElementById('openSellerMobileBtn');
  
  // Находим другие кнопки
  const mainButtons = document.querySelectorAll('[data-section-id="1"] .open-modal-btn');
  const bloggerButtons = document.querySelectorAll('[data-section-id="2"] .open-modal-btn');
  const brandButtons = document.querySelectorAll('[data-section-id="3"] .open-modal-btn, .brands-media .open-modal-btn');
  const sellerButtons = document.querySelectorAll('[data-section-id="4"] .open-modal-btn, .sellers-media .open-modal-btn');
  const mainSliderMobileButton = document.querySelector('.hero-sliders-mobile__button');

  console.log('Кнопки в секции 1 (О qoopi):', mainButtons.length);
  console.log('Кнопки в секции 2 (Блогерам):', bloggerButtons.length);
  console.log('Кнопки в секции 3 (Брендам):', brandButtons.length);
  console.log('Кнопки в секции 4 (Селлерам):', sellerButtons.length);
  console.log('Кнопка блоггера (ID):', bloggerButton ? 'найдена' : 'не найдена');
  console.log('Мобильная кнопка блоггера (ID):', bloggerMobileButton ? 'найдена' : 'не найдена');
  console.log('Кнопка бренда (ID):', brandButton ? 'найдена' : 'не найдена');
  console.log('Мобильная кнопка бренда (ID):', brandMobileButton ? 'найдена' : 'не найдена');
  console.log('Кнопка продавца (ID):', sellerButton ? 'найдена' : 'не найдена');
  console.log('Мобильная кнопка продавца (ID):', sellerMobileButton ? 'найдена' : 'не найдена');
  console.log('Мобильная кнопка слайдера:', mainSliderMobileButton ? 'найдена' : 'не найдена');
  if (mainSliderMobileButton) {
    console.log('ID мобильной кнопки слайдера:', mainSliderMobileButton.id);
  }
  
  // Проверяем состояние модальных окон
  console.log('Состояние модальных окон:');
  console.log('modal =', modal ? 'найден' : 'не найден');
  console.log('brandModal =', brandModal ? 'найден' : 'не найден');
  console.log('sellerModal =', sellerModal ? 'найден' : 'не найден');
  
  // Дополнительная проверка модального окна блогеров
  bloggerModalFound = !!document.getElementById('modal');
  console.log('Модальное окно блогеров (по ID "modal"):', bloggerModalFound ? 'найдено' : 'не найдено');
  
  // Инициализация событий только если найдены нужные элементы
  if (modal) {
    console.log('Найдено', openButtons.length, 'кнопок открытия модального окна');
    
    // Принудительная инициализация модальных окон
    console.log('Инициализация модальных окон...');
    
    // Инициализация модального окна блогеров
    if (modal) {
      console.log('Инициализация модального окна блогеров');
      // Сброс стилей
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '1';
    } else {
      console.error('Модальное окно блогеров не найдено!');
    }
    
    // Инициализация модального окна брендов
    if (brandModal) {
      console.log('Инициализация модального окна брендов');
      // Сброс стилей
      brandModal.classList.remove('active');
      brandModal.style.display = 'none';
      brandModal.style.opacity = '1';
    } else {
      console.warn('Модальное окно брендов не найдено!');
    }
    
    // Инициализация модального окна селлеров
    if (sellerModal) {
      console.log('Инициализация модального окна селлеров');
      // Сброс стилей
      sellerModal.classList.remove('active');
      sellerModal.style.display = 'none';
      sellerModal.style.opacity = '1';
    } else {
      console.warn('Модальное окно селлеров не найдено!');
    }
    
    // Добавляем экстренный глобальный метод для прямого открытия модалок
    window._emergencyModalOpen = {
      blogger: openBloggerModalDirect,
      brand: openBrandModal,
      seller: openSellerModal
    };
    
    console.log('Создан экстренный метод открытия модалок window._emergencyModalOpen');
    console.log('Для открытия модального окна блогеров используйте: window._emergencyModalOpen.blogger()');
    console.log('Для открытия модального окна брендов используйте: window._emergencyModalOpen.brand()');
    console.log('Для открытия модального окна селлеров используйте: window._emergencyModalOpen.seller()');
    
    // Добавляем атрибуты data-modal-type для всех кнопок в секциях
    let buttonsInitialized = 0;
    
    // Для кнопок в секции "Селлерам"
    sellerButtons.forEach(button => {
      if (!button.hasAttribute('data-modal-type')) {
        button.setAttribute('data-modal-type', 'seller');
        buttonsInitialized++;
      }
    });
    
    // Для кнопок в секции "Брендам"
    brandButtons.forEach(button => {
      if (!button.hasAttribute('data-modal-type')) {
        button.setAttribute('data-modal-type', 'brand');
        buttonsInitialized++;
      }
    });
    
    // Для кнопок в секции "Блогерам"
    bloggerButtons.forEach(button => {
      if (!button.hasAttribute('data-modal-type')) {
        button.setAttribute('data-modal-type', 'blogger');
        buttonsInitialized++;
      }
    });
    
    // Для кнопок в секции "О qoopi"
    mainButtons.forEach(button => {
      if (!button.hasAttribute('data-modal-type')) {
        button.setAttribute('data-modal-type', 'blogger');
        buttonsInitialized++;
      }
    });
    
    // Для кнопки в секции "hero-sliders-mobile"
    if (mainSliderMobileButton && !mainSliderMobileButton.hasAttribute('data-modal-type')) {
      mainSliderMobileButton.setAttribute('data-modal-type', 'blogger');
      buttonsInitialized++;
    }
    
    console.log(`Инициализировано ${buttonsInitialized} кнопок с атрибутом data-modal-type`);
    
    // Сохраняем позицию скролла
    let scrollPosition = 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Функция прямого открытия модального окна блогера
    function openBloggerModalDirect() {
      console.log('Вызвана функция прямого открытия модального окна блогеров');
      
      // Получаем элемент модального окна
      const bloggerModal = document.getElementById('modal');
      
      if (!bloggerModal) {
        console.error('Модальное окно блогеров не найдено по ID "modal"');
        return;
      }
      
      try {
        // Сохраняем текущую позицию скролла
        scrollPosition = window.pageYOffset;
        
        // Показываем модальное окно (используем непосредственно DOM-операции)
        bloggerModal.style.display = 'flex';
        
        // Добавляем класс для блокировки прокрутки
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // Анимируем появление
        setTimeout(function() {
          bloggerModal.classList.add('active');
        }, 10);
        
        console.log('Модальное окно блогера открыто успешно');
      } catch (err) {
        console.error('Ошибка при прямом открытии модального окна блогеров:', err);
      }
    }
    
    // Модифицируем функцию openModal, чтобы она использовала прямое открытие как запасной вариант
    function openModal() {
      console.log('Вызвана функция openModal для модального окна блогеров');
      
      // Проверяем наличие функций в bloggerModalFunctions
      if (window.bloggerModalFunctions) {
        console.log('bloggerModalFunctions найден:', Object.keys(window.bloggerModalFunctions));
      } else {
        console.log('bloggerModalFunctions не найден');
      }
      
      // Проверяем все возможные варианты открытия
      if (window.bloggerModalFunctions && typeof window.bloggerModalFunctions.openModal === 'function') {
        console.log('Пробуем открыть через bloggerModalFunctions.openModal');
        try {
          window.bloggerModalFunctions.openModal();
          return;
        } catch (e) {
          console.error('Ошибка при вызове bloggerModalFunctions.openModal:', e);
        }
      }
      
      if (window.openBloggerModal && typeof window.openBloggerModal === 'function') {
        console.log('Пробуем открыть через window.openBloggerModal');
        try {
          window.openBloggerModal();
          return;
        } catch (e) {
          console.error('Ошибка при вызове window.openBloggerModal:', e);
        }
      }
      
      // Если ни один из методов не сработал, используем прямое открытие
      console.log('Используем прямое открытие модального окна блогеров');
      openBloggerModalDirect();
    }
    
    // Функция закрытия модального окна
    function closeModal() {
      // Используем функцию из bloggerModal.js, если она доступна
      if (window.bloggerModalFunctions && window.bloggerModalFunctions.closeModal) {
        console.log('Вызываем closeModal из объекта bloggerModalFunctions');
        window.bloggerModalFunctions.closeModal();
        return;
      }
      
      console.log('Используем встроенную функцию closeModal');
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
      // Используем функцию из bloggerModal.js, если она доступна
      if (window.bloggerModalFunctions && window.bloggerModalFunctions.openSuccessModal) {
        console.log('Вызываем openSuccessModal из объекта bloggerModalFunctions');
        window.bloggerModalFunctions.openSuccessModal();
        return;
      }
      
      console.log('Используем встроенную функцию openSuccessModal');
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
      // Используем функцию из bloggerModal.js, если она доступна
      if (window.bloggerModalFunctions && window.bloggerModalFunctions.closeSuccessModal) {
        console.log('Вызываем closeSuccessModal из объекта bloggerModalFunctions');
        window.bloggerModalFunctions.closeSuccessModal();
        return;
      }
      
      console.log('Используем встроенную функцию closeSuccessModal');
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
    
    // Модифицируем НОВЫЙ обработчик для всех кнопок
    document.addEventListener('click', function(e) {
      // Находим ближайшую кнопку (либо саму кнопку, либо её дочерний элемент)
      const button = e.target.closest('button');
      if (!button) return; // Если клик не по кнопке, игнорируем
      
      // Проверяем, является ли кнопка кнопкой для модального окна
      if (button.classList.contains('hero-section__desktop-button') || 
          button.classList.contains('hero-sliders-mobile__button') ||
          button.classList.contains('open-modal-btn')) {
        
        e.preventDefault();
        e.stopPropagation(); // Предотвращаем всплытие события
        
        // ОТЛАДКА - выводим всю информацию о кнопке
        console.log('=== КЛИК ПО КНОПКЕ ===');
        console.log('ID кнопки:', button.id);
        console.log('Классы кнопки:', button.className);
        console.log('Атрибут data-modal-type:', button.getAttribute('data-modal-type'));
        console.log('Родительский контейнер с data-section-id:', button.closest('[data-section-id]')?.getAttribute('data-section-id'));
        
        // ПРЯМОЕ ОТКРЫТИЕ ПО ID - самый надежный способ
        if (button.id === 'openBloggerModalBtn' || button.id === 'openBloggerMobileBtn') {
          console.log('Открываем модальное окно БЛОГЕРА по ID кнопки');
          openModal();
          return;
        } 
        else if (button.id === 'openBrandModalBtn' || button.id === 'openBrandMobileBtn') {
          console.log('Открываем модальное окно БРЕНДА по ID кнопки');
          openBrandModal();
          return;
        } 
        else if (button.id === 'openSellerModalBtn' || button.id === 'openSellerMobileBtn') {
          console.log('Открываем модальное окно СЕЛЛЕРА по ID кнопки');
          openSellerModal();
          return;
        }
        
        // ОТКРЫТИЕ ПО data-modal-type
        const modalType = button.getAttribute('data-modal-type');
        if (modalType) {
          console.log('Определен тип модального окна по data-modal-type:', modalType);
          
          if (modalType === 'seller') {
            console.log('Открываем модальное окно СЕЛЛЕРА по data-modal-type');
            openSellerModal();
            return;
          } 
          else if (modalType === 'brand') {
            console.log('Открываем модальное окно БРЕНДА по data-modal-type');
            openBrandModal();
            return;
          } 
          else if (modalType === 'blogger') {
            console.log('Открываем модальное окно БЛОГЕРА по data-modal-type');
            openModal();
            return;
          }
        }
        
        // ОТКРЫТИЕ ПО РОДИТЕЛЬСКОМУ КОНТЕЙНЕРУ
        const parentContainer = button.closest('[data-section-id]');
        if (parentContainer) {
          const sectionId = parentContainer.getAttribute('data-section-id');
          console.log('ID секции по родительскому контейнеру:', sectionId);
          
          if (sectionId === '4' || parentContainer.classList.contains('sellers-media')) {
            console.log('Открываем модальное окно СЕЛЛЕРА по ID секции (4 или sellers-media)');
            openSellerModal();
            return;
          } 
          else if (sectionId === '3' || parentContainer.classList.contains('brands-media')) {
            console.log('Открываем модальное окно БРЕНДА по ID секции (3 или brands-media)');
            openBrandModal();
            return;
          } 
          else if (sectionId === '2') {
            console.log('Открываем модальное окно БЛОГЕРА по ID секции (2)');
            openModal();
            return;
          } 
          else if (sectionId === '1') {
            console.log('Открываем модальное окно БЛОГЕРА по ID секции (1)');
            openModal();
            return;
          }
        }
        
        // ЗАПАСНОЙ ВАРИАНТ - если ничего не помогло
        console.log('Не удалось определить тип модального окна, открываем модальное окно БЛОГЕРА по умолчанию');
        openModal();
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

  // Создаем глобальную функцию для тестирования модальных окон
  window.testModals = function() {
    console.group('%c === ТЕСТИРОВАНИЕ МОДАЛЬНЫХ ОКОН === ', 'background: #222; color: #bada55; font-size: 14px;');
    
    // Проверка модального окна блогеров
    console.group('Проверка модального окна блогеров');
    const bloggerModal = document.getElementById('modal');
    console.log('Модальное окно блогеров:', bloggerModal ? 'найдено' : 'не найдено');
    if (bloggerModal) {
      console.log('ID:', bloggerModal.id);
      console.log('Классы:', bloggerModal.className);
      console.log('Текущий стиль display:', window.getComputedStyle(bloggerModal).display);
    }
    console.log('Функция openModal доступна:', typeof window.openModal === 'function');
    console.log('Функция bloggerModalFunctions.openModal доступна:', window.bloggerModalFunctions && typeof window.bloggerModalFunctions.openModal === 'function');
    console.log('Функция openBloggerModal доступна:', typeof window.openBloggerModal === 'function');
    console.log('Аварийная функция _emergencyModalOpen.blogger доступна:', window._emergencyModalOpen && typeof window._emergencyModalOpen.blogger === 'function');
    console.groupEnd();
    
    // Проверка модального окна брендов
    console.group('Проверка модального окна брендов');
    const brandModal = document.getElementById('brandModal');
    console.log('Модальное окно брендов:', brandModal ? 'найдено' : 'не найдено');
    if (brandModal) {
      console.log('ID:', brandModal.id);
      console.log('Классы:', brandModal.className);
      console.log('Текущий стиль display:', window.getComputedStyle(brandModal).display);
    }
    console.log('Функция openBrandModal доступна:', typeof window.openBrandModal === 'function');
    console.log('Функция brandModals.openBrandModal доступна:', window.brandModals && typeof window.brandModals.openBrandModal === 'function');
    console.log('Аварийная функция _emergencyModalOpen.brand доступна:', window._emergencyModalOpen && typeof window._emergencyModalOpen.brand === 'function');
    console.groupEnd();
    
    // Проверка модального окна селлеров
    console.group('Проверка модального окна селлеров');
    const sellerModal = document.getElementById('sellerModal');
    console.log('Модальное окно селлеров:', sellerModal ? 'найдено' : 'не найдено');
    if (sellerModal) {
      console.log('ID:', sellerModal.id);
      console.log('Классы:', sellerModal.className);
      console.log('Текущий стиль display:', window.getComputedStyle(sellerModal).display);
    }
    console.log('Функция openSellerModal доступна:', typeof window.openSellerModal === 'function');
    console.log('Функция sellerModalFunctions.openSellerModal доступна:', window.sellerModalFunctions && typeof window.sellerModalFunctions.openSellerModal === 'function');
    console.log('Аварийная функция _emergencyModalOpen.seller доступна:', window._emergencyModalOpen && typeof window._emergencyModalOpen.seller === 'function');
    console.groupEnd();
    
    console.groupEnd();
    
    console.log('');
    console.log('%c Для открытия модального окна блогеров: window._emergencyModalOpen.blogger() ', 'background: #1a1a1a; color: #5dff57; font-size: 12px; padding: 5px;');
    console.log('%c Для открытия модального окна брендов: window._emergencyModalOpen.brand() ', 'background: #1a1a1a; color: #5dff57; font-size: 12px; padding: 5px;');
    console.log('%c Для открытия модального окна селлеров: window._emergencyModalOpen.seller() ', 'background: #1a1a1a; color: #5dff57; font-size: 12px; padding: 5px;');
    
    return {
      openBloggerModal: function() { window._emergencyModalOpen.blogger(); },
      openBrandModal: function() { window._emergencyModalOpen.brand(); },
      openSellerModal: function() { window._emergencyModalOpen.seller(); }
    };
  };
  
  console.log('%c Для проверки модальных окон запустите: window.testModals() ', 'background: #1a1a1a; color: #ffff22; font-size: 12px; padding: 5px;');
}); 