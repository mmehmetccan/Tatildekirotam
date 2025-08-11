document.addEventListener('DOMContentLoaded', function() {
    // Mobil menü
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

    // Mobil menü dropdownları
    const mobileDropdownToggles = document.querySelectorAll('.has-submenu-mobile > span');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    });

    // Sayfa dışına tıklanınca menüyü kapatma
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !Array.from(menuToggles).some(toggle => toggle.contains(event.target))) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                body.classList.remove('no-scroll');
                menuToggles.forEach(btn => btn.classList.remove('active'));
            }
        }
    });
    // Sayfa yüklendiğinde bu kod çalışır
    document.addEventListener('DOMContentLoaded', function() {
        // Gerekli HTML elemanlarını seç
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const closeButton = document.querySelector('.close-button');

        // Tüm .modal-trigger elemanlarını seç
        const imageTriggers = document.querySelectorAll('.modal-trigger');

        // Her bir görsel tetikleyicisine tıklama olayını dinle
        imageTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                // Tıklanan elemanın data-src özelliğini al
                const fullImageUrl = this.getAttribute('data-src');

                // Modal görselinin src özelliğini ayarla
                modalImage.src = fullImageUrl;

                // Modal pencereyi görünür yap
                imageModal.classList.add('visible');
            });
        });

        // Kapatma butonu veya modalın dışına tıklanınca modalı gizle
        function closeModal() {
            imageModal.classList.remove('visible');
            // Modalın içeriğini temizle (isteğe bağlı)
            modalImage.src = '';
        }

        closeButton.addEventListener('click', closeModal);

        imageModal.addEventListener('click', function(event) {
            // Sadece modalın dışına tıklanırsa kapat
            if (event.target === imageModal) {
                closeModal();
            }
        });

        // ESC tuşuna basıldığında modalı kapat
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && imageModal.classList.contains('visible')) {
                closeModal();
            }
        });
    });
});
