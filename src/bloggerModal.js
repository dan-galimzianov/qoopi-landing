document.addEventListener('DOMContentLoaded', function () {
    console.log('bloggerModal.js загружен');
    
    // Элементы основного модального окна
    const modalOverlay = document.getElementById('modal');
    const modalContainer = document.querySelector('.modal-container');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const form = document.getElementById('blogger-form');
    const submitBtn = document.querySelector('.submit-btn');
  
    // Сохраняем позицию скролла и данные о ширине полосы прокрутки
    let scrollPosition = 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
    // Элементы модального окна подтверждения
    const successModal = document.getElementById('successModal');
    const successModalClose = document.getElementById('successModalClose');
    const successModalCloseBtn = document.getElementById('successModalCloseBtn');
  
    // Функция открытия основного модального окна
    function openModal() {
      console.log('Открытие модального окна');
      
      // Сначала сбрасываем селектор и закрываем выпадающий список
      resetSelectAndDropdown();
      
      // Сбрасываем форму и ошибки
      if (form) {
        form.reset();
        const agreementCheckbox = document.getElementById('agreement');
        const newsletterCheckbox = document.getElementById('newsletter');
        
        if (agreementCheckbox) agreementCheckbox.checked = false;
        if (newsletterCheckbox) newsletterCheckbox.checked = true;
  
        document.querySelectorAll('.error-field').forEach((el) => {
          el.classList.remove('error-field');
        });
        document.querySelectorAll('.checkbox-group').forEach((el) => {
          el.classList.remove('error');
        });

        // Сбрасываем состояние мультиселектора
        const multiSelectHeader = document.getElementById('socialNetworkHeader');
        if (multiSelectHeader) {
          const span = multiSelectHeader.querySelector('span');
          if (span) {
            span.textContent = 'Выберите социальные сети';
            span.style.color = ''; // Сбрасываем цвет текста
          }
          multiSelectHeader.classList.remove('has-selection');
          multiSelectHeader.classList.remove('error-field');
          multiSelectHeader.setAttribute('aria-expanded', 'false');
          
          // Сбрасываем стрелку
          const arrow = multiSelectHeader.querySelector('.arrow');
          if (arrow) {
            arrow.classList.remove('up');
          }
        }
        
        // Закрываем и скрываем выпадающий список
        const multiSelectDropdown = document.getElementById('socialNetworkDropdown');
        if (multiSelectDropdown) {
          multiSelectDropdown.classList.remove('open');
          multiSelectDropdown.style.display = 'none';
          multiSelectDropdown.style.opacity = '0';
          multiSelectDropdown.style.maxHeight = '0';
          multiSelectDropdown.style.visibility = 'hidden';
          
          // Сбрасываем все выбранные опции
          const options = multiSelectDropdown.querySelectorAll('.multi-select-option');
          options.forEach(option => {
            option.classList.remove('selected');
            option.setAttribute('aria-selected', 'false');
          });
        }
        
        // Сбрасываем значение скрытого поля социальной сети
        const socialNetworkInput = document.getElementById('socialNetwork');
        if (socialNetworkInput) {
          socialNetworkInput.value = '';
        }
        
        // Если доступен объект мультиселектора, используем его метод reset
        if (window.socialNetworkMultiSelect && typeof window.socialNetworkMultiSelect.reset === 'function') {
          window.socialNetworkMultiSelect.reset();
        }
        
        const formAlert = document.getElementById('form-alert');
        if (formAlert) formAlert.style.display = 'none';
      }
  
      // Сохраняем текущую позицию скролла
      scrollPosition = window.pageYOffset;
      
      // Показываем модальное окно
      modalOverlay.style.display = 'flex';
      
      // Блокируем скролл на body
      document.body.classList.add('modal-open');
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      setTimeout(() => {
        modalOverlay.classList.add('active');
      }, 10);
    }
  
    // Функция закрытия основного модального окна
    function closeModal() {
      // Сначала закрываем выпадающий список, если он открыт
      resetSelectAndDropdown();
      
      // Дополнительно закрываем мультиселектор
      const multiSelectDropdown = document.getElementById('socialNetworkDropdown');
      if (multiSelectDropdown && multiSelectDropdown.classList.contains('open')) {
        closeSocialNetworkDropdown();
      }
      
      modalOverlay.classList.remove('active');
  
      setTimeout(() => {
        modalOverlay.style.display = 'none';
        
        // Восстанавливаем скролл
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPosition);
        
        // Сбрасываем форму и селектор
        resetForm();
      }, 300);
    }
    
    // Функция сброса селектора и закрытия выпадающего списка
    function resetSelectAndDropdown() {
      // Закрываем выпадающий список, если он открыт
      const dropdown = document.querySelector('.modal-select-dropdown');
      if (!dropdown) return;
      
      // Удаляем все inline стили, которые могут мешать работе
      dropdown.removeAttribute('style');
      
      // Принудительно устанавливаем стили закрытия
      dropdown.style.maxHeight = '0';
      dropdown.style.opacity = '0';
      dropdown.style.pointerEvents = 'none';
      dropdown.style.display = 'none';
      dropdown.classList.remove('open');
      
      // Сбрасываем стрелку
      const arrow = document.querySelector('.modal-select-arrow');
      if (arrow) {
        arrow.classList.remove('up');
      }
      
      // Сбрасываем селектор
      const selectHeader = document.querySelector('.modal-select-header');
      if (selectHeader) {
        selectHeader.setAttribute('aria-expanded', 'false');
      }
    }
    
    // Функция сброса формы и всех полей
    function resetForm() {
      if (!form) return;
      
      // Сбрасываем форму
      form.reset();
      
      // Сбрасываем ошибки
      document.querySelectorAll('.error-field').forEach((el) => {
        el.classList.remove('error-field');
      });
      document.querySelectorAll('.checkbox-group').forEach((el) => {
        el.classList.remove('error');
      });
      
      // Скрываем сообщение об ошибке
      const formAlert = document.getElementById('form-alert');
      if (formAlert) {
        formAlert.style.display = 'none';
      }
      
      // Сбрасываем мультиселектор социальных сетей
      const multiSelectHeader = document.getElementById('socialNetworkHeader');
      if (multiSelectHeader) {
        const span = multiSelectHeader.querySelector('span');
        if (span) {
          span.textContent = 'Выберите социальные сети';
        }
        multiSelectHeader.classList.remove('has-selection');
        multiSelectHeader.classList.remove('error-field');
        multiSelectHeader.setAttribute('aria-expanded', 'false');
        
        // Сбрасываем стрелку
        const arrow = multiSelectHeader.querySelector('.arrow');
        if (arrow) {
          arrow.classList.remove('up');
        }
      }
      
      // Сбрасываем выбранные опции в мультиселекторе
      const multiSelectOptions = document.querySelectorAll('#socialNetworkDropdown .multi-select-option');
      multiSelectOptions.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-selected', 'false');
      });
      
      // Принудительно закрываем выпадающий список мультиселектора
      const multiSelectDropdown = document.getElementById('socialNetworkDropdown');
      if (multiSelectDropdown) {
        multiSelectDropdown.classList.remove('open');
        multiSelectDropdown.style.display = 'none';
        multiSelectDropdown.style.maxHeight = '0';
        multiSelectDropdown.style.opacity = '0';
        multiSelectDropdown.style.pointerEvents = 'none';
      }
      
      // Сбрасываем значение скрытого поля социальной сети
      const socialNetworkInput = document.getElementById('socialNetwork');
      if (socialNetworkInput) {
        socialNetworkInput.value = '';
      }
      
      // Очищаем значение поля account
      const accountInput = document.getElementById('account');
      if (accountInput) {
        accountInput.value = '';
      }
      
      // Сбрасываем чекбоксы к дефолтным значениям
      const agreementCheckbox = document.getElementById('agreement');
      const newsletterCheckbox = document.getElementById('newsletter');
      
      if (agreementCheckbox) agreementCheckbox.checked = false;
      if (newsletterCheckbox) newsletterCheckbox.checked = true;
      
      // Закрываем выпадающий список (еще раз, для уверенности)
      resetSelectAndDropdown();
      
      // Используем глобальную функцию закрытия мультиселектора, если она доступна
      if (window.closeSocialNetworkDropdown) {
        window.closeSocialNetworkDropdown();
      }
      
      // Если доступен объект мультиселектора, используем его метод reset
      if (window.socialNetworkMultiSelect && typeof window.socialNetworkMultiSelect.reset === 'function') {
        window.socialNetworkMultiSelect.reset();
      }
    }
  
    // Функция открытия модального окна подтверждения
    function openSuccessModal() {
      successModal.style.display = 'flex';
      
      setTimeout(() => {
        successModal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }, 10);
    }
  
    // Функция закрытия модального окна подтверждения
    function closeSuccessModal() {
      successModal.classList.remove('active');
      
      setTimeout(() => {
        successModal.style.display = 'none';
        
        // Восстанавливаем скролл
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPosition);
      }, 300);
    }
  
    // Обработчики событий для основного модального окна
    if (openModalBtns.length) {
      console.log(`Найдено ${openModalBtns.length} кнопок открытия модалки`);
      
      // ВОССТАНАВЛИВАЕМ обработчик для кнопок БЛОГЕРОВ
      console.log('ВОССТАНАВЛИВАЕМ обработчики кликов для кнопок блогеров');
      
      // Добавляем обработчик только для кнопок в секции блогеров
      openModalBtns.forEach(button => {
        // Проверяем, находится ли кнопка в нужной секции
        const parentSection = button.closest('[data-section-id]');
        if (parentSection && parentSection.getAttribute('data-section-id') === '2') {
          console.log('Добавляем обработчик для кнопки блогеров в секции 2:', button);
          
          button.addEventListener('click', function(e) {
            console.log('Клик по кнопке открытия модального окна блогеров в секции 2');
          e.preventDefault();
            e.stopPropagation();
          openModal();
        });
        }
      });
      
      // Добавляем специальный обработчик для кнопки с ID openBloggerModalBtn
      const bloggerBtns = document.querySelectorAll('.openBloggerModalBtn');
      bloggerBtns.forEach(button => {
        button.addEventListener('click', function(e) {
          console.log('Клик по кнопке с ID openBloggerModalBtn');
          e.preventDefault();
          e.stopPropagation();
          openModal();
        });
      });
      
      // Проверяем, существует ли уже объект window.bloggerModalFunctions
      if (window.bloggerModalFunctions) {
        console.warn('Объект window.bloggerModalFunctions уже существует, не перезаписываем его');
      } else {
        // Сохраняем функцию openModal для доступа из modalInit.js
        console.log('Создаем объект window.bloggerModalFunctions с функциями для модального окна блогеров');
        window.bloggerModalFunctions = {
          openModal: openModal,
          closeModal: closeModal,
          openSuccessModal: openSuccessModal,
          closeSuccessModal: closeSuccessModal
        };
        
        // Экспортируем функции напрямую для обратной совместимости
        window.openBloggerModal = openModal;
        window.closeBloggerModal = closeModal;
        
        // Выводим информацию для отладки
        console.log('Созданы следующие глобальные функции:');
        console.log('- window.bloggerModalFunctions.openModal');
        console.log('- window.bloggerModalFunctions.closeModal');
        console.log('- window.bloggerModalFunctions.openSuccessModal');
        console.log('- window.bloggerModalFunctions.closeSuccessModal');
        console.log('- window.openBloggerModal');
        console.log('- window.closeBloggerModal');
      }
    } else {
      console.log('Не найдены кнопки открытия модального окна');
    }
  
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
  
    // Обработчики событий для модального окна подтверждения
    if (successModalClose) {
      successModalClose.addEventListener('click', closeSuccessModal);
    }
    
    if (successModalCloseBtn) {
      successModalCloseBtn.addEventListener('click', closeSuccessModal);
    }
  
    if (successModal) {
      successModal.addEventListener('click', function (e) {
        if (e.target === successModal) {
          closeSuccessModal();
        }
      });
    }
  
    // Клик по оверлею основного модального окна
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }
  
    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (modalOverlay && modalOverlay.classList.contains('active')) {
          closeModal();
        } else if (successModal && successModal.classList.contains('active')) {
          closeSuccessModal();
        }
      }
    });
  
    // Функция инициализации мультиселектора для социальных сетей
    function initMultiSelect() {
      console.log('Инициализация мультиселектора...');
      
      const multiSelectHeader = document.getElementById('socialNetworkHeader');
      const multiSelectDropdown = document.getElementById('socialNetworkDropdown');
      
      if (!multiSelectHeader || !multiSelectDropdown) {
        console.error('Элементы мультиселектора не найдены');
        return;
      }
      
      // Удаляем все inline стили, которые могли быть применены
      multiSelectDropdown.removeAttribute('style');
      
      const arrow = multiSelectHeader.querySelector('.arrow');
      const options = multiSelectDropdown.querySelectorAll('.multi-select-option');
      const liveRegion = document.getElementById('socialNetworkLiveRegion');
      const multiSelectContainer = document.querySelector('.multi-select-container');
        
        // Сбросить все выбранные элементы при инициализации
        options.forEach((option) => {
          option.classList.remove('selected');
          option.setAttribute('aria-selected', 'false');
        });
  
        // Функция обновления заголовка
        function updateHeader() {
        const selectedOptions = Array.from(options).filter((opt) =>
            opt.classList.contains('selected')
          );
        const headerSpan = multiSelectHeader.querySelector('span');
        
        if (selectedOptions.length === 0) {
          headerSpan.textContent = 'Выберите социальные сети';
          headerSpan.style.removeProperty('color');
          multiSelectHeader.classList.remove('has-selection');
          } else {
          const selectedLabels = selectedOptions.map(
            (opt) => opt.querySelector('span').textContent
          );
          headerSpan.textContent = selectedLabels.join(', ');
          headerSpan.style.removeProperty('color');
          multiSelectHeader.classList.add('has-selection');
        }
        
        // Always ensure no border-bottom
        multiSelectHeader.style.borderBottom = 'none';
      }
      
      // Глобальная функция для закрытия дропдауна
      window.closeSocialNetworkDropdown = function() {
        if (multiSelectDropdown.classList.contains('open')) {
          // Сначала запускаем анимацию скрытия
          multiSelectDropdown.style.opacity = '0';
          multiSelectDropdown.style.transform = 'translateY(-5px)';
          
          // После завершения анимации полностью скрываем элемент
          setTimeout(() => {
            multiSelectDropdown.classList.remove('open');
            arrow.classList.remove('up');
            multiSelectHeader.setAttribute('aria-expanded', 'false');
            
            // Сбрасываем стили для следующего открытия
            multiSelectDropdown.style.transform = '';
          }, 200); // Время анимации
        }
      };
      
      // Сокращение для локального использования
      function closeSocialNetworkDropdown() {
        window.closeSocialNetworkDropdown();
      }
  
      // Вызвать updateHeader() для установки начального состояния
        updateHeader();
  
      // Функция для обновления состояния опции
        function updateOptionState(option, isSelected) {
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', isSelected);
        
        // Обновить скрытое поле с выбранными значениями
        const hiddenInput = document.getElementById('socialNetwork');
        if (hiddenInput) {
          const selectedValues = Array.from(options)
            .filter(opt => opt.classList.contains('selected'))
            .map(opt => opt.getAttribute('data-value'));
          
          hiddenInput.value = selectedValues.join(',');
          
          // Dispatch event для обработки изменений
          const event = new Event('change', { bubbles: true });
          hiddenInput.dispatchEvent(event);
          }
  
          // Обновить live region для скринридеров
          if (liveRegion) {
          liveRegion.textContent = `${option.querySelector('span').textContent} ${
            isSelected ? 'выбрано' : 'не выбрано'
          }`;
        }
      }
      
      // Обработчик клика на заголовок
      multiSelectHeader.addEventListener('click', function (e) {
        e.stopPropagation(); // Останавливаем распространение события
        const isExpanded = !multiSelectDropdown.classList.contains('open');
        
        // Сбрасываем ошибку при клике
        multiSelectHeader.classList.remove('error-field');
        const span = multiSelectHeader.querySelector('span');
        if (span && span.style.color === 'rgb(255, 59, 48)') { // #ff3b30
          span.style.removeProperty('color');
        }
        
        // Важно: убедимся, что display не установлен в none
        if (isExpanded) {
          multiSelectDropdown.classList.add('open');
          multiSelectDropdown.style.display = 'block';
          multiSelectDropdown.style.visibility = 'visible';
          multiSelectDropdown.style.opacity = '1';
          multiSelectDropdown.style.maxHeight = '300px';
          multiSelectDropdown.style.overflowY = 'auto';
          multiSelectDropdown.style.pointerEvents = 'auto'; // Важно для кликабельности
          multiSelectDropdown.style.transform = 'translateY(0)'; // Сбрасываем transform для анимации
          arrow.classList.add('up');
          multiSelectHeader.setAttribute('aria-expanded', 'true');
        } else {
          closeSocialNetworkDropdown();
        }
      });
      
      // Обработчик клика на опции
      options.forEach((option) => {
        option.addEventListener('click', function (e) {
          e.stopPropagation(); // Останавливаем распространение события
              const isSelected = !option.classList.contains('selected');
              updateOptionState(option, isSelected);
              updateHeader();
  
              // Если опция выбрана, сбрасываем ошибку и красный цвет текста
              if (isSelected) {
                const span = multiSelectHeader.querySelector('span');
                if (span) {
                  span.style.removeProperty('color');
                }
                multiSelectHeader.classList.remove('error-field');
            }
          });
        });
      
      // Предотвращаем распространение клика внутри мультиселектора
      multiSelectContainer.addEventListener('click', function(e) {
        // Останавливаем распространение, чтобы не сработали другие обработчики
        e.stopPropagation();
      });
      
      // Обработчик клика для самого выпадающего списка
      multiSelectDropdown.addEventListener('click', function(e) {
        // Останавливаем распространение, чтобы не сработали другие обработчики
        e.stopPropagation();
      });
      
      // Закрытие выпадающего списка при клике вне мультиселектора
      document.addEventListener('click', function (e) {
        // Проверяем, что клик был не внутри мультиселектора и выпадающий список открыт
        if (
          !multiSelectContainer.contains(e.target) &&
          multiSelectDropdown.classList.contains('open')
        ) {
          closeSocialNetworkDropdown();
        }
      });
      
      // Добавляем обработчик клика на модальный контейнер
      const modalContainer = document.querySelector('.modal-container');
      if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
          // Закрываем выпадающий список при клике в любое место модального окна,
          // если клик не был внутри мультиселектора и выпадающий список открыт
          if (
            !multiSelectContainer.contains(e.target) &&
            multiSelectDropdown.classList.contains('open')
          ) {
            closeSocialNetworkDropdown();
        }
      });
    }
  
      // Закрытие при изменении размера окна
      window.addEventListener('resize', closeSocialNetworkDropdown);
      
      // Экспортируем методы для доступа из формы
      window.socialNetworkMultiSelect = {
        getSelectedValues: function () {
          return Array.from(options)
            .filter((opt) => opt.classList.contains('selected'))
            .map((opt) => opt.getAttribute('data-value'));
        },
        reset: function () {
          options.forEach((option) => {
            option.classList.remove('selected');
            option.setAttribute('aria-selected', 'false');
          });
          updateHeader();
          
          // Очищаем скрытое поле
          const hiddenInput = document.getElementById('socialNetwork');
          if (hiddenInput) {
            hiddenInput.value = '';
          }
        },
        close: closeSocialNetworkDropdown,
      };
    }
    
    // Проверка работы textarea для ссылок на аккаунты
    function initTextareaStyles() {
      const textarea = document.getElementById('account');
      if (textarea) {
        // Устанавливаем базовые стили
        textarea.style.width = '100%';
        textarea.style.padding = '8px 0';
        textarea.style.backgroundColor = 'transparent';
        textarea.style.border = 'none';
        textarea.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
        textarea.style.color = '#fff';
        textarea.style.fontSize = '17px';
        textarea.style.fontFamily = 'Manrope, sans-serif';
        textarea.style.resize = 'vertical';
        textarea.style.minHeight = '80px';
        
        // Добавляем обработчик фокуса для улучшения UX
        textarea.addEventListener('focus', function() {
          this.style.outline = 'none';
          this.style.borderBottomColor = '#793eed';
        });
        
        textarea.addEventListener('blur', function() {
          this.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
        });
      }
    }
  
    // Инициализация
    initPhoneMask();
    initFollowersMask();
    initSocialAutocomplete();
    initMultiSelect();
    updateAccountFieldColor(); // Добавляем вызов новой функции
    initLiveValidation();
    // Инициализируем стили для textarea
    initTextareaStyles();
  
    // Добавляем обработчики для чекбокса соглашения
      const agreementCheckbox = document.getElementById('agreement');
      if (agreementCheckbox) {
      // Обработчик события change
        agreementCheckbox.addEventListener('change', function() {
        if (this.checked) {
          console.log('Чекбокс соглашения отмечен, убираем ошибку');
          const checkboxGroup = this.closest('.checkbox-group');
          if (checkboxGroup && checkboxGroup.classList.contains('error')) {
            checkboxGroup.classList.remove('error');
          }
            
            // Проверяем, можно ли скрыть сообщение об ошибке
            const formAlert = document.getElementById('form-alert');
          if (formAlert && formAlert.style.display === 'flex') {
            // Проверяем наличие других ошибок
            const hasOtherErrors = document.querySelector('#blogger-form .error-field') || 
                                document.querySelector('#blogger-form .checkbox-group.error');
            if (!hasOtherErrors) {
              formAlert.style.display = 'none';
            }
            }
          }
        });
        
      // Дополнительный обработчик события click для надежности
        agreementCheckbox.addEventListener('click', function() {
          setTimeout(() => {
          if (this.checked) {
            console.log('Чекбокс соглашения кликнут, убираем ошибку');
            const checkboxGroup = this.closest('.checkbox-group');
            if (checkboxGroup && checkboxGroup.classList.contains('error')) {
              checkboxGroup.classList.remove('error');
            }
              
            // Проверяем, можно ли скрыть сообщение об ошибке
              const formAlert = document.getElementById('form-alert');
            if (formAlert && formAlert.style.display === 'flex') {
              // Проверяем наличие других ошибок
              const hasOtherErrors = document.querySelector('#blogger-form .error-field') || 
                                  document.querySelector('#blogger-form .checkbox-group.error');
              if (!hasOtherErrors) {
                formAlert.style.display = 'none';
              }
              }
            }
          }, 0);
        });
      
      // Добавляем обработчик для метки чекбокса
      const agreementLabel = document.querySelector('label[for="agreement"]');
      if (agreementLabel) {
        agreementLabel.addEventListener('click', function() {
          setTimeout(() => {
            // Проверяем состояние чекбокса после клика по метке
            if (agreementCheckbox.checked) {
              console.log('Клик по метке чекбокса, убираем ошибку');
              const checkboxGroup = agreementCheckbox.closest('.checkbox-group');
              if (checkboxGroup && checkboxGroup.classList.contains('error')) {
                checkboxGroup.classList.remove('error');
              }
              
              // Проверяем, можно ли скрыть сообщение об ошибке
              const formAlert = document.getElementById('form-alert');
              if (formAlert && formAlert.style.display === 'flex') {
                // Проверяем наличие других ошибок
                const hasOtherErrors = document.querySelector('#blogger-form .error-field') || 
                                  document.querySelector('#blogger-form .checkbox-group.error');
                if (!hasOtherErrors) {
                  formAlert.style.display = 'none';
                }
              }
            }
          }, 10); // Немного большая задержка для надежности
        });
      }
    }
  
    // Финальная настройка селектора для гарантированной работы
    setTimeout(function() {
      const selectHeader = document.querySelector('.modal-select-header');
      const dropdown = document.querySelector('.modal-select-dropdown');
      
      if (selectHeader && dropdown) {
        // Устанавливаем базовые стили для надежной работы
        dropdown.style.position = 'absolute';
        dropdown.style.width = '100%';
        dropdown.style.zIndex = '10000';
        
        // Перестраховка: добавляем обработчик, если оригинальный не сработал
        if (!selectHeader._hasClickHandler) {
          selectHeader._hasClickHandler = true;
          selectHeader.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            
            if (!isOpen) {
              dropdown.classList.add('open');
              dropdown.style.maxHeight = '250px';
              dropdown.style.opacity = '1';
              dropdown.style.pointerEvents = 'auto';
              selectHeader.querySelector('.modal-select-arrow')?.classList.add('up');
            } else {
              dropdown.classList.remove('open');
              dropdown.style.maxHeight = '0';
              dropdown.style.opacity = '0';
              dropdown.style.pointerEvents = 'none';
              selectHeader.querySelector('.modal-select-arrow')?.classList.remove('up');
            }
          });
        }
      }
    }, 300);
  
    // Блокируем всплытие событий от контейнера
    if (modalContainer) {
      modalContainer.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  
    // Инициализация маски телефона
    function initPhoneMask() {
      const phoneInput = document.getElementById('phone');
      if (!phoneInput) {
        console.warn('Элемент phone не найден');
        return;
      }
  
      // Устанавливаем начальное значение
      if (!phoneInput.value) {
        phoneInput.value = '+7';
      }

      phoneInput.addEventListener('focus', function(e) {
        // При фокусе, если поле пустое или содержит только +7, установим +7
        if (!e.target.value || e.target.value === '+7') {
          e.target.value = '+7';
        }
      });

      phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Гарантируем, что номер начинается с 7
        if (value.length > 0 && value[0] !== '7') {
          value = '7' + value;
        }
        
        let x = value.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        
        // Формируем значение с форматированием
        e.target.value = !x[2] 
          ? '+7'
          : `+7 (${x[2]}${x[3] ? `) ${x[3]}` : ''}${x[4] ? `-${x[4]}` : ''}${
              x[5] ? `-${x[5]}` : ''
            }`;

        // Проверяем формат после ввода
        validatePhoneFormat(e.target);
      });
    }

    // Функция для проверки формата телефона
    function validatePhoneFormat(field) {
      // Проверяем, что телефон полностью введен
      const value = field.value;
      const isComplete = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
      
      if (!isComplete && value !== '+7') {
        // Если телефон введен неполностью, добавляем класс ошибки
        field.classList.add('warning-field');
      } else {
        // Если телефон введен полностью или только +7, убираем класс ошибки
        field.classList.remove('warning-field');
      }
    }
  
    // Инициализация маски подписчиков
    function initFollowersMask() {
      const followersInput = document.getElementById('followers');
      if (!followersInput) {
        console.warn('Элемент followers не найден');
        return;
      }
  
      followersInput.addEventListener('input', function (e) {
        // Удаляем все нецифровые символы
        let value = e.target.value.replace(/\D/g, '');
        
        // Добавляем пробелы как разделители тысяч
        if (value) {
          e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }
      });
    }
  
    function initSocialAutocomplete() {
      const socialNetworkInput = document.getElementById('socialNetwork');
      const accountInput = document.getElementById('account');
      if (!socialNetworkInput || !accountInput) {
        console.warn('Элементы socialNetwork или account не найдены');
        return;
      }
  
      // Не устанавливаем начальное значение, так как это текстовая область
      // Вместо этого просто добавляем обработчик ввода
      accountInput.addEventListener('input', handleAccountInput);
  
      socialNetworkInput.addEventListener('change', function () {
        // Фокусируемся на поле ввода аккаунта
        accountInput.focus();
  
        // Добавляем обработчик ввода, чтобы проверять заполнение
        accountInput.removeEventListener('input', handleAccountInput);
        accountInput.addEventListener('input', handleAccountInput);
      });
  
      // Функция проверки поля account
      function validateAccountField(field) {
        const value = field.value.trim();
        
        // Просто проверяем, что поле не пустое
        if (!value || value === '') {
          showError(field);
          return false;
        }
  
        // Если поле заполнено
        field.classList.remove('error-field');
        return true;
      }
  
      // Обработчик ввода в поле account
      function handleAccountInput(e) {
        // Get the value and remove any whitespace
        const value = e.target.value.trim();
        
        // Simple validation: just check if there's content
        if (!value || value === '') {
          e.target.classList.add('error-field');
        } else {
          e.target.classList.remove('error-field');
        }
      }
  
      // Модифицируем функцию validateForm для проверки account
      const originalValidateForm = validateForm;
      validateForm = function (formData) {
        const isValid = originalValidateForm(formData);
        const accountIsValid = validateAccountField(accountInput);
        return isValid && accountIsValid;
      };
    }
  
    // Обработка отправки формы
    if (submitBtn && form) {
      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Нажата кнопка отправки формы');
        
        // Сначала убираем все предыдущие ошибки
        document.querySelectorAll('.error-field').forEach((el) => {
          el.classList.remove('error-field');
        });
        document.querySelectorAll('.checkbox-group').forEach((el) => {
          el.classList.remove('error');
        });
        
        // Скрываем сообщение об ошибке
        const formAlert = document.getElementById('form-alert');
        if (formAlert) {
          formAlert.style.display = 'none';
        }
        
        // Проверяем специальные кейсы с аккаунтом и соц. сетью перед валидацией
        const socialNetworkInput = document.getElementById('socialNetwork');
        const accountInput = document.getElementById('account');
        
        if (socialNetworkInput && socialNetworkInput.value === '') {
          // Подсвечиваем селектор соц. сети, если он не выбран
          const selectHeader = document.querySelector('.multi-select-header');
          if (selectHeader) {
            selectHeader.classList.add('error-field');
          }
        }
        
        if (accountInput && (!accountInput.value.trim() || accountInput.value.trim() === '')) {
          // Подсвечиваем поле аккаунта, если оно пустое
          accountInput.classList.add('error-field');
        }
        
        // Теперь выполняем валидацию и отправку
        handleFormSubmit();
      });

      // Удаляем дублирующий обработчик события submit
      form.removeEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Форма отправлена');
        handleFormSubmit();
      });
      
      // Добавляем новый обработчик с именованной функцией
      const formSubmitHandler = function(e) {
        e.preventDefault();
        console.log('Форма отправлена через submit');
        
        // Сначала проверяем специальные поля
        const socialNetworkInput = document.getElementById('socialNetwork');
        const accountInput = document.getElementById('account');
        
        if (socialNetworkInput && socialNetworkInput.value === '') {
          const selectHeader = document.querySelector('.multi-select-header');
          if (selectHeader) {
            selectHeader.classList.add('error-field');
          }
        }
        
        if (accountInput && (!accountInput.value.trim() || accountInput.value.trim() === '')) {
          accountInput.classList.add('error-field');
        }
        
        // Затем выполняем валидацию и отправку
        handleFormSubmit();
      };
      
      form.addEventListener('submit', formSubmitHandler);
    }
  
    // Функция обработки отправки формы
    function handleFormSubmit() {
      console.log('Обработка отправки формы блогера');
      
      // Собираем данные формы с корректной обработкой чекбоксов
      const formValues = {};
      
      // Получаем элементы формы для проверки чекбоксов
      const agreementCheckbox = document.getElementById('agreement');
      const newsletterCheckbox = document.getElementById('newsletter');
      
      // Собираем остальные данные формы
      const formData = new FormData(form);
      
      // Преобразуем FormData в объект, но не трогаем чекбоксы
      formData.forEach((value, key) => {
        if (key !== 'agreement' && key !== 'newsletter') {
          formValues[key] = value;
        }
      });
      
      // Добавляем значения чекбоксов вручную
      formValues.agreement = agreementCheckbox ? agreementCheckbox.checked : false;
      formValues.newsletter = newsletterCheckbox ? newsletterCheckbox.checked : false;
      
      console.log('Данные формы:', formValues);
      console.log('Чекбокс соглашения:', formValues.agreement);
      
      // Проверяем на ошибки
      if (!validateForm(formValues)) {
        console.log('Валидация не пройдена, прерываем отправку');
        return;
      }
      
      console.log('Валидация пройдена успешно, отправляем форму');
      
      // Здесь можно добавить AJAX-запрос для отправки данных

      // Закрываем текущее модальное окно
      closeModal();
      
      // Используем глобальную функцию открытия success modal
      setTimeout(() => {
        if (window.modalFunctions && window.modalFunctions.openSuccessModal) {
          window.modalFunctions.openSuccessModal();
        } else {
          openSuccessModal();
        }
      }, 300);
    }
  
    // Валидация формы
    function validateForm(formData) {
      console.log('Валидация формы');
      let isValid = true;
      const alertElement = document.getElementById('form-alert');
  
      // Сбрасываем предыдущие ошибки
      document.querySelectorAll('.error-field').forEach((el) => {
        el.classList.remove('error-field');
      });
      document.querySelectorAll('.checkbox-group').forEach((el) => {
        el.classList.remove('error');
      });
      if (alertElement) {
        alertElement.style.display = 'none';
      }

      // Проверка имени
      if (!formData.name) {
        showError(document.getElementById('name'));
        isValid = false;
        console.log('Ошибка: имя не заполнено');
      }
  
      // Проверка email
      if (!formData.email) {
        showError(document.getElementById('email'));
        isValid = false;
        console.log('Ошибка: email не заполнен');
      } else if (!validateEmail(formData.email)) {
        showError(document.getElementById('email'));
        isValid = false;
        console.log('Ошибка: некорректный формат email');
      }
  
      // Проверка телефона (должен быть полностью заполнен)
      if (!formData.phone || formData.phone === '+7' || formData.phone.length < 18) {
        showError(document.getElementById('phone'));
        isValid = false;
        console.log('Ошибка: телефон не заполнен или заполнен не полностью');
      }
  
      // Проверка социальной сети
      if (!formData.socialNetwork) {
        // Проверяем скрытое поле socialNetwork
        showError(document.getElementById('socialNetwork'));
        
        // Дополнительно подсвечиваем текст заголовка красным
        const multiSelectHeader = document.getElementById('socialNetworkHeader');
        if (multiSelectHeader) {
          const span = multiSelectHeader.querySelector('span');
          if (span) {
            span.style.color = '#ff3b30';
          }
        }
        
        isValid = false;
        console.log('Ошибка: социальная сеть не выбрана');
      }
  
      // Проверка аккаунта
      if (!formData.account || formData.account.trim() === '') {
        showError(document.getElementById('account'));
        isValid = false;
        console.log('Ошибка: аккаунт не заполнен');
      }
  
      // Проверка количества подписчиков
      if (!formData.followers) {
        showError(document.getElementById('followers'));
        isValid = false;
        console.log('Ошибка: количество подписчиков не заполнено');
      }
  
      // Проверка соглашения - напрямую проверяем сам элемент чекбокса
      const agreementElement = document.getElementById('agreement');
      if (!agreementElement || !agreementElement.checked) {
        if (agreementElement) {
          const checkbox = agreementElement.closest('.checkbox-group');
          if (checkbox) checkbox.classList.add('error');
        }
        isValid = false;
        console.log('Ошибка: не принято пользовательское соглашение, состояние:', agreementElement ? agreementElement.checked : 'элемент не найден');
      }
  
      // Показываем общее сообщение об ошибке
      if (!isValid && alertElement) {
        alertElement.style.display = 'flex';
        const topOffset = form ? form.offsetTop - 20 : 0;
        modalContainer.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
  
      return isValid;
    }
  
    // Валидация email
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    // Показать ошибку
    function showError(field) {
      if (!field) return;
  
      field.classList.add('error-field');
      
      // Прокручиваем к полю с ошибкой
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        const fieldRect = field.getBoundingClientRect();
        const containerRect = modalContent.getBoundingClientRect();
        
        if (fieldRect.top < containerRect.top || fieldRect.bottom > containerRect.bottom) {
          field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
  
      if (field.type === 'checkbox') {
        const checkbox = field.closest('.checkbox-group');
        if (checkbox) checkbox.classList.add('error');
      }
  
      // Если поле - скрытый input для селектора, подсветить заголовок селектора
      if (field.type === 'hidden' && field.id === 'socialNetwork') {
        const multiSelectHeader = document.getElementById('socialNetworkHeader');
        if (multiSelectHeader) {
          multiSelectHeader.classList.add('error-field');
          
          // Подсвечиваем текст красным
          const span = multiSelectHeader.querySelector('span');
          if (span) {
            span.style.color = '#ff3b30';
          }
        }
      }
    }
  
    // Добавляем функцию для обработки цвета текста в поле account
    function updateAccountFieldColor() {
      const accountInput = document.getElementById('account');
      if (!accountInput) return;

      // Для textarea просто добавим базовые стили
      accountInput.style.width = '100%';
      accountInput.style.color = '#fff';
      accountInput.style.fontSize = '17px';
      accountInput.style.fontFamily = 'Manrope, sans-serif';
    }

    // Функция инициализации живой валидации полей
    function initLiveValidation() {
      // Находим все обязательные поля ввода
      const requiredInputs = document.querySelectorAll('#blogger-form input[required], #blogger-form textarea[required]');
      
      // Добавляем обработчики событий для каждого поля
      requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
          // Проверяем поле при потере фокуса
          if (!this.value.trim()) {
            this.classList.add('error-field');
          } else {
            this.classList.remove('error-field');
          }
        });
        
        input.addEventListener('input', function() {
          // Убираем ошибку при вводе
          if (this.value.trim()) {
            this.classList.remove('error-field');
          }
        });
      });
      
      // Особая обработка для поля аккаунта
      const accountInput = document.getElementById('account');
      if (accountInput) {
        accountInput.addEventListener('input', function() {
          if (this.value.trim()) {
            this.classList.remove('error-field');
          }
        });
      }
    }
  });
  
  // Отложенная инициализация обработчика для чекбокса соглашения
  document.addEventListener('DOMContentLoaded', function() {
    // Ручная инициализация обработчика для чекбокса соглашения после полной загрузки DOM
    setTimeout(function() {
      const agreementCheckbox = document.getElementById('agreement');
      if (agreementCheckbox) {
        // Проверяем, не имеет ли чекбокс уже обработчики с флагом
        if (!agreementCheckbox._hasGlobalHandlers) {
          agreementCheckbox._hasGlobalHandlers = true;
          
          // Обработчик события change
          agreementCheckbox.addEventListener('change', function() {
            if (this.checked) {
              console.log('Чекбокс соглашения изменен, убираем ошибку (глобальный обработчик)');
              const checkboxGroup = this.closest('.checkbox-group');
              if (checkboxGroup && checkboxGroup.classList.contains('error')) {
                checkboxGroup.classList.remove('error');
                
                // Проверяем, можно ли скрыть сообщение об ошибке
                const formAlert = document.getElementById('form-alert');
                if (formAlert && formAlert.style.display === 'flex') {
                  // Проверяем наличие других ошибок
                  const hasOtherErrors = document.querySelector('#blogger-form .error-field') || 
                                      document.querySelector('#blogger-form .checkbox-group.error');
                  if (!hasOtherErrors) {
                    formAlert.style.display = 'none';
                  }
                }
              }
            }
          });
          
          // Дополнительный обработчик для клика
          agreementCheckbox.addEventListener('click', function(e) {
            // Остановим всплытие, чтобы предотвратить конфликты
            e.stopPropagation();
            
            // Отложенная проверка состояния
            setTimeout(() => {
              if (this.checked) {
                const checkboxGroup = this.closest('.checkbox-group');
                if (checkboxGroup && checkboxGroup.classList.contains('error')) {
                  console.log('Чекбокс соглашения кликнут (глобальный обработчик)');
                  checkboxGroup.classList.remove('error');
                }
              }
            }, 0);
          });
        }
      }
    }, 500); // Задержка для гарантии, что DOM полностью загрузился
  });
  