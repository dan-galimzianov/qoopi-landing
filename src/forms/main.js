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

                if (required) {
                    if (input.value.trim() === '') {
                        errors[name] = 'Поле обязательно для заполнения';
                    }
                }

                if (required && input.type === 'checkbox') {
                    if (!input.checked) {
                        errors[name] = 'Поле обязательно для заполнения';
                    }
                }

                const isUrl = item.getAttribute('data-form-validation-is-url') === 'true';
                const isEmail = item.getAttribute('data-form-validation-is-email') === 'true';

                if (isUrl) {
                    if (!input.value.match(/^https?:\/\/[^\s]+$/)) {
                        errors[name] = 'Неверный формат ссылки';
                    }
                }

                if (isEmail) {
                    if (!input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                        errors[name] = 'Неверный формат электронной почты';
                    }
                }

                const isMultiselect = item.getAttribute('data-form-validation-is-multiselect') === 'true';
                values[name] = isMultiselect ? input.value.split(',') : input.value;
            });

            if (Object.keys(errors).length > 0) {
                message = 'Пожалуйста, заполните все обязательные поля';
            }

            if (message) {
                alert(message);
            }

            const serverUrl = form.getAttribute('data-server-url');

            fetch(serverUrl, {
                method: 'POST',
                body: JSON.stringify(values)
            })
        });
    });
});