export function initMask() {
  const phoneInputs = document.querySelectorAll('.form__item-input[data-mask="phone"]');

    function initPhoneMask(phoneInput) {
      if (!phoneInput) {
        console.warn('Элемент phone не найден');
        return;
      }
  
      // Устанавливаем начальное значение
      if (!phoneInput.value) {
        phoneInput.value = '';
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
      });
    }

    phoneInputs.forEach(initPhoneMask);
}