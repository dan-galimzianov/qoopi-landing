document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form');
    const successModal = document.getElementById('successModal')
    const closeSuccessModal = document.getElementById('successModalClose')

    closeSuccessModal.addEventListener('click', function() {
        successModal.classList.remove('active');
    })

    forms.forEach(form => {
        const modal = form.closest('.modal')

        form.addEventListener('submit', function(e) {
            e.preventDefault();
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

                const isPhone = item.getAttribute('data-form-validation-is-phone') === 'true';

                if (isPhone) {
                    const isComplete = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(input.value);
                    if (!isComplete) {
                        errors[name] = 'Неверный формат телефона';
                    }
                }

                const isMultiselect = item.getAttribute('data-form-validation-is-multiselect') === 'true';
                values[name] = isMultiselect ? input.value.split(',').filter(Boolean) : input.value;

                if (isCheckbox) {
                    values[name] = input.checked;
                }

                const errorElemnt = item.querySelector('.form__item-error') || document.createElement('div');

                if (errors[name]) {
                    item.classList.add('form__item_error');
                    
                    if (!isCheckbox) {
                        errorElemnt.classList.add('form__item-error');
                        errorElemnt.textContent = errors[name];
                        item.appendChild(errorElemnt);
                    }
                } else {
                    item.classList.remove('form__item_error');
                    errorElemnt?.remove();
                }
            });

            const isValid = Object.keys(errors).length === 0;

            if (isValid) {
                const serverUrl = form.getAttribute('data-server-url');

                fetch(serverUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(values)
                    })
                    .then(response => response.json())
                    .then(() => {
                        form.reset();
                        successModal.classList.add('active');
                        modal.classList.remove('modal_active');
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                    });
            }
        });
    });
});