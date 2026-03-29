/**
 * Moduł ND-NVR.js - Obsługa rejestratorów wideo dla nastawni
 */

/**
 * Pobiera wyposażenie NVR na podstawie konfiguracji nastawni
 * @param {number} nastawniaId - ID nastawni
 * @param {Object} config - Konfiguracja nastawni
 * @returns {Array} Lista elementów wyposażenia NVR
 */
function getNvrEquipment(nastawniaId, config) {
    const equipment = [];
    
    // Sprawdź czy rejestrator jest potrzebny
    const recorderNeeded = checkIfRecorderNeeded(nastawniaId);
    
    if (recorderNeeded) {
        equipment.push({
            name: recorderNeeded.nazwa || `Rejestrator ${recorderNeeded.model}`,
            quantity: 1
        });
        
        // Dodaj dyski
        const diskSlots = recorderNeeded.diskSlots || 1;
        equipment.push({
            name: `Dysk twardy 4TB`,
            quantity: diskSlots
        });
    }
    
    return equipment;
}