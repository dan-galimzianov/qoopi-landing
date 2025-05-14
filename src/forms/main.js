document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form');

    forms.forEach(form => {

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let message = '';
            const formItems = form.querySelectorAll('.form__item');
            const errors = {};
            const values = {};

            Array.from(formItems).forEach(item => {
                const input = item.querySelector('.form__item-input');
                const required = item.getAttribute('data-form-validation-required') === 'true';
                const name = input.getAttribute('name');
                const isCheckbox = input.type === 'checkbox';
                if (required) {
                    if (input.value.trim() === '') {
                        errors[name] = 'Поле обязательно для заполнения';
                    }
                }

                if (required && isCheckbox) {
                    if (!input.checked) {
                        errors[name] = 'Поле обязательно для заполнения';
                    }
                }

                const isEmail = item.getAttribute('data-form-validation-is-email') === 'true';

                if (isEmail) {
                    if (!input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                        errors[name] = 'Неверный формат электронной почты';
                    }
                }

                const isMultiselect = item.getAttribute('data-form-validation-is-multiselect') === 'true';
                values[name] = isMultiselect ? input.value.split(',').filter(Boolean) : input.value;

                if (isCheckbox) {
                    values[name] = input.checked;
                }
            });

            const isInvalid = Object.keys(errors).length > 0;
            
            if (isInvalid) {
                message = 'Пожалуйста, заполните все обязательные поля';
            }

            const serverUrl = form.getAttribute('data-server-url');

            fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
        });
    });
});