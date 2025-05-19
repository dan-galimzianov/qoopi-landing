// DOM elements
const burgerButton = document.querySelector('.header__menu-burger');
const closeButton = document.getElementById('closeBtn');
const menuOverlay = document.getElementById('menuOverlay');

// Open menu when clicking burger button
burgerButton.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent document click from immediately closing
    document.body.classList.add('menu-open');
});

// Close menu when clicking close button
closeButton.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent event from bubbling
    document.body.classList.remove('menu-open');
});

// Close menu when clicking outside the menu
document.addEventListener('click', function(event) {
    // Only process if menu is open
    if (document.body.classList.contains('menu-open')) {
        // If clicked element is not inside menu and not the burger button
        if (!menuOverlay.contains(event.target) && !burgerButton.contains(event.target)) {
            document.body.classList.remove('menu-open');
        }
    }
});

// Prevent clicks inside the menu from bubbling up
document.getElementById('menuOverlay').addEventListener('click', function(event) {
    event.stopPropagation();
});