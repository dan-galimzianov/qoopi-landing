// Отладка работы селектора
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== ОТЛАДКА СЕЛЕКТОРА ===');
  
  // Элементы селектора
  const selectContainer = document.querySelector('.modal-select-container');
  const selectHeader = document.querySelector('.modal-select-header');
  const dropdown = document.querySelector('.modal-select-dropdown');
  const options = document.querySelectorAll('.modal-select-option');
  
  // Проверка существования элементов
  console.log('Контейнер селектора:', selectContainer ? 'найден' : 'НЕ НАЙДЕН');
  console.log('Заголовок селектора:', selectHeader ? 'найден' : 'НЕ НАЙДЕН');
  console.log('Выпадающий список:', dropdown ? 'найден' : 'НЕ НАЙДЕН');
  console.log('Опции:', options.length ? `найдено ${options.length}` : 'НЕ НАЙДЕНЫ');
  
  // Проверка стилей
  if (selectHeader) {
    const styles = window.getComputedStyle(selectHeader);
    console.log('Стили заголовка:');
    console.log('- background-color:', styles.backgroundColor);
    console.log('- border-bottom:', styles.borderBottom);
    console.log('- cursor:', styles.cursor);
  }
  
  if (dropdown) {
    const styles = window.getComputedStyle(dropdown);
    console.log('Стили выпадающего списка:');
    console.log('- position:', styles.position);
    console.log('- z-index:', styles.zIndex);
    console.log('- max-height:', styles.maxHeight);
    console.log('- opacity:', styles.opacity);
    console.log('- pointer-events:', styles.pointerEvents);
  }
  
  // Проверка и исправление проблемы
  if (selectHeader && dropdown) {
    console.log('Создаю новый обработчик для открытия/закрытия селектора');
    
    // Принудительно открыть выпадающий список через 2 секунды для проверки
    setTimeout(() => {
      console.log('Принудительно открываю выпадающий список');
      dropdown.style.maxHeight = '250px';
      dropdown.style.opacity = '1';
      dropdown.style.pointerEvents = 'auto';
      dropdown.classList.add('open');
      
      // Проверяем, применились ли стили
      console.log('Проверка стилей после открытия:');
      const afterStyles = window.getComputedStyle(dropdown);
      console.log('- max-height:', afterStyles.maxHeight);
      console.log('- opacity:', afterStyles.opacity);
      console.log('- pointer-events:', afterStyles.pointerEvents);
      console.log('- display:', afterStyles.display);
      console.log('- visibility:', afterStyles.visibility);
      
      // Добавляем CSS напрямую, если стили не применяются
      if (afterStyles.maxHeight === '0px') {
        console.log('Стили не применились, добавляю inline стили');
        dropdown.setAttribute('style', 'max-height: 250px !important; opacity: 1 !important; pointer-events: auto !important; position: absolute; z-index: 10000; width: 100%;');
      }
    }, 2000);
    
    // Добавляем новый обработчик открытия/закрытия
    selectHeader.addEventListener('click', function(e) {
      console.log('Клик на заголовок селектора');
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = dropdown.classList.contains('open');
      console.log('Текущее состояние:', isOpen ? 'открыт' : 'закрыт');
      
      if (!isOpen) {
        // Открываем
        dropdown.classList.add('open');
        console.log('Добавлен класс open');
        
        // Проверяем inline-стили
        dropdown.style.maxHeight = '250px';
        dropdown.style.opacity = '1';
        dropdown.style.pointerEvents = 'auto';
        console.log('Inline-стили добавлены');
        
        // Если есть проблема со стилями, добавляем предохранитель
        setTimeout(() => {
          if (window.getComputedStyle(dropdown).maxHeight === '0px') {
            console.log('Не сработало через CSS, применяю атрибут style');
            dropdown.setAttribute('style', 'max-height: 250px !important; opacity: 1 !important; display: block !important; pointer-events: auto !important; position: absolute; z-index: 10000; width: 100%;');
          }
        }, 50);
      } else {
        // Закрываем
        dropdown.classList.remove('open');
        dropdown.style.maxHeight = '';
        dropdown.style.opacity = '';
        dropdown.style.pointerEvents = '';
        console.log('Селектор закрыт');
      }
    });
    
    // Добавляем обработчики для каждой опции
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Сбрасываем выбор со всех опций
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Выбираем текущую опцию
        option.classList.add('selected');
        
        // Устанавливаем значение в заголовок
        const span = selectHeader.querySelector('span');
        if (span) {
          span.textContent = option.querySelector('span').textContent;
          selectHeader.classList.add('has-selection');
        }
        
        // Обновляем значение скрытого поля
        const hiddenInput = selectContainer.querySelector('input[type="hidden"]');
        if (hiddenInput) {
          hiddenInput.value = option.getAttribute('data-value');
          
          // Создаем и диспатчим событие change
          const event = new Event('change', { bubbles: true });
          hiddenInput.dispatchEvent(event);
        }
        
        // Закрываем выпадающий список
        dropdown.classList.remove('open');
        dropdown.style.maxHeight = '';
        dropdown.style.opacity = '';
        dropdown.style.pointerEvents = '';
        
        console.log('Выбрана опция:', option.querySelector('span').textContent);
      });
    });
  }
}); 