/**
 * Moduł ND-LPR.js - Obsługa systemu rozpoznawania tablic rejestracyjnych
 */

/**
 * Pobiera informację o komputerze do obsługi LPR
 * @param {Object} config - Konfiguracja nastawni
 * @returns {Object} Informacje o komputerze LPR
 */
function getLprComputer(config) {
    // Wyznacz typ komputera w zależności od konfiguracji
    let computerName = "Komputer do obsługi LPR";
    
    if (config.lcs) {
        computerName = "Dedykowany serwer LPR";
    }
    
    return {
        name: computerName,
        type: config.lcs ? "server" : "workstation"
    };
}