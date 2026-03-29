const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { dataService } = require('./modules/data-service');
const { generatorService } = require('./modules/generator-service');

// Tworzenie aplikacji Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Konfiguracja serwowania plików statycznych - TO JEST KLUCZOWA ZMIANA
app.use('/', express.static(path.join(__dirname, '../frontend')));
app.get('*.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '../frontend', req.path));
});

app.get('*.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '../frontend', req.path));
});

// API endpoints
app.get('/api/data/:type', (req, res) => {
    try {
        const type = req.params.type.toLowerCase();
        const data = dataService.getData(type);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/generators/:type', (req, res) => {
    try {
        const type = req.params.type.toLowerCase();
        const data = generatorService.generateData(type, req.query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/export', (req, res) => {
    try {
        const { data, format, filename } = req.body;
        const exportedData = generatorService.exportData(data, format);
        res.json({ success: true, data: exportedData, filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sprawdź, czy katalogi struktury są poprawne
const frontendPath = path.join(__dirname, '../frontend');
console.log(`Sprawdzam czy istnieje katalog frontend: ${frontendPath}`);
console.log(`Katalog frontend istnieje: ${fs.existsSync(frontendPath)}`);

const cssPath = path.join(__dirname, '../frontend/css');
console.log(`Sprawdzam czy istnieje katalog css: ${cssPath}`);
console.log(`Katalog css istnieje: ${fs.existsSync(cssPath)}`);

const jsPath = path.join(__dirname, '../frontend/js');
console.log(`Sprawdzam czy istnieje katalog js: ${jsPath}`);
console.log(`Katalog js istnieje: ${fs.existsSync(jsPath)}`);

// Obsługa pozostałych zapytań - przekierowanie do index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer DER-MAG uruchomiony na porcie ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});