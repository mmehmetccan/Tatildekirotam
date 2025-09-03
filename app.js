const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 


const countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'countries.json'), 'utf8'));
const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cities.json'), 'utf8'));

app.get('/', (req, res) => {

    const recentlyAddedCities = cities.slice(-3).reverse();

    res.render('index', {
        pageTitle: 'Gezgin Rotam - Anasayfa', 
        countries: countries, 
        allCities: cities,    
        recentlyAddedCities: recentlyAddedCities 
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
             pageTitle: `${countries.name} Gezilecek Yerler Ve Nerede Ne Yenir Rehberi. - Tatildeki Rotam`,
            country: country,
            cities: countryCities,
            countries: countries,
            allCities: cities
        });
    } else {
        res.status(404).send('Ülke bulunamadı.');
    }


});

app.get('/city/:id', (req, res) => {
    const cityId = req.params.id;
    const city = cities.find(c => c.id === cityId);

    if (city) {
        res.render('city', {
            pageTitle: `${city.name} Gezilecek Yerler Ve Nerede Ne Yenir Rehberi. Ayrıca Toplu Taşıma Fiyatları Ve Havalimanı Ulaşımı Hakkında bilgileri bulabileceğiniz pratik bilgiler sizlerle. - Tatildeki Rotam`,
            city: city,
            countries: countries,
            allCities: cities,

        });
    } else {
        res.status(404).send('Şehir bulunamadı.');
    }


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
});


app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy', {
        countries: countries,
        allCities: cities,
        pageTitle: 'Gizlilik Politikası'
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
