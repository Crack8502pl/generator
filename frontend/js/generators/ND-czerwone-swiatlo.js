/**
 * Moduł ND-czerwone-swiatlo.js - Obsługa systemu czerwonego światła
 */

/**
 * Pobiera informację o komputerze do obsługi czerwonego światła
 * @param {Object} config - Konfiguracja nastawni
 * @returns {Object} Informacje o komputerze do czerwonego światła
 */
function getRedLightComputer(config) {
    // Wyznacz typ komputera w zależności od konfiguracji
    let computerName = "Komputer do obsługi czerwonego światła";
    
    if (config.lcs) {
        computerName = "Dedykowany serwer czerwonego światła";
    }
    
    return {
        name: computerName,
        type: config.lcs ? "server" : "workstation"
    };
}