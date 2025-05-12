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
    initAutoResizeTextarea();
    // Элементы модального окна
    const questionModal = document.getElementById('questionModal');
    const openQuestionModalBtn = document.getElementById('openQuestionModalBtn'); // Добавьте эту кнопку в HTML
    const closeQuestionModalBtn = document.getElementById(
      'closeQuestionModalBtn'
    );
    const questionForm = document.getElementById('question-form');
    const submitQuestionBtn = document.getElementById('submitQuestionBtn');
    const questionModalContainer =
      questionModal.querySelector('.modal-container');
  
    // Анимационные параметры
    const ANIMATION_DURATION = 300;
    let isAnimating = false;
  
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
    // Открытие модального окна
    function openQuestionModal() {
      if (isAnimating) return;
      isAnimating = true;
  
      questionModal.style.display = 'flex';
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
      }, ANIMATION_DURATION);
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
          document.getElementById('successModal').classList.add('active');
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
      if (!formData.agreement) {
        document
          .getElementById('questionAgreement')
          .closest('.checkbox-group')
          .classList.add('error');
        isValid = false;
      }
  
      if (!isValid) {
        document.getElementById('question-form-alert').style.display = 'flex';
        scrollToFirstError();
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
      // Добавьте кнопку для открытия этого модального окна в ваш HTML
      if (openQuestionModalBtn) {
        openQuestionModalBtn.addEventListener('click', openQuestionModal);
      }
  
      if (closeQuestionModalBtn) {
        closeQuestionModalBtn.addEventListener('click', closeQuestionModal);
      }
  
      if (submitQuestionBtn) {
        submitQuestionBtn.addEventListener('click', handleSubmit);
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
  });
  