const express = require('express');
const path = require('path');
const fs = require('fs'); // fs modülü dosyanın başında tanımlı olmalı

const app = express();
const PORT = process.env.PORT || 5000; // Kullanıcının belirttiği PORT 5000 olarak ayarlandı

// EJS şablon motorunu ayarla
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik dosyaları (CSS, JS, resimler vb.) public klasöründen servis et
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // POST istekleri için body-parser

// Verileri uygulama başlangıcında senkron olarak yükle
// Bu veriler tüm rotalarda kullanılabilir olacak
const countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'countries.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf8'));

// Ana Sayfa Rotası
app.get('/', (req, res) => {
    // Son eklenen 3 şehri al (JSON dosyasında altta olanlar "son eklenenler" kabul edilir)
    // En son ekleneni en başa almak için reverse() ekliyoruz.
    const recentlyAddedCities = cities.slice(-3).reverse();

    res.render('index', {
        pageTitle: 'Gezgin Rotam - Anasayfa', // Başlık Eklendi
        countries: countries, // Ülkeler verisini gönder
        allCities: cities,    // Tüm şehirler verisini gönder (header'daki alt menü için)
        recentlyAddedCities: recentlyAddedCities // Son eklenen şehirler verisini gönder
    });
    res.render('index', {
        // ...
        pageUrl: req.originalUrl // Anasayfa için '/'
    });
});

// Ülke Detay Sayfası Rotası
app.get('/country/:id', (req, res) => {
    const countryId = req.params.id;
    const country = countries.find(c => c.id === countryId);

    if (country) {
        const countryCities = cities.filter(city => city.countryId === countryId);
        res.render('country', {
            pageTitle: country.name + ' Şehirleri', // Başlık Eklendi
            country: country,
            cities: countryCities,
            countries: countries, // Header için
            allCities: cities // Header için
        });
    } else {
        res.status(404).send('Ülke bulunamadı.');
    }
    res.render('index', {
        // ...
        pageUrl: req.originalUrl // Anasayfa için '/'
    });
});

// Şehir Detay Sayfası Rotası
app.get('/city/:id', (req, res) => {
    const cityId = req.params.id;
    const city = cities.find(c => c.id === cityId);

    if (city) {
        res.render('city', {
            pageTitle: city.name + ' Keşif Rehberi', // Başlık Eklendi
            city: city,
            countries: countries, // Header için
            allCities: cities // Header için
        });
    } else {
        res.status(404).send('Şehir bulunamadı.');
    }
    res.render('index', {
        // ...
        pageUrl: req.originalUrl // Anasayfa için '/'
    });
});
app.get('/search', (req, res) => {
    const searchQuery = req.query.query; // URL'den gelen 'query' parametresini al
    console.log(`Aranan kelime: ${searchQuery}`);

    // Simülasyon: Gerçek arama sonuçlarını buraya yazın
    // Normalde bu kısımda veritabanı sorgusu yapılır
    const searchResults = [
        {
            title: `${searchQuery} ile ilgili sonuç 1`,
            description: `Bu ilk arama sonucu, ${searchQuery} kelimesini içerir.`,
            imageUrl: 'https://via.placeholder.com/150',
            link: '/city/example1'
        },
        {
            title: `${searchQuery} ile ilgili sonuç 2`,
            description: `Bu ikinci arama sonucu, ${searchQuery} kelimesini içerir.`,
            imageUrl: 'https://via.placeholder.com/150',
            link: '/city/example2'
        }
    ];

    // search_results.ejs şablonunu render et ve sonuçları gönder
    res.render('search_results', { query: searchQuery, searchResults: searchResults });
});

