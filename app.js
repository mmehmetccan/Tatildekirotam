const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/', (req, res) => {

    const recentlyAddedCities = cities.slice(-3).reverse();

    res.render('index', {
        pageTitle: 'Gezgin Rotam - Anasayfa', // Başlık Eklendi
        countries: countries, // Ülkeler verisini gönder
        allCities: cities,    // Tüm şehirler verisini gönder (header'daki alt menü için)
        recentlyAddedCities: recentlyAddedCities // Son eklenen şehirler verisini gönder
    });
    res.render('index', {
        pageUrl: req.originalUrl
    });
});

app.get('/country/:id', (req, res) => {
    const countryId = req.params.id;
    const country = countries.find(c => c.id === countryId);

    if (country) {
        const countryCities = cities.filter(city => city.countryId === countryId);
        res.render('country', {
            pageTitle: country.name + ' Şehirleri',
            country: country,
            cities: countryCities,
            countries: countries,
            allCities: cities
        });
    } else {
        res.status(404).send('Ülke bulunamadı.');
    }
    res.render('index', {
        pageUrl: req.originalUrl
    });
});

app.get('/city/:id', (req, res) => {
    const cityId = req.params.id;
    const city = cities.find(c => c.id === cityId);

    if (city) {
        res.render('city', {
            pageTitle: city.name + ' Keşif Rehberi',
            city: city,
            countries: countries,
            allCities: cities
        });
    } else {
        res.status(404).send('Şehir bulunamadı.');
    }
    res.render('index', {
        pageUrl: req.originalUrl
    });
});
app.get('/search', (req, res) => {
    const searchQuery = req.query.query;
    console.log(`Aranan kelime: ${searchQuery}`);

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

    res.render('search_results', { query: searchQuery, searchResults: searchResults });
});


app.get('/smart-search', (req, res) => {
    const searchQuery = req.query.query ? req.query.query.toLocaleLowerCase('tr-TR').trim() : '';

    if (!searchQuery) {
        return res.redirect('/');
    }

    const exactCityMatch = cities.find(city => city.name.toLocaleLowerCase('tr-TR') === searchQuery);
    if (exactCityMatch) {
        return res.redirect(`/city/${exactCityMatch.id}`);
    }

    const exactCountryMatch = countries.find(country => country.name.toLocaleLowerCase('tr-TR') === searchQuery);
    if (exactCountryMatch) {
        return res.redirect(`/country/${exactCountryMatch.id}`);
    }

    const filteredCities = cities.filter(city => {
        const cityNameLower = city.name.toLocaleLowerCase('tr-TR');
        const cityDescriptionLower = city.description ? city.description.toLocaleLowerCase('tr-TR') : '';
        return cityNameLower.includes(searchQuery) ||
               cityDescriptionLower.includes(searchQuery);
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

        pageUrl: req.originalUrl
    });
});

app.get('/search-results', (req, res) => {
    const searchQuery = req.query.query ? req.query.query.toLocaleLowerCase('tr-TR').trim() : '';

    const filteredCities = cities.filter(city => {
        const cityNameLower = city.name.toLocaleLowerCase('tr-TR');
        const countryIdLower = city.countryId.toLocaleLowerCase('tr-TR');
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

        pageUrl: req.originalUrl
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
