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

  console.log('Кнопки в секции 1:', mainButtons.length);
  console.log('Кнопки в секции 2:', brandButtons.length);
  
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
      if (!window.brandModals || !window.brandModals.openBrandModal) {
        console.warn('Модальное окно для брендов не найдено');
        console.log('Открываем обычное модальное окно вместо модального окна брендов');
        openModal();
        return;
      }
      
      window.brandModals.openBrandModal();
    }
    
    // Добавляем обработчики событий для кнопок в секции 1
    mainButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Клик по кнопке в секции 1');
        openModal();
      });
    });
    
    // Добавляем обработчики событий для кнопок в секции 2
    brandButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Клик по кнопке в секции 2');
        openBrandModal();
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