// brand-modal.js
document.addEventListener('DOMContentLoaded', function () {
    // Элементы модального окна брендов
    const brandModal = document.getElementById('brandModal');
    const openBrandModalBtn = document.getElementById('openBrandModalBtn');
    const closeBrandModalBtn = document.getElementById('closeBrandModalBtn');
    const brandForm = document.getElementById('brand-form');
    const submitBrandBtn = document.getElementById('submitBrandBtn');
    const brandModalContainer = brandModal.querySelector('.modal-container');
  
    // Элементы модального окна подтверждения
    const successModal = document.getElementById('successModal');
    const successModalClose = document.getElementById('successModalClose');
  
    // Инициализация мультиселектора для брендов
    function initBrandMultiSelect() {
      const multiSelectHeader = document.getElementById('brandCategoryHeader');
      const multiSelectDropdown = document.getElementById(
        'brandCategoryDropdown'
      );
      
      if (!multiSelectHeader || !multiSelectDropdown) {
        console.error('Элементы мультиселектора не найдены');
        return;
      }
      
      // Удаляем все inline стили, которые могли быть применены
      multiSelectDropdown.removeAttribute('style');
      
      const arrow = multiSelectHeader.querySelector('.arrow');
      const options = multiSelectDropdown.querySelectorAll(
        '.multi-select-option'
      );
      const liveRegion = document.getElementById('brandLiveRegion');
      const multiSelectContainer = document.querySelector(
        '.multi-select-container'
      );
  
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
          headerSpan.textContent = 'Выберите категории';
          // Remove inline color style to let CSS handle it based on error state
          headerSpan.style.removeProperty('color');
          multiSelectHeader.classList.remove('has-selection');
        } else {
          const selectedLabels = selectedOptions.map(
            (opt) => opt.querySelector('span').textContent
          );
          headerSpan.textContent = selectedLabels.join(', ');
          // Always make selected values white per our CSS
          headerSpan.style.removeProperty('color');
          multiSelectHeader.classList.add('has-selection');
        }
        
        // Always ensure no border-bottom
        multiSelectHeader.style.borderBottom = 'none';
      }
  
      // Функция закрытия дропдауна
      function closeDropdown() {
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
      }
  
      // Вызвать updateHeader() для установки начального состояния
      updateHeader();
  
      // Функция для обновления состояния опции
      function updateOptionState(option, isSelected) {
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', isSelected);
  
        // Обновить live region для скринридеров
        liveRegion.textContent = `${option.querySelector('span').textContent} ${
          isSelected ? 'выбрано' : 'не выбрано'
        }`;
      }
  
      // Обработчик клика на заголовок
      multiSelectHeader.addEventListener('click', function (e) {
        e.stopPropagation();
        const isExpanded = multiSelectDropdown.classList.toggle('open');
        
        // Важно: убедимся, что display не установлен в none
        if (isExpanded) {
          multiSelectDropdown.style.display = 'block';
          multiSelectDropdown.style.visibility = 'visible';
          multiSelectDropdown.style.opacity = '1';
          multiSelectDropdown.style.maxHeight = '300px';
          multiSelectDropdown.style.overflowY = 'auto';
          multiSelectDropdown.style.transform = 'translateY(0)';
        }
        
        arrow.classList.toggle('up', isExpanded);
        multiSelectHeader.setAttribute('aria-expanded', isExpanded);
      });
  
      // Обработчик клика на опции
      options.forEach((option) => {
        option.addEventListener('click', function (e) {
          e.stopPropagation();
          const isSelected = !option.classList.contains('selected');
          updateOptionState(option, isSelected);
          updateHeader();
        });
      });
  
      // Управление с клавиатуры для заголовка
      multiSelectHeader.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isExpanded = multiSelectDropdown.classList.toggle('open');
          arrow.classList.toggle('up', isExpanded);
          multiSelectHeader.setAttribute('aria-expanded', isExpanded);
  
          if (isExpanded && options.length > 0) {
            options[0].focus();
          }
        } else if (
          e.key === 'Escape' &&
          multiSelectDropdown.classList.contains('open')
        ) {
          closeDropdown();
          multiSelectHeader.focus();
        } else if (
          e.key === 'ArrowDown' &&
          multiSelectDropdown.classList.contains('open')
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
          } else if (e.key === 'Escape') {
            closeDropdown();
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
          closeDropdown();
        }
      });
      
      // Дополнительный обработчик для формы и модального окна - закрываем список при взаимодействии с другими элементами
      if (brandForm) {
        // Закрытие при клике на любой элемент формы (кроме мультиселектора)
        brandForm.addEventListener('click', function(e) {
          if (!multiSelectContainer.contains(e.target) && multiSelectDropdown.classList.contains('open')) {
            closeDropdown();
          }
        });
        
        // Закрытие при фокусе на любом input поле
        const formInputs = brandForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
          input.addEventListener('focus', function() {
            if (multiSelectDropdown.classList.contains('open')) {
              closeDropdown();
            }
          });
        });
      }
      
      // Закрытие при клике в любом месте модального окна (но не в мультиселекторе)
      if (brandModalContainer) {
        brandModalContainer.addEventListener('click', function(e) {
          // Проверяем, что клик не был внутри мультиселектора и список открыт
          if (!multiSelectContainer.contains(e.target) && 
              multiSelectDropdown.classList.contains('open') &&
              e.target !== multiSelectHeader &&
              !multiSelectHeader.contains(e.target)) {
            closeDropdown();
          }
        });
      }
      
      // Закрытие при клике на футер модалки (чекбоксы, кнопка Отправить)
      const modalFooter = document.querySelector('#brandModal .modal-footer');
      if (modalFooter) {
        modalFooter.addEventListener('click', function(e) {
          // Проверяем, что выпадающий список открыт
          if (multiSelectDropdown.classList.contains('open') && 
              !multiSelectContainer.contains(e.target)) {
            closeDropdown();
          }
        });
      }
      
      // Закрытие при скролле содержимого модального окна
      const modalContent = document.querySelector('#brandModal .modal-content');
      if (modalContent) {
        modalContent.addEventListener('scroll', function() {
          if (multiSelectDropdown.classList.contains('open')) {
            closeDropdown();
          }
        });
      }
  
      // Закрытие при изменении размера окна
      window.addEventListener('resize', closeDropdown);
  
      // Экспортируем методы для доступа из формы
      window.brandMultiSelect = {
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
        },
        close: closeDropdown,
      };
    }
  
    // Функция открытия модального окна брендов
    function openBrandModal() {
      // Сначала сбрасываем мультиселектор
      resetBrandMultiSelect();
      
      // Убедимся, что dropdown не имеет display:none
      const multiSelectDropdown = document.getElementById('brandCategoryDropdown');
      const multiSelectHeader = document.getElementById('brandCategoryHeader');
      if (multiSelectDropdown) {
        multiSelectDropdown.removeAttribute('style');
      }
      
      // Убедимся, что заголовок не имеет нижней границы
      if (multiSelectHeader) {
        multiSelectHeader.style.borderBottom = 'none';
      }
      
      brandModal.style.display = 'flex';
      brandModal.style.opacity = '0';
      brandModal.style.visibility = 'visible';
      brandModalContainer.style.transform = 'translateY(20px)';
      brandModalContainer.style.opacity = '0';
  
      requestAnimationFrame(() => {
        brandModal.style.opacity = '1';
        brandModalContainer.style.transform = 'translateY(0)';
        brandModalContainer.style.opacity = '1';
      });
  
      // Сбрасываем форму и мультиселектор
      if (brandForm) {
        brandForm.reset();
        document.getElementById('brandAgreement').checked = false;
        document.getElementById('brandNewsletter').checked = true;
        window.brandMultiSelect?.reset();
  
        document.querySelectorAll('.error-field').forEach((el) => {
          el.classList.remove('error-field');
        });
        document.querySelectorAll('.checkbox-group').forEach((el) => {
          el.classList.remove('error');
        });
        document
          .querySelector('.multi-select-container')
          .classList.remove('error');
  
        const brandAlert = document.getElementById('brand-form-alert');
        if (brandAlert) brandAlert.style.display = 'none';
      }
  
      setTimeout(() => {
        brandModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 10);
    }
  
    function closeBrandModal() {
      // Сначала закрываем мультиселектор
      resetBrandMultiSelect();
      
      brandModal.style.opacity = '0';
      brandModalContainer.style.transform = 'translateY(20px)';
      brandModalContainer.style.opacity = '0';
  
      setTimeout(() => {
        brandModal.classList.remove('active');
        brandModal.style.display = 'none';
        brandModal.style.visibility = 'hidden';
        document.body.style.overflow = '';
        brandModal.style.opacity = '';
        brandModalContainer.style.transform = '';
        brandModalContainer.style.opacity = '';
        
        // Сбрасываем форму и селектор при закрытии
        resetBrandForm();
      }, 300);
    }
    
    // Функция сброса мультиселектора брендов
    function resetBrandMultiSelect() {
      // Получаем элементы мультиселектора
      const multiSelectDropdown = document.getElementById('brandCategoryDropdown');
      const multiSelectHeader = document.getElementById('brandCategoryHeader');
      
      if (!multiSelectDropdown || !multiSelectHeader) return;
      
      // Удаляем все inline стили, которые могут мешать
      multiSelectDropdown.removeAttribute('style');
      
      // Принудительно закрываем выпадающий список
      multiSelectDropdown.classList.remove('open');
      // Убираем display:none, который мешает корректной работе мультиселектора
      // multiSelectDropdown.style.display = 'none';
      multiSelectHeader.setAttribute('aria-expanded', 'false');
      
      // Сбрасываем стрелку
      const arrow = multiSelectHeader.querySelector('.arrow');
      if (arrow) {
        arrow.classList.remove('up');
      }
      
      // Сбрасываем выбранные опции
      const options = multiSelectDropdown.querySelectorAll('.multi-select-option');
      options.forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-selected', 'false');
      });
      
      // Сбрасываем заголовок
      const headerSpan = multiSelectHeader.querySelector('span');
      if (headerSpan) {
        headerSpan.textContent = 'Выберите категории';
        // Remove inline color style to let CSS handle it based on error/selection state
        headerSpan.style.removeProperty('color');
      }
      
      // Remove the has-selection class
      multiSelectHeader.classList.remove('has-selection');
      
      // Ensure no border-bottom
      multiSelectHeader.style.borderBottom = 'none';
    }
    
    // Функция сброса формы бренда и мультиселектора
    function resetBrandForm() {
      if (!brandForm) return;
      
      // Сбрасываем форму
      brandForm.reset();
      
      // Сбрасываем ошибки
      document.querySelectorAll('.error-field').forEach((el) => {
        el.classList.remove('error-field');
      });
      document.querySelectorAll('.checkbox-group').forEach((el) => {
        el.classList.remove('error');
      });
      document.querySelector('.multi-select-container')?.classList.remove('error');
      
      // Скрываем сообщение об ошибке
      const brandAlert = document.getElementById('brand-form-alert');
      if (brandAlert) brandAlert.style.display = 'none';
      
      // Сбрасываем мультиселектор категорий
      if (window.brandMultiSelect && window.brandMultiSelect.reset) {
        window.brandMultiSelect.reset();
      }
      
      // Принудительно закрываем и сбрасываем мультиселектор
      resetBrandMultiSelect();
      
      // Сбрасываем чекбоксы к дефолтным значениям
      document.getElementById('brandAgreement').checked = false;
      document.getElementById('brandNewsletter').checked = true;
    }
  
    // Обработчики событий для модального окна брендов
    if (openBrandModalBtn) {
      openBrandModalBtn.addEventListener('click', openBrandModal);
    }
  
    if (closeBrandModalBtn) {
      closeBrandModalBtn.addEventListener('click', closeBrandModal);
    }
  
    brandModal.addEventListener('click', function (e) {
      if (e.target === brandModal) {
        closeBrandModal();
      }
    });
  
    brandModalContainer.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  
    // Инициализация маски телефона для брендов
    function initBrandPhoneMask() {
      const phoneInput = document.getElementById('contactPhone');
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
  
    // Обработка отправки формы бренда
    if (submitBrandBtn && brandForm) {
      submitBrandBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Нажата кнопка отправки формы бренда');
        
        // Сначала убираем предыдущие ошибки
        document.querySelectorAll('.error-field').forEach((el) => {
          el.classList.remove('error-field');
        });
        document.querySelectorAll('.checkbox-group').forEach((el) => {
          el.classList.remove('error');
        });
        document.querySelector('.multi-select-container')?.classList.remove('error');
        
        // Скрываем сообщение об ошибке
        const brandAlert = document.getElementById('brand-form-alert');
        if (brandAlert) {
          brandAlert.style.display = 'none';
        }
        
        // Затем выполняем полную проверку и отправку
        handleBrandFormSubmit();
      });
    }
  
    // Функция обработки отправки формы бренда
    function handleBrandFormSubmit() {
      console.log('Валидация и отправка формы бренда');
      
      // Создаем объект с данными формы, напрямую получая значения полей
      const formData = {
        brandName: document.getElementById('brandName')?.value || '',
        categories: window.brandMultiSelect?.getSelectedValues() || [],
        website: document.getElementById('website')?.value || '',
        contactName: document.getElementById('contactName')?.value || '',
        contactEmail: document.getElementById('contactEmail')?.value || '',
        contactPhone: document.getElementById('contactPhone')?.value || '',
        // Для чекбоксов напрямую получаем свойство checked
        agreement: document.getElementById('brandAgreement')?.checked || false,
        newsletter: document.getElementById('brandNewsletter')?.checked || false,
      };
      
      // Дополнительный лог для отладки чекбоксов
      console.log('Состояние чекбокса соглашения:', document.getElementById('brandAgreement')?.checked);
      console.log('Состояние чекбокса рассылки:', document.getElementById('brandNewsletter')?.checked);

      if (!validateBrandForm(formData)) {
        console.log('Валидация формы бренда не пройдена, отмена отправки');
        return;
      }

      console.log('Валидация успешно пройдена, отправляем форму бренда:', formData);

      // Закрываем модалку бренда и открываем окно подтверждения
      closeBrandModal();
      setTimeout(() => {
        if (window.modalFunctions && window.modalFunctions.openSuccessModal) {
          window.modalFunctions.openSuccessModal();
        } else {
          openSuccessModal();
        }
      }, 300);
    }
  
    // Валидация формы бренда
    function validateBrandForm(formData) {
      let isValid = true;
      const alertElement = document.getElementById('brand-form-alert');
  
      // Сбрасываем предыдущие ошибки
      brandForm.querySelectorAll('.error-field').forEach((el) => {
        el.classList.remove('error-field');
      });
      brandForm.querySelectorAll('.checkbox-group').forEach((el) => {
        el.classList.remove('error');
      });
      document.querySelector('.multi-select-container')?.classList.remove('error');
  
      if (alertElement) alertElement.style.display = 'none';
  
      // Проверка обязательных полей
      const requiredFields = [
        'brandName',
        'website',
        'contactName',
        'contactEmail',
        'contactPhone',
      ];
  
      requiredFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!formData[fieldId] || formData[fieldId].trim() === '') {
          field.classList.add('error-field');
          isValid = false;
        }
      });
  
      // Проверка категорий (мультиселектор)
      if (formData.categories.length === 0) {
        // Добавляем класс ошибки контейнеру мультиселектора
        const multiSelectContainer = document.querySelector('.multi-select-container');
        if (multiSelectContainer) {
          multiSelectContainer.classList.add('error');
        }
        
        // Подсвечиваем текст заголовка красным
        const multiSelectHeader = document.getElementById('brandCategoryHeader');
        if (multiSelectHeader) {
          const span = multiSelectHeader.querySelector('span');
          if (span) {
            span.style.color = '#ff3b30';
          }
        }
        
        isValid = false;
      }
  
      // Валидация email
      if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
        document.getElementById('contactEmail')?.classList.add('error-field');
        isValid = false;
      }
  
      // Валидация телефона
      if (formData.contactPhone && formData.contactPhone.length < 5) {
        document.getElementById('contactPhone')?.classList.add('error-field');
        isValid = false;
      }
  
      // Проверка чекбокса соглашения
      const agreementElement = document.getElementById('brandAgreement');
      if (!agreementElement || !agreementElement.checked) {
        const checkbox = agreementElement?.closest('.checkbox-group');
        if (checkbox) {
          checkbox.classList.add('error');
        }
        isValid = false;
        console.log('Ошибка соглашения, состояние:', agreementElement ? agreementElement.checked : 'элемент не найден');
      } else {
        // Если соглашение принято, убеждаемся что ошибка снята
        const checkbox = agreementElement.closest('.checkbox-group');
        if (checkbox) {
          checkbox.classList.remove('error');
        }
      }
  
      if (!isValid) {
        if (alertElement) {
          alertElement.style.display = 'flex';
        }
        window.scrollTo({ top: brandForm.offsetTop - 20, behavior: 'smooth' });
      }
  
      return isValid;
    }
  
    // Общие функции
    function openSuccessModal() {
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (brandModal.classList.contains('active')) {
          closeBrandModal();
        } else if (successModal.classList.contains('active')) {
          closeSuccessModal();
        }
      }
    });
  
    // Инициализация
    initBrandMultiSelect();
    initBrandPhoneMask();

    // Создаем глобальный объект для доступа к функциям модального окна брендов
    window.brandModals = {
      openBrandModal,
      closeBrandModal
    };

    // Make the function available globally for modalInit.js
    window.openBrandModalFunction = openBrandModal;
    
    // Добавляем обработчики для сброса ошибок при выборе категорий
    const brandCategoryHeader = document.getElementById('brandCategoryHeader');
    const multiSelectContainer = document.querySelector('.multi-select-container');
    
    if (brandCategoryHeader && multiSelectContainer) {
      brandCategoryHeader.addEventListener('click', function() {
        if (multiSelectContainer.classList.contains('error')) {
          multiSelectContainer.classList.remove('error');
          
          // Сбрасываем цвет текста
          const span = brandCategoryHeader.querySelector('span');
          if (span) {
            span.style.removeProperty('color');
          }
        }
      });
      
      // Также добавим обработчик для удаления ошибки при выборе категории
      const options = document.querySelectorAll('#brandCategoryDropdown .multi-select-option');
      options.forEach(option => {
        option.addEventListener('click', function() {
          if (multiSelectContainer.classList.contains('error')) {
            multiSelectContainer.classList.remove('error');
            
            // Сбрасываем цвет текста при выборе категории
            const span = brandCategoryHeader.querySelector('span');
            if (span) {
              span.style.removeProperty('color');
            }
          }
        });
      });
    }
    
    // Добавляем обработчики для чекбокса соглашения
    const agreementCheckbox = document.getElementById('brandAgreement');
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
          const brandAlert = document.getElementById('brand-form-alert');
          if (brandAlert) {
            // Проверяем наличие других ошибок
            const hasOtherErrors = document.querySelector('.error-field') || 
                                document.querySelector('.multi-select-container.error');
            if (!hasOtherErrors) {
              brandAlert.style.display = 'none';
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
            const brandAlert = document.getElementById('brand-form-alert');
            if (brandAlert) {
              // Проверяем наличие других ошибок
              const hasOtherErrors = document.querySelector('.error-field') || 
                                  document.querySelector('.multi-select-container.error');
              if (!hasOtherErrors) {
                brandAlert.style.display = 'none';
              }
            }
          }
        }, 0);
      });
      
      // Добавляем обработчик для метки чекбокса
      const agreementLabel = document.querySelector('label[for="brandAgreement"]');
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
              const brandAlert = document.getElementById('brand-form-alert');
              if (brandAlert) {
                // Проверяем наличие других ошибок
                const hasOtherErrors = document.querySelector('.error-field') || 
                                   document.querySelector('.multi-select-container.error');
                if (!hasOtherErrors) {
                  brandAlert.style.display = 'none';
                }
              }
            }
          }, 10); // Немного большая задержка для надежности
        });
      }
    }
  });
  
  // Общая функция закрытия success modal
  function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  