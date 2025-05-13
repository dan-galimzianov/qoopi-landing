// Автоматическое изменение высоты textarea
function initAutoResizeTextarea() {
    const textarea = document.getElementById('questionMessage');
    if (!textarea) return;
  
    function adjustHeight() {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  
    textarea.addEventListener('input', adjustHeight);
    // Инициализация при загрузке
    setTimeout(adjustHeight, 0);
  }
  
  // Вызовите эту функцию в DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    console.log('questionModal.js загружен');
    initAutoResizeTextarea();
    
    // Элементы модального окна
    const questionModal = document.getElementById('questionModal');
    const openQuestionModalBtn = document.getElementById('openQuestionModalBtn');
    
    console.log('questionModal:', questionModal);
    console.log('openQuestionModalBtn:', openQuestionModalBtn);
    
    if (!questionModal || !openQuestionModalBtn) {
      console.error('Элементы модального окна вопросов не найдены');
      return;
    }
    
    const closeQuestionModalBtn = document.getElementById('closeQuestionModalBtn');
    const questionForm = document.getElementById('question-form');
    const submitQuestionBtn = document.getElementById('submitQuestionBtn');
    const questionModalContainer = questionModal.querySelector('.modal-container');
    const successModal = document.getElementById('successModal');
  
    // Анимационные параметры
    const ANIMATION_DURATION = 300;
    let isAnimating = false;
    
    // Сохраняем позицию скролла
    let scrollPosition = 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
    // Инициализация при загрузке
    initPhoneMask();
    setupEventListeners();
  
    // Маска для телефона
    function initPhoneMask() {
      const phoneInput = document.getElementById('questionPhone');
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
  
    // Сбросить состояние формы
    function resetFormState() {
      if (questionForm) {
        questionForm.reset();
        // Автоматически отмечаем чекбокс рассылки
        document.getElementById('questionAgreement').checked = false;
        document.getElementById('questionNewsletter').checked = true;
        resetErrorStates();
      }
    }
  
    // Инициализация лайв-валидации
    function initLiveValidation() {
      // Найдем все текстовые поля ввода
      const inputFields = questionForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
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
      const agreementCheckbox = document.getElementById('questionAgreement');
      agreementCheckbox.addEventListener('change', function() {
        const checkboxGroup = this.closest('.checkbox-group');
        if (this.checked) {
          checkboxGroup.classList.remove('error');
        }
        
        // Проверяем все поля и решаем, показывать ли сообщение об ошибке
        updateErrorMessageVisibility();
      });
    }
    
    // Функция обновления видимости сообщения об ошибке
    function updateErrorMessageVisibility() {
      const errorAlert = document.getElementById('question-form-alert');
      const hasErrors = questionForm.querySelector('.error-field, .checkbox-group.error');
      
      if (!hasErrors) {
        errorAlert.style.display = 'none';
      }
    }
  
    // Открытие модального окна
    function openQuestionModal() {
      console.log('Открытие модального окна вопросов');
      if (isAnimating) return;
      isAnimating = true;
  
      // Сохраняем текущую позицию скролла
      scrollPosition = window.pageYOffset;
      
      // Показываем модальное окно
      questionModal.style.display = 'flex';
      
      // Если меню открыто, закрываем его
      const menuOverlay = document.getElementById('menuOverlay');
      if (menuOverlay && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
      }
      
      // Добавляем класс для блокировки прокрутки и компенсируем сдвиг
      document.body.classList.add('modal-open');
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      questionModal.style.opacity = '0';
      questionModalContainer.style.transform = 'translateY(20px)';
      questionModalContainer.style.opacity = '0';
  
      requestAnimationFrame(() => {
        questionModal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
        questionModalContainer.style.transition = `all ${ANIMATION_DURATION}ms ease`;
  
        questionModal.style.opacity = '1';
        questionModalContainer.style.transform = 'translateY(0)';
        questionModalContainer.style.opacity = '1';
  
        setTimeout(() => {
          isAnimating = false;
          questionModal.classList.add('active');
        }, 20);
      });
  
      resetFormState();
      document.body.style.overflow = 'hidden';
    }
  
    // Закрытие модального окна
    function closeQuestionModal() {
      if (isAnimating) return;
      isAnimating = true;
  
      questionModal.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
      questionModalContainer.style.transition = `all ${ANIMATION_DURATION}ms ease`;
  
      questionModal.style.opacity = '0';
      questionModalContainer.style.transform = 'translateY(20px)';
      questionModalContainer.style.opacity = '0';
  
      setTimeout(() => {
        questionModal.style.display = 'none';
        document.body.style.overflow = '';
        questionModal.classList.remove('active');
        isAnimating = false;
        
        // Восстанавливаем прокрутку только если нет других открытых модальных окон
        if (!successModal || !successModal.classList.contains('active')) {
          document.body.classList.remove('modal-open');
          document.body.style.top = '';
          document.body.style.paddingRight = '';
          window.scrollTo(0, scrollPosition);
        }
      }, ANIMATION_DURATION);
    }
  
    // Функция открытия модального окна успеха
    function openSuccessModal() {
      // Закрываем модальное окно вопросов
      questionModal.classList.remove('active');
      setTimeout(function() {
        questionModal.style.display = 'none';
        
        // Показываем модальное окно успеха
        if (successModal) {
          successModal.style.display = 'flex';
          
          // Анимируем появление
          setTimeout(function() {
            successModal.classList.add('active');
          }, 10);
        }
      }, 300);
    }
  
    // Обработка отправки формы
    function handleSubmit(e) {
      e.preventDefault();
  
      const formData = {
        name: document.getElementById('questionName').value,
        email: document.getElementById('questionEmail').value,
        phone: document.getElementById('questionPhone').value,
        message: document.getElementById('questionMessage').value,
        agreement: document.getElementById('questionAgreement').checked,
        newsletter: document.getElementById('questionNewsletter').checked,
      };
  
      if (validateForm(formData)) {
        console.log('Question form data:', formData);
        closeQuestionModal();
        setTimeout(() => {
          // Здесь можно открыть окно успешной отправки
          openSuccessModal();
        }, ANIMATION_DURATION + 50);
      }
    }
  
    // Валидация формы
    function validateForm(formData) {
      let isValid = true;
      resetErrorStates();
  
      const requiredFields = ['name', 'email', 'phone', 'message'];
      requiredFields.forEach((field) => {
        const element = document.getElementById(
          `question${field.charAt(0).toUpperCase() + field.slice(1)}`
        );
        if (!formData[field] || formData[field].trim() === '') {
          markFieldAsError(element);
          isValid = false;
        }
      });
  
      // Валидация email
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        markFieldAsError(document.getElementById('questionEmail'));
        isValid = false;
      }
  
      // Валидация телефона
      if (formData.phone && formData.phone.length < 5) {
        markFieldAsError(document.getElementById('questionPhone'));
        isValid = false;
      }
  
      // Проверка соглашения
      const agreementCheckbox = document.getElementById('questionAgreement');
      const checkboxGroup = agreementCheckbox.closest('.checkbox-group');
      
      if (!formData.agreement) {
        checkboxGroup.classList.add('error');
        isValid = false;
      } else {
        // Если чекбокс отмечен, убедимся что класс ошибки удален
        checkboxGroup.classList.remove('error');
      }
  
      if (!isValid) {
        document.getElementById('question-form-alert').style.display = 'flex';
        scrollToFirstError();
      } else {
        // Если форма валидна, убираем сообщение об ошибке
        document.getElementById('question-form-alert').style.display = 'none';
      }
  
      return isValid;
    }
  
    // Пометить поле как ошибочное
    function markFieldAsError(field) {
      field.classList.add('error-field');
    }
  
    // Сбросить состояния ошибок
    function resetErrorStates() {
      document
        .querySelectorAll('#question-form .error-field')
        .forEach((field) => {
          field.classList.remove('error-field');
        });
  
      document
        .querySelectorAll('#question-form .checkbox-group.error')
        .forEach((group) => {
          group.classList.remove('error');
        });
  
      document.getElementById('question-form-alert').style.display = 'none';
    }
  
    // Прокрутить к первой ошибке
    function scrollToFirstError() {
      const firstError = document.querySelector(
        '#question-form .error-field, #question-form .checkbox-group.error'
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  
    // Настройка обработчиков событий
    function setupEventListeners() {
      console.log('Настройка обработчиков событий');
      // Обработчик для кнопки открытия модального окна
      if (openQuestionModalBtn) {
        console.log('Добавление обработчика события click для кнопки', openQuestionModalBtn);
        openQuestionModalBtn.addEventListener('click', function(e) {
          console.log('Клик по кнопке открытия модального окна вопросов');
          e.preventDefault();
          e.stopPropagation(); // Предотвращаем всплытие события
          openQuestionModal();
        });
      }
  
      if (closeQuestionModalBtn) {
        closeQuestionModalBtn.addEventListener('click', function(e) {
          e.preventDefault();
          closeQuestionModal();
        });
      }
  
      if (submitQuestionBtn) {
        submitQuestionBtn.addEventListener('click', handleSubmit);
      }
      
      // Инициализируем лайв-валидацию
      initLiveValidation();
      
      // Обработчики изменения полей для сброса ошибок "на лету"
      const inputs = questionModal.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', function() {
          this.classList.remove('error-field');
          
          // Если это чекбокс соглашения, убираем ошибку с родительского элемента
          if (this.id === 'questionAgreement' && this.checked) {
            this.closest('.checkbox-group').classList.remove('error');
            // Скрываем общее сообщение об ошибке, если все поля заполнены
            checkAllFieldsAndHideError();
          }
        });
      });
      
      // Специальный обработчик для чекбокса
      const agreementCheckbox = document.getElementById('questionAgreement');
      if (agreementCheckbox) {
        // Обработчик события change
        agreementCheckbox.addEventListener('change', function() {
          if (this.checked) {
            console.log('Чекбокс отмечен, убираем ошибку');
            this.closest('.checkbox-group').classList.remove('error');
            // Проверяем, можно ли скрыть общее сообщение об ошибке
            checkAllFieldsAndHideError();
          }
        });
        
        // Дополнительный обработчик события click
        agreementCheckbox.addEventListener('click', function() {
          setTimeout(() => {
            if (this.checked) {
              console.log('Чекбокс кликнут, убираем ошибку');
              this.closest('.checkbox-group').classList.remove('error');
              // Проверяем, можно ли скрыть общее сообщение об ошибке
              checkAllFieldsAndHideError();
            }
          }, 0);
        });
        
        // Обработчик для лейбла чекбокса
        const agreementLabel = agreementCheckbox.nextElementSibling;
        if (agreementLabel) {
          agreementLabel.addEventListener('click', function() {
            setTimeout(() => {
              if (agreementCheckbox.checked) {
                console.log('Клик по лейблу, убираем ошибку');
                agreementCheckbox.closest('.checkbox-group').classList.remove('error');
                // Проверяем, можно ли скрыть общее сообщение об ошибке
                checkAllFieldsAndHideError();
              }
            }, 0);
          });
        }
      }
      
      // Функция для проверки всех полей и скрытия сообщения об ошибке
      function checkAllFieldsAndHideError() {
        const requiredFields = ['name', 'email', 'phone', 'message'];
        let allFilled = true;
        
        // Проверяем заполненность всех полей
        requiredFields.forEach((field) => {
          const element = document.getElementById(
            `question${field.charAt(0).toUpperCase() + field.slice(1)}`
          );
          if (!element.value.trim()) {
            allFilled = false;
          }
        });
        
        // Проверяем чекбокс
        if (!document.getElementById('questionAgreement').checked) {
          allFilled = false;
        }
        
        // Если все поля заполнены, скрываем сообщение об ошибке
        if (allFilled) {
          document.getElementById('question-form-alert').style.display = 'none';
        }
      }
  
      questionModal.addEventListener('click', function (e) {
        if (e.target === questionModal) closeQuestionModal();
      });
  
      questionModalContainer.addEventListener('click', function (e) {
        e.stopPropagation();
      });
  
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && questionModal.classList.contains('active')) {
          closeQuestionModal();
        }
      });
    }
  
    // Добавляем функции в глобальный объект
    window.questionModalFunctions = {
      openQuestionModal,
      closeQuestionModal
    };
  });
  