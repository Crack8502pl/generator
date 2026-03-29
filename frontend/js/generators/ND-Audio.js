/**
 * Moduł ND-Audio.js - Obsługa wyposażenia audio dla nastawni
 */

/**
 * Pobiera wyposażenie audio na podstawie konfiguracji nastawni
 * @param {number} nastawniaId - ID nastawni 
 * @param {Object} config - Konfiguracja nastawni
 * @returns {Array} Lista elementów wyposażenia audio
 */
function getAudioEquipment(nastawniaId, config) {
    const equipment = [];
    
    // Podstawowe wyposażenie audio
    equipment.push({
        name: "System komunikacji głosowej",
        quantity: 1
    });
    
    // Jeśli nastawnia ma LCS, dodaj bardziej zaawansowany system audio
    if (config.lcs) {
        equipment.push({
            name: "System rozgłoszeniowy LCS",
            quantity: 1
        });
        
        // Dodaj głośniki
        equipment.push({
            name: "Głośnik naścienny 20W",
            quantity: config.workstationCount * 2
        });
    } else {
        // Standardowy system audio dla zwykłej nastawni
        equipment.push({
            name: "Interkom biurkowy",
            quantity: 1
        });
    }
    
    return equipment;
}