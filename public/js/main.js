document.addEventListener('DOMContentLoaded', function() {
    const menuToggles = document.querySelectorAll('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            menuToggles.forEach(btn => btn.classList.toggle('active'));
        });
    });

    const mobileDropdownToggles = document.querySelectorAll('.has-submenu-mobile > span');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !Array.from(menuToggles).some(toggle => toggle.contains(event.target))) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                body.classList.remove('no-scroll');
                menuToggles.forEach(btn => btn.classList.remove('active'));
            }
        }
    });
    document.addEventListener('DOMContentLoaded', function() {
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const closeButton = document.querySelector('.close-button');

        const imageTriggers = document.querySelectorAll('.modal-trigger');

        imageTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const fullImageUrl = this.getAttribute('data-src');

                modalImage.src = fullImageUrl;

                imageModal.classList.add('visible');
            });
        });

        function closeModal() {
            imageModal.classList.remove('visible');
            modalImage.src = '';
        }

        closeButton.addEventListener('click', closeModal);

        imageModal.addEventListener('click', function(event) {
            if (event.target === imageModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && imageModal.classList.contains('visible')) {
                closeModal();
            }
        });
    });
});
