/**
 * Moduł ND-ND.js - Kreator nastawni z konfiguracją sprzętu
 */

/**
 * Inicjalizuje kreator ND z podanymi parametrami
 * @param {number} nastawniaId - ID nastawni
 */
function initNDCreator(nastawniaId) {
    const config = NastawniaManager.configurations[nastawniaId] || {};
    const creatorContainer = document.getElementById(`nd_creator_container_${nastawniaId}`);
    
    if (!creatorContainer) return;
    
    // Wypełnij kreator HTML
    creatorContainer.innerHTML = `
        <div class="nd-kreator">
            <h3>Konfiguracja stanowiska operatorskiego</h3>
            
            <div class="form-group">
                <label for="monitor_count_${nastawniaId}">Liczba monitorów:</label>
                <select id="monitor_count_${nastawniaId}" class="creator-select">
                    ${[1, 2, 3, 4, 5, 6, 8].map(num => 
                        `<option value="${num}" ${config.monitorCount === num ? 'selected' : ''}>${num}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="monitor_size_${nastawniaId}">Rozmiar monitorów:</label>
                <select id="monitor_size_${nastawniaId}" class="creator-select">
                    ${[22, 24, 27, 32].map(size => 
                        `<option value="${size}" ${config.monitorSize === size ? 'selected' : ''}>${size}"</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="rack_size_${nastawniaId}">Wysokość szafy RACK 19":</label>
                <select id="rack_size_${nastawniaId}" class="creator-select">
                    ${[12, 18, 24, 42, 45].map(size => 
                        `<option value="${size}" ${config.rackSize === size ? 'selected' : ''}>${size}U</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label>Typ komputera:</label>
                <div class="radio-group">
                    <div>
                        <input type="radio" id="pc_type_standard_${nastawniaId}" name="pc_type_${nastawniaId}" 
                               value="standard" ${config.computerType !== 'minipc' ? 'checked' : ''}>
                        <label for="pc_type_standard_${nastawniaId}">PC</label>
                    </div>
                    <div>
                        <input type="radio" id="pc_type_minipc_${nastawniaId}" name="pc_type_${nastawniaId}" 
                               value="minipc" ${config.computerType === 'minipc' ? 'checked' : ''}>
                        <label for="pc_type_minipc_${nastawniaId}">MINI PC</label>
                    </div>
                </div>
            </div>
            
            <div class="nd-results">
                <div id="computer_count_info_${nastawniaId}" class="info-text"></div>
                <div id="server_info_${nastawniaId}" class="info-text"></div>
            </div>
            
            <button id="update_nd_${nastawniaId}" class="nd-button">Aktualizuj konfigurację</button>
        </div>
    `;
    
    // Dodaj listenery zdarzeń
    setupNDEventListeners(nastawniaId);
    
    // Inicjalizuj wyliczenia
    updateNDComputerCount(nastawniaId);
}

/**
 * Dodaje listenery zdarzeń do elementów kreatora ND
 * @param {number} nastawniaId - ID nastawni
 */
function setupNDEventListeners(nastawniaId) {
    // Pobierz elementy formularza
    const monitorCount = document.getElementById(`monitor_count_${nastawniaId}`);
    const monitorSize = document.getElementById(`monitor_size_${nastawniaId}`);
    const rackSize = document.getElementById(`rack_size_${nastawniaId}`);
    const pcTypeStandard = document.getElementById(`pc_type_standard_${nastawniaId}`);
    const pcTypeMini = document.getElementById(`pc_type_minipc_${nastawniaId}`);
    const updateButton = document.getElementById(`update_nd_${nastawniaId}`);
    
    // Zapisuj wartości do konfiguracji i aktualizuj licznik komputerów
    if (monitorCount) {
        monitorCount.addEventListener('change', function() {
            NastawniaManager.configurations[nastawniaId].monitorCount = parseInt(this.value);
            updateNDComputerCount(nastawniaId);
        });
    }
    
    if (monitorSize) {
        monitorSize.addEventListener('change', function() {
            NastawniaManager.configurations[nastawniaId].monitorSize = parseInt(this.value);
        });
    }
    
    if (rackSize) {
        rackSize.addEventListener('change', function() {
            NastawniaManager.configurations[nastawniaId].rackSize = parseInt(this.value);
        });
    }
    
    if (pcTypeStandard) {
        pcTypeStandard.addEventListener('change', function() {
            if (this.checked) {
                NastawniaManager.configurations[nastawniaId].computerType = 'standard';
                updateNDComputerCount(nastawniaId);
            }
        });
    }
    
    if (pcTypeMini) {
        pcTypeMini.addEventListener('change', function() {
            if (this.checked) {
                NastawniaManager.configurations[nastawniaId].computerType = 'minipc';
                updateNDComputerCount(nastawniaId);
            }
        });
    }
    
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            updateNastawniaEquipment(nastawniaId);
        });
    }
}

/**
 * Aktualizuje informacje o liczbie komputerów i serwerów
 * @param {number} nastawniaId - ID nastawni
 */
function updateNDComputerCount(nastawniaId) {
    const config = NastawniaManager.configurations[nastawniaId];
    if (!config) return;
    
    const monitorCount = config.monitorCount || 2;
    const isMiniPC = config.computerType === 'minipc';
    
    let computerCount = isMiniPC ? Math.ceil(monitorCount / 2) : 1;
    let serverNeeded = isMiniPC && computerCount >= 2;
    
    // Aktualizuj informacje w UI
    const computerCountInfo = document.getElementById(`computer_count_info_${nastawniaId}`);
    const serverInfo = document.getElementById(`server_info_${nastawniaId}`);
    
    if (computerCountInfo) {
        computerCountInfo.innerHTML = `<strong>Liczba komputerów:</strong> ${computerCount} ${isMiniPC ? 'MINI PC' : 'PC'}`;
    }
    
    if (serverInfo) {
        if (serverNeeded) {
            serverInfo.innerHTML = '<strong>Dodatkowy sprzęt:</strong> Serwer (wymagany dla wielu MINI PC)';
            serverInfo.style.color = '#2a5298';
        } else {
            serverInfo.innerHTML = '';
        }
    }
    
    // Zapisz dane do konfiguracji
    config.computerCount = computerCount;
    config.serverNeeded = serverNeeded;
    
    // Uaktualnij wyposażenie nastawni
    if (typeof updateNastawniaEquipment === 'function') {
        updateNastawniaEquipment(nastawniaId);
    }
}

/**
 * Pobiera wyposażenie na podstawie konfiguracji ND
 * @param {number} nastawniaId - ID nastawni
 * @returns {Array} Lista elementów wyposażenia
 */
function getNDEquipment(nastawniaId) {
    const config = NastawniaManager.configurations[nastawniaId] || {};
    const equipment = [];
    
    // Podstawowe dane o konfiguracji
    const monitorCount = config.monitorCount || 2;
    const monitorSize = config.monitorSize || 22;
    const rackSize = config.rackSize || 42;
    const isMiniPC = config.computerType === 'minipc';
    const computerCount = config.computerCount || (isMiniPC ? Math.ceil(monitorCount / 2) : 1);
    const serverNeeded = config.serverNeeded || (isMiniPC && computerCount >= 2);
    
    // Dodaj komputery
    equipment.push({
        name: isMiniPC ? `MINI PC` : `Komputer PC`,
        quantity: computerCount,
        klasa: "lanw",
        typ: "komputer"
    });
    
    // Dodaj serwer jeśli potrzebny
    if (serverNeeded) {
        equipment.push({
            name: "Serwer",
            quantity: 1,
            klasa: "kanw",
            typ: "serwer"
        });
    }
    
    // Dodaj monitory
    equipment.push({
        name: `Monitor ${monitorSize}"`,
        quantity: monitorCount,
        klasa: "lanw",
        typ: "monitor"
    });
    
    // Dodaj szafę RACK
    equipment.push({
        name: `Szafa RACK 19" ${rackSize}U`,
        quantity: 1,
        klasa: "lanw",
        typ: "szafa"
    });
    
    // Dodaj KVM jeśli jest więcej niż 1 komputer
    if (computerCount > 1 || serverNeeded) {
        equipment.push({
            name: "Przełącznik KVM",
            quantity: 1,
            klasa: "lanw",
            typ: "akcesoria"
        });
    }
    
    // Dodaj klawiaturę i mysz
    equipment.push({
        name: "Zestaw klawiatura i mysz",
        quantity: 1,
        klasa: "lanw",
        typ: "akcesoria"
    });
    
    return equipment;
}