// Akıllı Arama Rotası (Tam eşleşmelerde yönlendirme, yoksa sonuç sayfasına)
// Akıllı Arama Rotası (Tam eşleşmelerde yönlendirme, yoksa sonuç sayfasına)
app.get('/smart-search', (req, res) => {
    // Arama sorgusunu al ve Türkçe'ye uygun olarak tamamen küçük harfe çevir, baştaki/sondaki boşlukları temizle
    const searchQuery = req.query.query ? req.query.query.toLocaleLowerCase('tr-TR').trim() : '';

    if (!searchQuery) {
        return res.redirect('/');
    }

    // 1. Tam Şehir Adı Eşleşmesi Kontrolü
    const exactCityMatch = cities.find(city => city.name.toLocaleLowerCase('tr-TR') === searchQuery);
    if (exactCityMatch) {
        // Eğer eşleşen bir şehir bulunursa, o şehrin sayfasına yönlendir
        return res.redirect(`/city/${exactCityMatch.id}`);
    }

    // 2. Tam Ülke Adı Eşleşmesi Kontrolü
    const exactCountryMatch = countries.find(country => country.name.toLocaleLowerCase('tr-TR') === searchQuery);
    if (exactCountryMatch) {
        // Eğer eşleşen bir ülke bulunursa, o ülkenin sayfasına yönlendir
        return res.redirect(`/country/${exactCountryMatch.id}`);
    }

    // 3. Eğer tam eşleşme bulunamazsa, arama sonuçları sayfasını render et
    // Şehirlerde kısmi eşleşmeler (hem isim hem açıklama Türkçe'ye uygun küçük harfe çevrilir)
    const filteredCities = cities.filter(city => {
        const cityNameLower = city.name.toLocaleLowerCase('tr-TR');
        const cityDescriptionLower = city.description ? city.description.toLocaleLowerCase('tr-TR') : '';
        return cityNameLower.includes(searchQuery) ||
               cityDescriptionLower.includes(searchQuery);
    });

    // Ülkelerde kısmi eşleşmeler (isim Türkçe'ye uygun küçük harfe çevrilir)
    const filteredCountries = countries.filter(country => {
        const countryNameLower = country.name.toLocaleLowerCase('tr-TR');
        return countryNameLower.includes(searchQuery);
    });

    res.render('search_results', {
        countries: countries, // Header/Footer için gerekli
        allCities: cities,    // Header/Footer için gerekli
        searchResultsCities: filteredCities,
        searchResultsCountries: filteredCountries,
        searchQuery: req.query.query // EJS'e orijinal arama terimini gönderiyoruz
    });
    res.render('index', {
        // ...
        pageUrl: req.originalUrl // Anasayfa için '/'
    });
});

// Arama Sonuçları Sayfası (bu rota genellikle /smart-search tarafından çağrılacaktır)
app.get('/search-results', (req, res) => {
    const searchQuery = req.query.query ? req.query.query.toLocaleLowerCase('tr-TR').trim() : '';

    const filteredCities = cities.filter(city => {
        const cityNameLower = city.name.toLocaleLowerCase('tr-TR');
        const countryIdLower = city.countryId.toLocaleLowerCase('tr-TR');
        // description alanı bazen boş olabilir
        const cityDescriptionLower = city.description ? city.description.toLocaleLowerCase('tr-TR') : '';

        return cityNameLower.includes(searchQuery) ||
               cityDescriptionLower.includes(searchQuery) ||
               countryIdLower.includes(searchQuery);
    });

    const filteredCountries = countries.filter(country => {
        const countryNameLower = country.name.toLocaleLowerCase('tr-TR');
        return countryNameLower.includes(searchQuery);
    });

    res.render('search_results', {
        countries: countries,
        allCities: cities,
        searchResultsCities: filteredCities,
        searchResultsCountries: filteredCountries,
        searchQuery: req.query.query
    });
    res.render('index', {
        // ...
        pageUrl: req.originalUrl // Anasayfa için '/'
    });
});
app.get('/about-us', (req, res) => {
    res.render('about-us', {
        countries: countries,
        allCities: cities
    });
});

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', {
        countries: countries,
        allCities: cities
    });
});



app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu http://0.0.0.0:${PORT} adresinde çalışıyor`);
});
