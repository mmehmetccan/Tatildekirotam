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

    // Resim Büyütme Modalı Fonksiyonları
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (modal && modalImage && closeButton && modalTriggers.length > 0) {
        // Her modal tetikleyicisine (resim kapsayıcısı) tıklama olayını ekle
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                modal.style.display = 'block'; // Modalı görünür yap
                modalImage.src = this.dataset.src; // Tıklanan resmin yolunu al ve moda'a yükle
            });
        });

        // Kapatma düğmesine tıklayınca modali kapat
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Modalın dışına tıklayınca modali kapat
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Klavyeden Esc tuşuna basınca modali kapat
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape" && modal.style.display === "block") {
                modal.style.display = "none";
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut hamburger menü ve modal kodlarınızın devamı...

    // Arama Overlay Fonksiyonları
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchOverlayInput = document.getElementById('searchOverlayInput');
    const searchOverlayForm = document.querySelector('.search-overlay-form');

    if (openSearchBtn && closeSearchBtn && searchOverlay && searchOverlayInput && searchOverlayForm) {
        openSearchBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Varsayılan link davranışını engelle
            searchOverlay.classList.add('active'); // Overlay'ı göster
            searchOverlayInput.focus(); // Input alanına odaklan
            document.body.style.overflow = 'hidden'; // Sayfa kaydırmayı engelle
        });

        closeSearchBtn.addEventListener('click', function() {
            searchOverlay.classList.remove('active'); // Overlay'ı gizle
            document.body.style.overflow = ''; // Sayfa kaydırmayı geri aç
        });

        // Overlay dışına tıklayınca kapat
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Esc tuşuna basınca kapat
        document.addEventListener('keydown', function(e) {
            if (e.key === "Escape" && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Arama formu gönderildiğinde (smart search yönlendirme)
        searchOverlayForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Formun varsayılan submit davranışını engelle

            const query = searchOverlayInput.value.trim().toLowerCase();

            if (query) {
                // Sunucuya arama sorgusunu göndererek yönlendirme işlemini yapmasını isteyelim
                // Bu, sunucunun tam eşleşmeleri direkt ilgili sayfaya yönlendirmesini sağlar.
                // Eğer tam eşleşme olmazsa, sunucu /search-results sayfasına yönlendirecek.
                window.location.href = `/smart-search?query=${encodeURIComponent(query)}`;
            }
        });
    }
    // ... Diğer DOMContentLoaded event listener kodları
});