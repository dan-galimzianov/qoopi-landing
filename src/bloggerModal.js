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

        // Сбрасываем состояние селектора социальной сети
        const selectHeader = document.querySelector('.modal-select-header');
        if (selectHeader) {
          const span = selectHeader.querySelector('span');
          if (span) {
            span.textContent = selectHeader.getAttribute('data-placeholder') || 'Выберите социальную сеть';
          }
          selectHeader.classList.remove('has-selection');
          selectHeader.classList.remove('error-field');
        }
        
        const formAlert = document.getElementById('form-alert');
        if (formAlert) formAlert.style.display = 'none';

        // Сбрасываем значение поля account
        const accountInput = document.getElementById('account');
        if (accountInput) {
          accountInput.value = 'https://';
          accountInput.placeholder = 'https://';
        }
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
      
      // Сбрасываем селектор
      const selectHeader = document.querySelector('.modal-select-header');
      if (selectHeader) {
        const span = selectHeader.querySelector('span');
        if (span) {
          span.textContent = selectHeader.getAttribute('data-placeholder') || 'Выберите социальную сеть';
        }
        selectHeader.classList.remove('has-selection');
        selectHeader.classList.remove('error-field');
      }
      
      // Сбрасываем значение скрытого поля социальной сети
      const socialNetworkInput = document.getElementById('socialNetwork');
      if (socialNetworkInput) {
        socialNetworkInput.value = '';
      }
      
      // Сбрасываем значение поля account
      const accountInput = document.getElementById('account');
      if (accountInput) {
        accountInput.value = 'https://';
        accountInput.placeholder = 'https://';
        accountInput.style.color = '#8a8a8a';
      }
      
      // Сбрасываем чекбоксы к дефолтным значениям
      const agreementCheckbox = document.getElementById('agreement');
      const newsletterCheckbox = document.getElementById('newsletter');
      
      if (agreementCheckbox) agreementCheckbox.checked = false;
      if (newsletterCheckbox) newsletterCheckbox.checked = true;
      
      // Сбрасываем селекции в выпадающем списке
      const options = document.querySelectorAll('.modal-select-option');
      options.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-selected', 'false');
      });
      
      // Закрываем выпадающий список (еще раз, для уверенности)
      resetSelectAndDropdown();
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
      const bloggerBtn = document.getElementById('openBloggerModalBtn');
      if (bloggerBtn) {
        console.log('Добавляем отдельный обработчик для кнопки с ID openBloggerModalBtn');
        
        bloggerBtn.addEventListener('click', function(e) {
          console.log('Клик по кнопке с ID openBloggerModalBtn');
          e.preventDefault();
          e.stopPropagation();
          openModal();
        });
      }
      
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
  
    // Проверка формы селектора
    function initModalSelect() {
      console.log('Инициализация селектора...');
      const selectHeaders = document.querySelectorAll('.modal-select-header');
  
      if (!selectHeaders.length) {
        console.log('Ошибка: не найдены элементы .modal-select-header');
        return;
      }
      
      console.log(`Найдено ${selectHeaders.length} селекторов`);
  
      selectHeaders.forEach((header) => {
        const selectContainer = header.closest('.modal-select-container');
        const dropdown = selectContainer.querySelector('.modal-select-dropdown');
        const arrow = header.querySelector('.modal-select-arrow');
        const options = dropdown.querySelectorAll('.modal-select-option');
        const liveRegion = selectContainer.querySelector(
          '.modal-select-live-region'
        );
        
        // Принудительная инициализация стилей для правильной работы
        dropdown.style.position = 'absolute';
        dropdown.style.width = '100%';
        dropdown.style.backgroundColor = '#515151';
        dropdown.style.borderRadius = '8px';
        dropdown.style.zIndex = '10000';
        
        // Обработчик клика на заголовок с inline-стилями
        header.addEventListener('click', function(e) {
          console.log('Клик на заголовок селектора (дополнительный обработчик)');
          e.stopPropagation();
          
          const isCurrentlyOpen = dropdown.classList.contains('open');
          
          if (!isCurrentlyOpen) {
            // Сначала закрываем все другие дропдауны
            document.querySelectorAll('.modal-select-dropdown').forEach(d => {
              if (d !== dropdown) {
                d.classList.remove('open');
                d.style.maxHeight = '0';
                d.style.opacity = '0';
                d.style.pointerEvents = 'none';
              }
            });
            
            // Теперь открываем наш дропдаун
            dropdown.classList.add('open');
            dropdown.style.maxHeight = '250px';
            dropdown.style.opacity = '1';
            dropdown.style.pointerEvents = 'auto';
            dropdown.style.display = 'block';
            arrow.classList.add('up');
          } else {
            // Закрываем дропдаун
            dropdown.classList.remove('open');
            dropdown.style.maxHeight = '0';
            dropdown.style.opacity = '0';
            dropdown.style.pointerEvents = 'none';
            arrow.classList.remove('up');
          }
        });

        // Обработчик клика на опции с inline-стилями
        options.forEach((option) => {
          option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Выбираем опцию
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            // Обновляем текст заголовка
            header.querySelector('span').textContent = option.querySelector('span').textContent;
            header.classList.add('has-selection');
            
            // Обновляем скрытое поле
            const hiddenInput = selectContainer.querySelector('input[type="hidden"]');
            if (hiddenInput) {
              hiddenInput.value = option.getAttribute('data-value');
              const event = new Event('change', { bubbles: true });
              hiddenInput.dispatchEvent(event);
            }
            
            // Закрываем дропдаун
            dropdown.classList.remove('open');
            dropdown.style.maxHeight = '0';
            dropdown.style.opacity = '0';
            dropdown.style.pointerEvents = 'none';
            arrow.classList.remove('up');
          });
        });
        
        // Сбросить все выбранные элементы при инициализации
        options.forEach((option) => {
          option.classList.remove('selected');
          option.setAttribute('aria-selected', 'false');
        });
  
        // Функция обновления заголовка
        function updateHeader() {
          const selectedOption = Array.from(options).find((opt) =>
            opt.classList.contains('selected')
          );
  
          if (!selectedOption) {
            header.querySelector('span').textContent =
              header.getAttribute('data-placeholder') || 'Выберите опцию';
            header.classList.remove('has-selection'); // Удаляем класс, если нет выбора
          } else {
            header.querySelector('span').textContent =
              selectedOption.querySelector('span').textContent;
            header.classList.add('has-selection'); // Добавляем класс при выборе
          }
        }
  
        // Вызвать updateHeader() для установки начального состояния заголовка
        updateHeader();
  
        // Функция для обновления визуального состояния и ARIA-атрибутов
        function updateOptionState(option, isSelected) {
          // Сначала сбросим все опции
          options.forEach((opt) => {
            opt.classList.remove('selected');
            opt.setAttribute('aria-selected', 'false');
          });
  
          // Затем выберем нужную опцию
          if (isSelected) {
            option.classList.add('selected');
            option.setAttribute('aria-selected', 'true');
          }
  
          // Обновить live region для скринридеров
          if (liveRegion) {
            liveRegion.textContent = `${
              option.querySelector('span').textContent
            } ${isSelected ? 'выбрано' : 'не выбрано'}`;
          }
        }
  
        // Управление с клавиатуры для заголовка
        header.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isExpanded = dropdown.classList.toggle('open');
            arrow.classList.toggle('up', isExpanded);
            header.setAttribute('aria-expanded', isExpanded);
  
            if (isExpanded && options.length > 0) {
              // Фокус на первый элемент списка при открытии
              options[0].focus();
            }
          } else if (e.key === 'Escape' && dropdown.classList.contains('open')) {
            dropdown.classList.remove('open');
            arrow.classList.remove('up');
            header.setAttribute('aria-expanded', 'false');
            header.focus();
          } else if (
            e.key === 'ArrowDown' &&
            dropdown.classList.contains('open')
          ) {
            e.preventDefault();
            if (options.length > 0) {
              options[0].focus();
            }
          }
        });
  
        // Управление с клавиатуры для опций
        options.forEach((option, index) => {
          option.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const isSelected = !option.classList.contains('selected');
              updateOptionState(option, isSelected);
              updateHeader();
  
              // Получить значение выбранной опции
              const value = option.getAttribute('data-value');
  
              // Найти и обновить скрытое поле ввода, если оно есть
              const hiddenInput = selectContainer.querySelector(
                'input[type="hidden"]'
              );
              if (hiddenInput) {
                hiddenInput.value = value;
  
                // Создадим событие изменения для скрытого поля
                const changeEvent = new Event('change', { bubbles: true });
                hiddenInput.dispatchEvent(changeEvent);
              }
  
              // Закрыть дропдаун после выбора
              dropdown.classList.remove('open');
              arrow.classList.remove('up');
              header.setAttribute('aria-expanded', 'false');
              header.focus();
            } else if (e.key === 'Escape') {
              dropdown.classList.remove('open');
              arrow.classList.remove('up');
              header.setAttribute('aria-expanded', 'false');
              header.focus();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              const nextIndex = (index + 1) % options.length;
              options[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (index === 0) {
                header.focus();
              } else {
                const prevIndex = (index - 1 + options.length) % options.length;
                options[prevIndex].focus();
              }
            }
          });
        });
      });
  
      // Закрыть все дропдауны при клике вне элементов
      document.addEventListener('click', function (e) {
        const selectContainers = document.querySelectorAll(
          '.modal-select-container'
        );
        selectContainers.forEach((container) => {
          const header = container.querySelector('.modal-select-header');
          const dropdown = container.querySelector('.modal-select-dropdown');
          const arrow = container.querySelector('.modal-select-arrow');
  
          if (!container.contains(e.target)) {
            dropdown.classList.remove('open');
            arrow.classList.remove('up');
            header.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  
    // Функция обновления цвета поля account в зависимости от его содержимого
    function updateAccountFieldColor() {
      const accountInput = document.getElementById('account');
      if (!accountInput) return;
      
      // Начальная настройка цвета
      if (accountInput.value === 'https://' || accountInput.value === '') {
        accountInput.style.color = '#8a8a8a'; // Серый цвет для https://
      } else {
        accountInput.style.color = '#ffffff'; // Белый цвет для введенного контента
      }
      
      // Обработчик ввода
      accountInput.addEventListener('input', function() {
        if (this.value === 'https://' || this.value === '') {
          this.style.color = '#8a8a8a';
        } else {
          this.style.color = '#ffffff';
        }
      });
      
      // Обработчик фокуса
      accountInput.addEventListener('focus', function() {
        this.style.color = '#ffffff'; // При фокусе всегда белый
      });
      
      // Обработчик потери фокуса
      accountInput.addEventListener('blur', function() {
        if (this.value === 'https://' || this.value === '') {
          this.style.color = '#8a8a8a';
        } else {
          this.style.color = '#ffffff';
        }
      });
    }
  
    // Функция инициализации лайв-валидации полей
    function initLiveValidation() {
      // Находим все текстовые поля ввода
      const inputFields = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');
      inputFields.forEach(field => {
        field.addEventListener('input', function() {
          // Если поле непустое, убираем класс ошибки
          if (this.value.trim() !== '') {
            this.classList.remove('error-field');
          }
        });
        
        // Обработка фокуса - убираем ошибку при фокусе
        field.addEventListener('focus', function() {
          this.classList.remove('error-field');
        });
      });
      
      // Обработчик для чекбокса согласия
      const agreementCheckbox = document.getElementById('agreement');
      if (agreementCheckbox) {
        agreementCheckbox.addEventListener('change', function() {
          const checkboxGroup = this.closest('.checkbox-group');
          if (this.checked && checkboxGroup) {
            console.log('Чекбокс отмечен, убираем ошибку');
            checkboxGroup.classList.remove('error');
            
            // Проверяем, можно ли скрыть сообщение об ошибке
            const formAlert = document.getElementById('form-alert');
            const hasErrors = form.querySelector('.error-field, .checkbox-group.error');
            if (!hasErrors && formAlert) {
              formAlert.style.display = 'none';
            }
          }
        });
        
        // Дополнительный обработчик для события click
        agreementCheckbox.addEventListener('click', function() {
          setTimeout(() => {
            const checkboxGroup = this.closest('.checkbox-group');
            if (this.checked && checkboxGroup) {
              console.log('Чекбокс кликнут, убираем ошибку');
              checkboxGroup.classList.remove('error');
              
              // Проверяем все поля и скрываем сообщение об ошибке если все в порядке
              const formAlert = document.getElementById('form-alert');
              const hasErrors = form.querySelector('.error-field, .checkbox-group.error');
              if (!hasErrors && formAlert) {
                formAlert.style.display = 'none';
              }
            }
          }, 0);
        });
      }
    }
  
    // Инициализация
    initPhoneMask();
    initFollowersMask();
    initSocialAutocomplete();
    initModalSelect();
    updateAccountFieldColor(); // Добавляем вызов новой функции
    initLiveValidation();
  
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
  
      // Устанавливаем начальное значение
      if (!accountInput.value) {
        accountInput.value = 'https://';
      }
  
      socialNetworkInput.addEventListener('change', function () {
        const domains = {
          instagram: 'https://instagram.com/',
          youtube: 'https://youtube.com/',
          tiktok: 'https://tiktok.com/@',
          other: 'https://',
        };
  
        // Устанавливаем базовый URL и меняем placeholder
        const domainValue = domains[this.value.toLowerCase()] || 'https://';
        accountInput.value = domainValue;
        accountInput.placeholder = 'Введите ваш аккаунт';
        
        // Перемещаем курсор в конец поля
        accountInput.focus();
        const len = accountInput.value.length;
        accountInput.setSelectionRange(len, len);
  
        // Добавляем обработчик ввода, чтобы проверять заполнение
        accountInput.removeEventListener('input', handleAccountInput);
        accountInput.addEventListener('input', handleAccountInput);
  
        // Проверяем сразу после изменения
        validateAccountField(accountInput);
      });
  
      // Функция проверки поля account
      function validateAccountField(field) {
        const value = field.value.trim();
        const baseUrls = [
          'https://instagram.com/',
          'https://youtube.com/',
          'https://tiktok.com/@',
          'https://',
        ];
  
        // Если поле пустое или содержит только базовый URL без дополнения
        if (!value || baseUrls.some((url) => value === url)) {
          showError(field);
          return false;
        }
  
        // Если поле заполнено правильно
        field.classList.remove('error-field');
        return true;
      }
  
      // Обработчик ввода в поле account
      function handleAccountInput(e) {
        validateAccountField(e.target);
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
          const selectHeader = document.querySelector('.modal-select-header');
          if (selectHeader) {
            selectHeader.classList.add('error-field');
          }
        }
        
        if (accountInput && (accountInput.value === 'https://' || 
            accountInput.value === 'https://instagram.com/' || 
            accountInput.value === 'https://youtube.com/' || 
            accountInput.value === 'https://tiktok.com/@')) {
          // Подсвечиваем поле аккаунта, если оно содержит только шаблон
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
          const selectHeader = document.querySelector('.modal-select-header');
          if (selectHeader) {
            selectHeader.classList.add('error-field');
          }
        }
        
        if (accountInput && (accountInput.value === 'https://' || 
            accountInput.value === 'https://instagram.com/' || 
            accountInput.value === 'https://youtube.com/' || 
            accountInput.value === 'https://tiktok.com/@')) {
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
        isValid = false;
        console.log('Ошибка: социальная сеть не выбрана');
      }
  
      // Проверка аккаунта
      if (!formData.account || ['https://', 'https://instagram.com/', 'https://youtube.com/', 'https://tiktok.com/@'].includes(formData.account)) {
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
      if (field.type === 'hidden') {
        const container = field.closest('.modal-select-container');
        if (container) {
          const header = container.querySelector('.modal-select-header');
          if (header) {
            header.classList.add('error-field');
          }
        }
      }
    }
  });
  