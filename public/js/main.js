document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.main-nav .nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }

     // Arama Çubuğu Fonksiyonu
    const searchIcon = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.querySelector('.close-search-btn');

    if (searchIcon && searchOverlay && closeSearchBtn) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        closeSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Overlay'e tıklanınca kapat
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                searchOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Resim Büyütme Modalı Fonksiyonları
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (modal && modalImage && closeButton && modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                modal.style.display = 'block';
                modalImage.src = this.dataset.src;
            });
        });

        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Mobil Menü: Alt Menü Açma/Kapama Fonksiyonu
    const hasSubmenus = document.querySelectorAll('.main-nav .has-submenu > a');

    hasSubmenus.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                e.preventDefault();
                const parentLi = link.parentElement;

                if (parentLi.classList.contains('active')) {
                    parentLi.classList.remove('active');
                } else {
                    document.querySelectorAll('.main-nav .has-submenu.active').forEach(item => {
                        item.classList.remove('active');
                    });
                    parentLi.classList.add('active');
                }
            }
        });
    });
});