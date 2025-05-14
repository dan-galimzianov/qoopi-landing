document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
       const modalId = modal.getAttribute('data-modal-id');

       const buttons = document.querySelectorAll(`button[data-modal-id="${modalId}"]`);

       buttons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.add('modal_active');
        })
       })

       const overlay = modal.querySelector('.modal__overlay');
       const closeButton = modal.querySelector('.modal__close-button');

       overlay?.addEventListener('click', () => {
            modal.classList.remove('modal_active');
       })

       closeButton?.addEventListener('click', () => {
        modal.classList.remove('modal_active');
       })
    })
})