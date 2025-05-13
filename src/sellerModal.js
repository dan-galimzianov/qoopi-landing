document.addEventListener('DOMContentLoaded', function () {
    // Элементы модального окна
    const sellerModal = document.getElementById('sellerModal');
    const openSellerModalBtn = document.getElementById('openSellerModalBtn');
    const closeSellerModalBtn = document.getElementById('closeSellerModalBtn');
    const sellerForm = document.getElementById('seller-form');
    const submitSellerBtn = document.getElementById('submitSellerBtn');
    const modalContainer = sellerModal?.querySelector('.modal-container');
    const formAlert = document.getElementById('seller-form-alert');
  
    // Анимационные параметры
    const ANIMATION_DURATION = 300;
    let isAnimating = false;
  
    // Инициализация при загрузке
    if (sellerModal) {
      initMultiSelect();
      initPhoneMask();
      setupEventListeners();
    } else {
      // Если мы находимся на странице только с мультиселектором, но без модального окна продавца
      initStandaloneMultiSelect();
    }
  
    // ====================================================
    // Функционал мультиселектора (из dropdown.js)
    // ====================================================
    function initStandaloneMultiSelect() {
      const multiSelectHeader = document.getElementById('categoryHeader');
      const multiSelectDropdown = document.getElementById('categoryDropdown');
  
      if (multiSelectHeader && multiSelectDropdown) {
        const arrow = multiSelectHeader.querySelector('.arrow');
        const options = multiSelectDropdown.querySelectorAll(
          '.multi-select-option'
        );
        const liveRegion = document.getElementById('liveRegion');
        const multiSelectContainer = document.querySelector('.multi-select-container');
  
        // Сбросить все выбранные элементы при инициализации
        options.forEach((option) => {
          option.classList.remove('selected');
          option.setAttribute('aria-selected', 'false');
        });
  
        // Функция обновления заголовка на основе выбранных опций
        function updateHeader() {
          const selectedOptions = Array.from(options).filter((opt) =>
            opt.classList.contains('selected')
          );
          const localMultiSelectContainer = document.querySelector('.multi-select-container');
  
          if (selectedOptions.length === 0) {
            multiSelectHeader.querySelector('span').textContent =
              'Выберите категории';
            multiSelectHeader.classList.remove('has-selection');
          } else {
            // Берем категории для отображения
            const selectedLabels = selectedOptions.map(
              (opt) => opt.querySelector('span').textContent
            );
            multiSelectHeader.querySelector('span').textContent =
              selectedLabels.join(', ');
            multiSelectHeader.classList.add('has-selection');
          }

          // Убедимся, что нет border-bottom, если нет ошибки
          if (localMultiSelectContainer && !localMultiSelectContainer.classList.contains('error')) {
            multiSelectHeader.style.borderBottom = 'none';
          }
        }
  
        // Вызвать updateHeader() для установки начального состояния заголовка
        updateHeader();
  
        // Функция для обновления визуального состояния и ARIA-атрибутов
        function updateOptionState(option, isSelected) {
          option.classList.toggle('selected', isSelected);
          option.setAttribute('aria-selected', isSelected);
  
          // Обновить live region для скринридеров
          if (liveRegion) {
            liveRegion.textContent = `${
              option.querySelector('span').textContent
            } ${isSelected ? 'выбрано' : 'не выбрано'}`;
          }
        }
  
        // Обработчик клика на заголовок
        multiSelectHeader.addEventListener('click', function () {
          const isExpanded = multiSelectDropdown.classList.toggle('open');
          if (arrow) arrow.classList.toggle('up', isExpanded);
          multiSelectHeader.setAttribute('aria-expanded', isExpanded);
        });
  
        // Обработчик клика на опции
        options.forEach((option) => {
          option.addEventListener('click', function (e) {
            const isSelected = !option.classList.contains('selected');
            updateOptionState(option, isSelected);
            updateHeader();
            e.stopPropagation();
  
            // Сбросить состояние ошибки при выборе категории
            resetCategoryError();
          });
        });
  
        // Управление с клавиатуры для заголовка
        multiSelectHeader.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isExpanded = multiSelectDropdown.classList.toggle('open');
            if (arrow) arrow.classList.toggle('up', isExpanded);
            multiSelectHeader.setAttribute('aria-expanded', isExpanded);
  
            if (isExpanded && options.length > 0) {
              // Фокус на первый элемент списка при открытии
              options[0].focus();
            }
          } else if (
            e.key === 'Escape' &&
            multiSelectDropdown.classList.contains('open')
          ) {
            multiSelectDropdown.classList.remove('open');
            if (arrow) arrow.classList.remove('up');
            multiSelectHeader.setAttribute('aria-expanded', 'false');
            multiSelectHeader.focus();
          } else if (
            e.key === 'ArrowDown' &&
            multiSelectDropdown.classList.contains('open') &&
            options.length > 0
          ) {
            e.preventDefault();
            options[0].focus();
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
  
              // Сбросить состояние ошибки при выборе категории
              resetCategoryError();
            } else if (e.key === 'Escape') {
              multiSelectDropdown.classList.remove('open');
              if (arrow) arrow.classList.remove('up');
              multiSelectHeader.setAttribute('aria-expanded', 'false');
              multiSelectHeader.focus();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              const nextIndex = (index + 1) % options.length;
              options[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (index === 0) {
                multiSelectHeader.focus();
              } else {
                const prevIndex = (index - 1 + options.length) % options.length;
                options[prevIndex].focus();
              }
            }
          });
        });
  
        // Функция для закрытия выпадающего списка
        function closeDropdown() {
          multiSelectDropdown.classList.remove('open');
          if (arrow) arrow.classList.remove('up');
          multiSelectHeader.setAttribute('aria-expanded', 'false');
        }
        
        // Делаем функцию доступной глобально
        window.closeCategoryDropdown = closeDropdown;
        
        // Добавляем обработчик клика на модальное окно селлеров
        const sellerModalContainer = document.querySelector('#sellerModal .modal-container');
        if (sellerModalContainer) {
          sellerModalContainer.addEventListener('click', function(e) {
            // Проверяем, что клик был не внутри мультиселектора
            if (!multiSelectContainer.contains(e.target) && 
                !multiSelectHeader.contains(e.target) && 
                multiSelectDropdown.classList.contains('open')) {
              closeDropdown();
            }
          });
        }
  
        // Закрыть дропдаун при клике вне элемента
        document.addEventListener('click', function (e) {
          if (
            !multiSelectHeader.contains(e.target) &&
            !multiSelectDropdown.contains(e.target)
          ) {
            closeDropdown();
          }
        });
  
        // Интеграция мультиселектора с формой
        window.multiSelect = {
          getSelectedValues: function () {
            return Array.from(options)
              .filter((opt) => opt.classList.contains('selected'))
              .map(
                (opt) =>
                  opt.getAttribute('data-value') ||
                  opt.querySelector('span').textContent
              );
          },
  
          reset: function () {
            options.forEach((option) => {
              option.classList.remove('selected');
              option.setAttribute('aria-selected', 'false');
            });
            updateHeader();
            resetCategoryError();
          },
        };
      }
    }
  
    // Инициализация мультиселекта для модального окна
    function initMultiSelect() {
      const multiSelectContainer = document.querySelector(
        '.multi-select-container'
      );
  
      if (multiSelectContainer) {
        const multiSelectHeader =
          multiSelectContainer.querySelector('.multi-select-header') ||
          document.getElementById('categoryHeader');
        const multiSelectDropdown =
          multiSelectContainer.querySelector('.multi-select-dropdown') ||
          document.getElementById('categoryDropdown');
        const options = multiSelectDropdown.querySelectorAll(
          '.multi-select-option'
        );
  
        if (multiSelectHeader && multiSelectDropdown && options.length > 0) {
          // Интеграция существующего мультиселектора с окном продавца
          initStandaloneMultiSelect();
          
          // Предотвращаем распространение событий клика от мультиселектора
          // для предотвращения закрытия модального окна
          multiSelectContainer.addEventListener('click', function(e) {
            e.stopPropagation();
          });
          
          multiSelectHeader.addEventListener('click', function(e) {
            e.stopPropagation();
          });
          
          multiSelectDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
          });
        }
      }
    }
  
    // Сбросить ошибку категорий
    function resetCategoryError() {
      const multiSelectHeader = document.getElementById('categoryHeader');
      const multiSelectContainer = document.querySelector('.multi-select-container');
  
      if (multiSelectContainer) {
        multiSelectContainer.classList.remove('error');
      }
  
      if (multiSelectHeader) {
        multiSelectHeader.classList.remove('error');
        // Явно удаляем стили границы
        multiSelectHeader.style.borderBottom = 'none';
        multiSelectHeader.style.borderBottomColor = '';
        
        // Обновляем класс has-selection в зависимости от наличия выбранных опций
        const hasSelected = document.querySelectorAll('.multi-select-option.selected').length > 0;
        if (hasSelected) {
          multiSelectHeader.classList.add('has-selection');
        } else {
          multiSelectHeader.classList.remove('has-selection');
        }
      }
    }
  
    // ====================================================
    // Функционал модального окна продавца
    // ====================================================
  
    // Маска для телефона
    function initPhoneMask() {
      const phoneInput = document.getElementById('sellerPhone');
      if (!phoneInput) return;
  
      phoneInput.addEventListener('input', function (e) {
        let x = e.target.value
          .replace(/\D/g, '')
          .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[2]
          ? '+7'
          : `+7 (${x[2]}${x[3] ? `) ${x[3]}` : ''}${x[4] ? `-${x[4]}` : ''}${
              x[5] ? `-${x[5]}` : ''
            }`;
      });
    }
  
    // Функция открытия модального окна
    function openSellerModal() {
      if (isAnimating || !sellerModal) return;
      isAnimating = true;
  
      sellerModal.style.display = 'flex';
      sellerModal.style.opacity = '0';
      modalContainer.style.transform = 'translateY(20px)';
      modalContainer.style.opacity = '0';
  
      requestAnimationFrame(() => {
        sellerModal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
        modalContainer.style.transition = `all ${ANIMATION_DURATION}ms ease`;
  
        sellerModal.style.opacity = '1';
        modalContainer.style.transform = 'translateY(0)';
        modalContainer.style.opacity = '1';
  
        setTimeout(() => {
          isAnimating = false;
          sellerModal.classList.add('active');
        }, 20);
      });
  
      resetFormState();
      
      // Дополнительно сбрасываем ошибки на чекбоксах
      document.querySelectorAll('.checkbox-group.error').forEach((group) => {
        group.classList.remove('error');
      });
      
      // Скрываем сообщение об ошибке
      if (formAlert) {
        formAlert.style.display = 'none';
      }
      
      document.body.style.overflow = 'hidden';
    }
  
    // Функция плавного закрытия
    function closeSellerModal() {
      if (isAnimating || !sellerModal) return;
      isAnimating = true;
  
      sellerModal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
      modalContainer.style.transition = `all ${ANIMATION_DURATION}ms ease`;
  
      sellerModal.style.opacity = '0';
      modalContainer.style.transform = 'translateY(20px)';
      modalContainer.style.opacity = '0';
  
      setTimeout(() => {
        sellerModal.style.display = 'none';
        document.body.style.overflow = '';
        sellerModal.classList.remove('active');
        sellerModal.style.transition = '';
        modalContainer.style.transition = '';
        isAnimating = false;
  
        // Закрытие мультиселекта при закрытии модального окна
        const multiSelectDropdown = document.getElementById('categoryDropdown');
        const multiSelectHeader = document.getElementById('categoryHeader');
        const arrow = document.querySelector('.arrow');
  
        if (multiSelectDropdown) {
          multiSelectDropdown.classList.remove('open');
        }
  
        if (multiSelectHeader) {
          multiSelectHeader.setAttribute('aria-expanded', 'false');
        }
  
        if (arrow) {
          arrow.classList.remove('up');
        }
      }, ANIMATION_DURATION);
    }
  
    // Обработчик отправки формы
    function handleSubmit(e) {
      if (e) e.preventDefault();
  
      const formData = {
        companyName: document.getElementById('companyName')?.value || '',
        // Используем новый мультиселектор для сбора категорий
        productCategories: window.multiSelect
          ? window.multiSelect.getSelectedValues()
          : [],
        marketplaceLink: document.getElementById('marketplaceLink')?.value || '',
        sellerName: document.getElementById('sellerName')?.value || '',
        sellerEmail: document.getElementById('sellerEmail')?.value || '',
        sellerPhone: document.getElementById('sellerPhone')?.value || '',
        agreement: document.getElementById('sellerAgreement')?.checked || false,
        newsletter: document.getElementById('sellerNewsletter')?.checked || false,
      };
  
      if (validateForm(formData)) {
        console.log('Form data:', formData);
        closeSellerModal();
        setTimeout(openSuccessModal, ANIMATION_DURATION + 50);
      }
    }
  
    // Валидация формы
    function validateForm(formData) {
      let isValid = true;
  
      // Сброс предыдущих ошибок
      resetErrorStates();
  
      // Проверка обязательных полей
      const requiredFields = [
        'companyName',
        'marketplaceLink',
        'sellerName',
        'sellerEmail',
        'sellerPhone',
      ];
  
      requiredFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (
          !field ||
          !formData[fieldId] ||
          formData[fieldId].trim() === '' ||
          (fieldId === 'marketplaceLink' && formData[fieldId] === 'https://')
        ) {
          if (field) markFieldAsError(field);
          isValid = false;
        }
      });
  
      // Проверка категорий
      if (
        !formData.productCategories ||
        formData.productCategories.length === 0
      ) {
        // Обработка ошибки для мультиселектора
        const multiSelectContainer = document.querySelector(
          '.multi-select-container'
        );
        const multiSelectHeader = document.getElementById('categoryHeader');
        const multiSelectDropdown = document.getElementById('categoryDropdown');
  
        if (multiSelectContainer) {
          multiSelectContainer.classList.add('error');
        }
  
        if (multiSelectDropdown) {
          multiSelectDropdown.classList.add('error');
        }
  
        if (multiSelectHeader) {
          multiSelectHeader.classList.add('error');
          // Удаляем inline стиль, используем только классы
          // multiSelectHeader.style.borderBottomColor = '#ff3b30';
  
          const span = multiSelectHeader.querySelector('span');
          if (span) {
            span.style.color = '#ff3b30';
          }
        }
  
        isValid = false;
      }
  
      // Проверка email
      if (formData.sellerEmail && !validateEmail(formData.sellerEmail)) {
        const emailField = document.getElementById('sellerEmail');
        if (emailField) markFieldAsError(emailField);
        isValid = false;
      }
  
      // Проверка телефона
      if (formData.sellerPhone && formData.sellerPhone.length < 5) {
        const phoneField = document.getElementById('sellerPhone');
        if (phoneField) markFieldAsError(phoneField);
        isValid = false;
      }
  
      // Проверка соглашения
      if (!formData.agreement) {
        const agreementCheckbox = document.getElementById('sellerAgreement');
        if (agreementCheckbox) {
          const agreementGroup = agreementCheckbox.closest('.checkbox-group');
          if (agreementGroup) agreementGroup.classList.add('error');
        }
        isValid = false;
      } else {
        // Если соглашение принято, убеждаемся что ошибка снята
        const agreementCheckbox = document.getElementById('sellerAgreement');
        if (agreementCheckbox) {
          const agreementGroup = agreementCheckbox.closest('.checkbox-group');
          if (agreementGroup) agreementGroup.classList.remove('error');
        }
      }
  
      if (!isValid) {
        showFormAlert();
        scrollToFirstError();
      }
  
      return isValid;
    }
  
    // Пометить поле как ошибочное
    function markFieldAsError(field) {
      field.classList.add('error-field');
      field.style.color = '#ff3b30';
      field.style.borderBottomColor = '#ff3b30';
    }
  
    // Сбросить состояния ошибок
    function resetErrorStates() {
      // Сброс ошибок полей ввода
      document.querySelectorAll('.error-field').forEach((field) => {
        field.classList.remove('error-field');
        field.style.color = '#ffffff'; // Возвращаем стандартный цвет текста
        field.style.borderBottomColor = '#515151'; // Возвращаем стандартный цвет границы
      });

      // Сброс ошибок мультиселекта (как для старого, так и для нового)
      resetCategoryError();
      
      // Дополнительно убедимся, что у заголовка мультиселекта нет границы
      const multiSelectHeader = document.getElementById('categoryHeader');
      if (multiSelectHeader) {
        multiSelectHeader.style.borderBottom = 'none';
      }

      // Сброс ошибок чекбоксов
      document.querySelectorAll('.checkbox-group.error').forEach((group) => {
        group.classList.remove('error');
      });
      
      // Дополнительно проверяем соглашение - если оно отмечено, убираем ошибку
      const agreementCheckbox = document.getElementById('sellerAgreement');
      if (agreementCheckbox && agreementCheckbox.checked) {
        const checkboxGroup = agreementCheckbox.closest('.checkbox-group');
        if (checkboxGroup) checkboxGroup.classList.remove('error');
      }

      // Скрываем сообщение об ошибке
      if (formAlert) {
        formAlert.style.display = 'none';
      }
    }
  
    // Показать сообщение об ошибке формы
    function showFormAlert() {
      if (formAlert) {
        formAlert.style.display = 'flex';
        formAlert.style.animation = 'none';
        void formAlert.offsetWidth; // Trigger reflow
        formAlert.style.animation = 'shake 0.5s ease';
      }
    }
  
    // Прокрутить к первой ошибке
    function scrollToFirstError() {
      const firstError = document.querySelector(
        '.error-field, .error, .checkbox-group.error'
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  
    // Валидация email
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    // Открытие модального окна успеха
    function openSuccessModal() {
      const successModal = document.getElementById('successModal');
      if (successModal) {
        successModal.style.display = 'flex';
        setTimeout(() => {
          successModal.style.opacity = '1';
        }, 20);
      }
    }
  
    // Сброс состояния формы
    function resetFormState() {
      if (sellerForm) {
        sellerForm.reset();
  
        const agreementCheckbox = document.getElementById('sellerAgreement');
        if (agreementCheckbox) agreementCheckbox.checked = false;
  
        const newsletterCheckbox = document.getElementById('sellerNewsletter');
        if (newsletterCheckbox) newsletterCheckbox.checked = true;
  
        // Сброс мультиселекта
        if (window.multiSelect) {
          window.multiSelect.reset();
        }
  
        // Сброс ошибок
        resetErrorStates();
      }
    }
  
    // Настройка обработчиков событий
    function setupEventListeners() {
      if (openSellerModalBtn) {
        openSellerModalBtn.addEventListener('click', openSellerModal);
      }
  
      if (closeSellerModalBtn) {
        closeSellerModalBtn.addEventListener('click', closeSellerModal);
      }
  
      if (submitSellerBtn) {
        submitSellerBtn.addEventListener('click', handleSubmit);
      }
  
      if (sellerModal) {
        sellerModal.addEventListener('click', function (e) {
          if (e.target === sellerModal) closeSellerModal();
        });
      }
  
      if (modalContainer) {
        modalContainer.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      }
  
      document.addEventListener('keydown', function (e) {
        if (
          e.key === 'Escape' &&
          sellerModal &&
          sellerModal.classList.contains('active')
        ) {
          closeSellerModal();
        }
      });
  
      // Сброс ошибок при изменении полей
      document.querySelectorAll('#seller-form input').forEach((input) => {
        input.addEventListener('input', function () {
          if (this.classList.contains('error-field')) {
            this.classList.remove('error-field');
            this.style.color = '#ffffff';
            this.style.borderBottomColor = '#515151';
          }
        });
      });
      
      // Сброс ошибок при изменении чекбоксов
      document.querySelectorAll('#seller-form input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', function() {
          const checkboxGroup = this.closest('.checkbox-group');
          if (this.checked && checkboxGroup) {
            console.log('Чекбокс отмечен, убираем ошибку');
            checkboxGroup.classList.remove('error');
            
            // Если это чекбокс соглашения, проверяем можно ли скрыть сообщение об ошибке
            if (this.id === 'sellerAgreement') {
              // Проверяем наличие других ошибок
              const hasOtherErrors = document.querySelector('.error-field') || 
                                  document.querySelector('.checkbox-group.error');
              if (!hasOtherErrors && formAlert) {
                formAlert.style.display = 'none';
              }
            }
          }
        });
        
        // Дополнительный обработчик события click для надежности
        if (checkbox.id === 'sellerAgreement') {
          checkbox.addEventListener('click', function() {
            setTimeout(() => {
              if (this.checked) {
                console.log('Чекбокс соглашения кликнут, убираем ошибку');
                const checkboxGroup = this.closest('.checkbox-group');
                if (checkboxGroup) {
                  checkboxGroup.classList.remove('error');
                }
                
                // Проверяем все поля и скрываем сообщение об ошибке если все в порядке
                const hasOtherErrors = document.querySelector('.error-field') || 
                                    document.querySelector('.checkbox-group.error');
                if (!hasOtherErrors && formAlert) {
                  formAlert.style.display = 'none';
                }
              }
            }, 0);
          });
          
          // Добавляем обработчик для метки чекбокса
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            label.addEventListener('click', function() {
              setTimeout(() => {
                const agreementCheckbox = document.getElementById('sellerAgreement');
                if (agreementCheckbox && agreementCheckbox.checked) {
                  console.log('Клик по метке чекбокса, убираем ошибку');
                  const checkboxGroup = agreementCheckbox.closest('.checkbox-group');
                  if (checkboxGroup) {
                    checkboxGroup.classList.remove('error');
                  }
                  
                  // Проверяем все поля и скрываем сообщение об ошибке если все в порядке
                  const hasOtherErrors = document.querySelector('.error-field') || 
                                      document.querySelector('.checkbox-group.error');
                  if (!hasOtherErrors && formAlert) {
                    formAlert.style.display = 'none';
                  }
                }
              }, 10); // Увеличенная задержка для надежности
            });
          }
        }
      });
    }
    
    // Экспортируем функции для доступа из modalInit.js
    window.sellerModalFunctions = {
      openSellerModal,
      closeSellerModal
    };
    
    // Экспортируем функцию напрямую для доступа из modalInit.js
    window.openSellerModalFunction = openSellerModal;
    
    // Ручная инициализация обработчика для чекбокса соглашения при загрузке
    setTimeout(function() {
      const agreementCheckbox = document.getElementById('sellerAgreement');
      if (agreementCheckbox) {
        // Проверяем, не имеет ли чекбокс уже обработчиков
        if (!agreementCheckbox._hasEventHandlers) {
          agreementCheckbox._hasEventHandlers = true;
          
          // Принудительно заменяем обработчики события для надежности
          agreementCheckbox.addEventListener('change', function() {
            if (this.checked) {
              console.log('Чекбокс соглашения изменен, убираем ошибку (глобальный обработчик)');
              const checkboxGroup = this.closest('.checkbox-group');
              if (checkboxGroup) {
                checkboxGroup.classList.remove('error');
                
                // Проверяем все поля и скрываем сообщение об ошибке если все в порядке
                const formAlert = document.getElementById('seller-form-alert');
                const hasOtherErrors = document.querySelector('.error-field') || 
                                    document.querySelector('.checkbox-group.error');
                if (!hasOtherErrors && formAlert) {
                  formAlert.style.display = 'none';
                }
              }
            }
          });
        }
      }
    }, 500); // Задержка для гарантии, что DOM полностью загрузился
  });
  