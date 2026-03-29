/**
 * Serwis generatorów - obsługa generowania danych
 */

const path = require('path');
const { dataService } = require('./data-service');

/**
 * Serwis obsługi generatorów - generowanie danych, eksport
 */
const generatorService = {
    /**
     * Generowanie danych określonego typu
     * @param {string} type - Typ generatora (skp, kata, katb, nastawnia)
     * @param {Object} params - Parametry dla generatora
     * @returns {Object} Wygenerowane dane
     */
    generateData(type, params = {}) {
        try {
            // Pobierz dane z serwisu danych
            const data = dataService.getData(type);
            
            // Przygotuj dane do zwrotu
            let result = {
                type,
                data,
                timestamp: new Date().toISOString()
            };
            
            // Wykonaj specyficzną dla generatora logikę
            switch (type) {
                case 'skp':
                    result = this._generateSKP(data, params);
                    break;
                case 'kata':
                    result = this._generateKATA(data, params);
                    break;
                case 'katb':
                    result = this._generateKATB(data, params);
                    break;
                case 'nastawnia':
                    result = this._generateNastawnia(data, params);
                    break;
                default:
                    throw new Error(`Nieobsługiwany typ generatora: ${type}`);
            }
            
            return result;
        } catch (error) {
            console.error(`Błąd generowania danych typu ${type}:`, error);
            throw new Error(`Nie można wygenerować danych typu ${type}`);
        }
    },
    
    /**
     * Eksport danych do określonego formatu
     * @param {Object} data - Dane do eksportu
     * @param {string} format - Format eksportu (csv, json)
     * @returns {string} Dane w żądanym formacie
     */
    exportData(data, format = 'csv') {
        try {
            switch (format.toLowerCase()) {
                case 'csv':
                    return this._exportToCSV(data);
                case 'json':
                    return JSON.stringify(data, null, 2);
                default:
                    throw new Error(`Nieobsługiwany format eksportu: ${format}`);
            }
        } catch (error) {
            console.error(`Błąd eksportu danych:`, error);
            throw new Error(`Nie można wyeksportować danych do formatu ${format}`);
        }
    },
    
    /**
     * Generator SKP
     * @param {Array} data - Dane SKP
     * @param {Object} params - Parametry generatora
     * @returns {Object} Wygenerowane dane
     * @private
     */
    _generateSKP(data, params) {
        // W tym miejscu implementujemy specyficzną logikę dla generatora SKP
        // Na potrzeby integracji z frontendem zwracamy niezmienione dane
        return {
            type: 'skp',
            data,
            timestamp: new Date().toISOString()
        };
    },
    
    /**
     * Generator KAT A
     * @param {Array} data - Dane KAT A
     * @param {Object} params - Parametry generatora
     * @returns {Object} Wygenerowane dane
     * @private
     */
    _generateKATA(data, params) {
        // W tym miejscu implementujemy specyficzną logikę dla generatora KAT A
        return {
            type: 'kata',
            data,
            timestamp: new Date().toISOString()
        };
    },
    
    /**
     * Generator KAT B
     * @param {Array} data - Dane KAT B
     * @param {Object} params - Parametry generatora
     * @returns {Object} Wygenerowane dane
     * @private
     */
    _generateKATB(data, params) {
        // W tym miejscu implementujemy specyficzną logikę dla generatora KAT B
        return {
            type: 'katb',
            data,
            timestamp: new Date().toISOString()
        };
    },
    
    /**
     * Generator Nastawnia
     * @param {Array} data - Dane Nastawnia
     * @param {Object} params - Parametry generatora
     * @returns {Object} Wygenerowane dane
     * @private
     */
    _generateNastawnia(data, params) {
        // W tym miejscu implementujemy specyficzną logikę dla generatora Nastawnia
        return {
            type: 'nastawnia',
            data,
            timestamp: new Date().toISOString()
        };
    },
    
    /**
     * Eksport danych do formatu CSV
     * @param {Object|Array} data - Dane do eksportu
     * @returns {string} Dane w formacie CSV
     * @private
     */
    _exportToCSV(data) {
        // Określ, czy dane są tablicą obiektów, czy pojedynczym obiektem
        const dataArray = Array.isArray(data) ? data : [data];
        
        // Jeśli brak danych, zwróć pusty string
        if (dataArray.length === 0) {
            return '';
        }
        
        // Pobierz nagłówki (klucze z pierwszego obiektu)
        const headers = Object.keys(dataArray[0]);
        
        // Utwórz nagłówek CSV
        const csvHeader = headers.join(';');
        
        // Utwórz wiersze CSV
        const csvRows = dataArray.map(item => {
            return headers.map(header => {
                const value = item[header];
                // Wartości zawierające przecinki lub średniki opakowujemy w cudzysłowy
                if (typeof value === 'string' && (value.includes(',') || value.includes(';'))) {
                    return `"${value}"`;
                }
                return value;
            }).join(';');
        });
        
        // Połącz wszystko i dodaj BOM dla prawidłowego kodowania UTF-8
        return `\ufeff${csvHeader}\n${csvRows.join('\n')}`;
    }
};

module.exports = { generatorService };