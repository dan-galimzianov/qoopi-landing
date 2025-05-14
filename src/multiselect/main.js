document.addEventListener('DOMContentLoaded', function() {
            // Находим все мультиселекты на странице
            const multiselects = document.querySelectorAll('.multiselect');
            
            // Инициализируем каждый мультиселект
            multiselects.forEach(function(multiselect) {
                initMultiselect(multiselect);
            });
            
            // Функция инициализации мультиселекта
            function initMultiselect(multiselect) {
                const header = multiselect.querySelector('.multiselect__header');
                const title = multiselect.querySelector('.multiselect__title');
                const arrow = multiselect.querySelector('.multiselect__arrow');
                const dropdown = multiselect.querySelector('.multiselect__dropdown');
                const options = multiselect.querySelectorAll('.multiselect__option');
                const name = multiselect.dataset.name;
                
                // Добавляем скрытые инпуты для выбранных опций
                updateHiddenInputs(multiselect);
                
                // Обработчик клика по заголовку
                header.addEventListener('click', function(event) {
                    // Закрываем все другие мультиселекты
                    multiselects.forEach(function(ms) {
                        if (ms !== multiselect) {
                            ms.querySelector('.multiselect__arrow').classList.remove('multiselect__arrow--up');
                            ms.querySelector('.multiselect__dropdown').classList.remove('multiselect__dropdown--visible');
                        }
                    });
                    
                    // Переключаем текущий мультиселект
                    arrow.classList.toggle('multiselect__arrow--up');
                    dropdown.classList.toggle('multiselect__dropdown--visible');
                    
                    event.stopPropagation();
                });
                
                // Обработчик выбора опций
                options.forEach(function(option) {
                    option.addEventListener('click', function(event) {
                        option.classList.toggle('multiselect__option--selected');
                        
                        // Обновляем aria-selected атрибут
                        const isSelected = option.classList.contains('multiselect__option--selected');
                        option.setAttribute('aria-selected', isSelected);
                        
                        // Обновляем заголовок и скрытые инпуты
                        updateTitle(multiselect);
                        updateHiddenInputs(multiselect);
                        
                        event.stopPropagation();
                    });
                });
                
                // Обновляем заголовок при инициализации
                updateTitle(multiselect);
            }
            
            // Функция обновления заголовка
            function updateTitle(multiselect) {
                const title = multiselect.querySelector('.multiselect__title');
                const selectedOptions = multiselect.querySelectorAll('.multiselect__option--selected');
                
                if (selectedOptions.length === 0) {
                    title.classList.add('multiselect__title--empty');
                    title.textContent = 'Выберите категории';
                } else {
                    title.classList.remove('multiselect__title--empty');
                    const selectedTexts = Array.from(selectedOptions).map(opt => 
                        opt.querySelector('.multiselect__text').textContent
                    );
                    
                    if (selectedTexts.length <= 2) {
                        title.textContent = selectedTexts.join(', ');
                    } else {
                        title.textContent = `Выбрано ${selectedTexts.length} категории`;
                    }
                }
            }
            
            // Функция обновления скрытых инпутов
            function updateHiddenInputs(multiselect) {
                                // Удаляем существующие скрытые инпуты
                const hiddenInput = multiselect.querySelector('.multiselect__input');
                hiddenInput.value = '';
                
                // Добавляем новые инпуты для выбранных опций
                const selectedOptions = multiselect.querySelectorAll('.multiselect__option--selected');
                selectedOptions.forEach(option => {
                    const value = option.dataset.value;
                    hiddenInput.value += `${value},`;
                });
            }
            
            // Закрытие дропдауна при клике вне элемента
            document.addEventListener('click', function(event) {
                multiselects.forEach(function(multiselect) {
                    const header = multiselect.querySelector('.multiselect__header');
                    const dropdown = multiselect.querySelector('.multiselect__dropdown');
                    const arrow = multiselect.querySelector('.multiselect__arrow');
                    
                    if (!multiselect.contains(event.target)) {
                        arrow.classList.remove('multiselect__arrow--up');
                        dropdown.classList.remove('multiselect__dropdown--visible');
                    }
                });
            });
        });