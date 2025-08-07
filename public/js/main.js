document.addEventListener('DOMContentLoaded', function () {
    initHamburgerMenu();
    initSubmenus();
    initSearchOverlay();
    initImageModal();
});

function initHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.main-nav .nav-links');
    const body = document.body;
    const html = document.documentElement;

    if (!hamburgerMenu || !navLinks) return;

    hamburgerMenu.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');

        if (navLinks.classList.contains('active')) {
            body.classList.add('menu-active');
            html.classList.add('menu-active');
        } else {
            body.classList.remove('menu-active');
            html.classList.remove('menu-active');
        }
    });
}

function initSubmenus() {
    const hasSubmenus = document.querySelectorAll('.main-nav .has-submenu > a');
    if (hasSubmenus.length === 0) return;

    hasSubmenus.forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const parentLi = this.parentElement;
                parentLi.classList.toggle('active');
            }
        });
    });
}

function initSearchOverlay() {
    const searchIcon = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.querySelector('.close-search-btn');
    const body = document.body;

    if (!searchIcon || !searchOverlay || !closeSearchBtn) return;

    searchIcon.addEventListener('click', function (e) {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        body.style.overflow = 'hidden';
    });

    closeSearchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        searchOverlay.style.display = 'none';
        body.style.overflow = '';
    });

    searchOverlay.addEventListener('click', function (e) {
        if (e.target === this) {
            searchOverlay.style.display = 'none';
            body.style.overflow = '';
        }
    });
}

function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (!modal || !modalImage || !closeButton || modalTriggers.length === 0) return;

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            modal.style.display = 'block';
            modalImage.src = this.dataset.src;
        });
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
