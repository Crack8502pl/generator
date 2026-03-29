/**
 * Moduł ND-connector.js - Zarządzanie połączeniami nastawni
 */

/**
 * Inicjalizuje moduł łączący nastawnie z obiektami
 * @param {number} nastawniaId - ID nastawni
 */
function initConnector(nastawniaId) {
    // Nasłuchuj zmian w połączonych obiektach
    const connectedObjectsDiv = document.getElementById(`connectedObjects_${nastawniaId}`);
    if (!connectedObjectsDiv) return;
    
    // Utworzenie MutationObserver do nasłuchiwania zmian
    const observer = new MutationObserver(function(mutations) {
        updateNastawniaConnections(nastawniaId);
    });
    
    observer.observe(connectedObjectsDiv, { 
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['checked']
    });
    
    // Początkowa aktualizacja połączeń
    updateNastawniaConnections(nastawniaId);
}

/**
 * Aktualizuje połączenia dla danej nastawni
 * @param {number} nastawniaId - ID nastawni
 */
function updateNastawniaConnections(nastawniaId) {
    const connectedObjects = [];
    const checkboxes = document.querySelectorAll(`#connectedObjects_${nastawniaId} input[type="checkbox"]:checked`);
    
    checkboxes.forEach(checkbox => {
        connectedObjects.push({
            id: checkbox.value,
            type: checkbox.value.includes('nastawnia_') ? 'nastawnia' : 'object',
            name: checkbox.nextElementSibling.textContent
        });
    });
    
    // Zapisz połączone obiekty do menedżera
    NastawniaManager.connections[nastawniaId] = connectedObjects;
    
    // Wywołaj funkcję aktualizacji w module głównym nastawni
    if (typeof updateNastawniaEquipment === 'function') {
        updateNastawniaEquipment(nastawniaId);
    }
    
    console.log(`Zaktualizowano połączenia dla nastawni ID ${nastawniaId}:`, connectedObjects);
}

/**
 * Zwraca listę połączonych obiektów dla danej nastawni
 * @param {number} nastawniaId - ID nastawni
 * @returns {Array} Lista połączonych obiektów
 */
function getConnectedObjects(nastawniaId) {
    return NastawniaManager.connections[nastawniaId] || [];
}