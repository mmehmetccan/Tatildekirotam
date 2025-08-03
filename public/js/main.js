document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menü Fonksiyonu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.main-nav .nav-links');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
    }

    // Arama Çubuğu Fonksiyonu
    const searchIcon = document.querySelector('.search-icon-container');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.querySelector('.close-search-btn');

    if (searchIcon && searchOverlay && closeSearchBtn) {
        searchIcon.addEventListener('click', function() {
            searchOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
        });

        closeSearchBtn.addEventListener('click', function() {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Sayfa kaydırmayı geri aç
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
    // Sadece mobil cihazlarda (768px altı) çalışacak şekilde
    const hasSubmenus = document.querySelectorAll('.main-nav .has-submenu > a');

    hasSubmenus.forEach(link => {
        link.addEventListener('click', (e) => {
            // Hamburger menü aktifse (mobil görünümde)
            if (navLinks.classList.contains('active')) {
                e.preventDefault(); // Varsayılan link davranışını engelle
                const parentLi = link.parentElement;

                // Eğer tıklanan zaten aktifse, kapat
                if (parentLi.classList.contains('active')) {
                    parentLi.classList.remove('active');
                } else {
                    // Diğer aktif alt menüleri kapat
                    document.querySelectorAll('.main-nav .has-submenu.active').forEach(item => {
                        item.classList.remove('active');
                    });
                    // Tıklanan alt menüyü aç
                    parentLi.classList.add('active');
                }
            }
        });
    });
});