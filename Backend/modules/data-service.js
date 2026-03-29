/**
 * Serwis danych - obsługa dostępu do danych
 */

const path = require('path');
const fs = require('fs');

// Ścieżka do plików z danymi
const DATA_PATH = path.join(__dirname, '../data');

/**
 * Serwis obsługi danych - pobieranie, aktualizacja, zapytania
 */
const dataService = {
    /**
     * Pobieranie danych określonego typu
     * @param {string} type - Typ danych (skp, kata, katb, nastawnia)
     * @returns {Array} Dane w formacie tablicy obiektów
     */
    getData(type) {
        try {
            const dataFile = this._getDataFilePath(type);
            // Dynamiczne importowanie plików danych
            const data = require(dataFile);
            return data;
        } catch (error) {
            console.error(`Błąd pobierania danych typu ${type}:`, error);
            throw new Error(`Nie można pobrać danych typu ${type}`);
        }
    },
    
    /**
     * Aktualizacja danych określonego typu
     * @param {string} type - Typ danych (skp, kata, katb, nastawnia)
     * @param {Array} data - Nowe dane
     * @returns {boolean} Czy operacja się powiodła
     */
    updateData(type, data) {
        try {
            const dataFile = this._getDataFilePath(type);
            fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error(`Błąd zapisywania danych typu ${type}:`, error);
            return false;
        }
    },
    
    /**
     * Pobieranie pojedynczego elementu z danych
     * @param {string} type - Typ danych (skp, kata, katb, nastawnia)
     * @param {string} name - Nazwa elementu
     * @returns {Object|null} Znaleziony element lub null
     */
    getItem(type, name) {
        try {
            const data = this.getData(type);
            return data.find(item => item.nazwa === name) || null;
        } catch (error) {
            console.error(`Błąd pobierania elementu ${name} z typu ${type}:`, error);
            return null;
        }
    },
    
    /**
     * Pobierz ścieżkę do pliku danych
     * @param {string} type - Typ danych (skp, kata, katb, nastawnia)
     * @returns {string} Ścieżka do pliku
     * @private
     */
    _getDataFilePath(type) {
        const typeMap = {
            'skp': 'SKP_DATA.js',
            'kata': 'KATA_DATA.js',
            'katb': 'KATB_DATA.js',
            'nastawnia': 'NASTAWNIA_DATA.js'
        };
        
        if (!typeMap[type]) {
            throw new Error(`Nieprawidłowy typ danych: ${type}`);
        }
        
        return path.join(DATA_PATH, typeMap[type]);
    }
};

module.exports = { dataService };