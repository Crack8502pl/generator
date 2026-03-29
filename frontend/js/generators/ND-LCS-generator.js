/**
 * Generuje tabelę ND-LCS (Nastawnia bez LCS podłączona do LCS) dla danego obiektu
 * @param {number} objectId - ID obiektu
 */
 
function generateNDLCSTable(objectId) {
    const tableBody = document.querySelector(`#nastawniaTable_${objectId} tbody`);

    // Dodanie kreatora przed tabelą
    const creatorDiv = document.createElement('div');
    creatorDiv.className = 'nastawnia-creator';
    creatorDiv.id = `nastawniaCreator_${objectId}`;

    // Sprawdź czy połączone są obiekty KAT A
    const hasKatAObjects = checkForConnectedKatAObjects(objectId);
    
    // Sprawdź czy nastawnia jest podłączona do LCS
    const connectedToLcs = isNastawiaConnectedToLCS(objectId);

    let creatorHTML = `
        <div class="nastawnia-creator-header">
            <h3>Kreator Nastawni ND-LCS</h3>
            <p class="info-text">Uproszczony wariant dla nastawni podłączonej do LCS</p>
        </div>
        <div class="creator-form">
        </div>
        <div class="creator-item">
            <div class="info-message" style="background: #e3f2fd; padding: 8px; border-radius: 4px; color: #1976d2;">
                ℹ️ Nastawnia bez LCS/LPR/Czerwonego światła podłączona do nastawni z LCS
            </div>
        </div>
        <div class="creator-item">
            <div class="info-message" style="background: #fff3e0; padding: 8px; border-radius: 4px; color: #f57c00;">
                ⚠️ Brak rejestratorów i dysków - nagrywanie przez nastawnie z LCS
            </div>
        </div>
    `;

    // Liczba monitorów
    creatorHTML += `
        <div class="creator-item">
            <label for="monitors_count_${objectId}">Liczba monitorów:</label>
            <select id="monitors_count_${objectId}" class="creator-select">
                ${Array.from({length: 101}, (_, i) => `<option value="${i}">${i}</option>`).join('')}
            </select>
        </div>
    `;

    // Rozmiar monitorów
    creatorHTML += `
        <div class="creator-item">
            <label for="monitor_size_${objectId}">Rozmiar monitora:</label>
            <div class="size-input-container">
                <select id="monitor_size_${objectId}" class="creator-input">
                    <option value="15.6">15.6″</option>
                    <option value="17">17″</option>
                    <option value="18.5">18.5″</option>
                    <option value="19">19″</option>
                    <option value="19.5">19.5″</option>
                    <option value="20">20″</option>
                    <option value="21.5">21.5″</option>
                    <option value="22">22″</option>
                    <option value="23">23″</option>
                    <option value="23.6">23.6″</option>
                    <option value="23.8" selected>23.8″</option>
                    <option value="24">24″</option>
                    <option value="25">25″</option>
                    <option value="27">27″</option>
                    <option value="28">28″</option>
                    <option value="29">29″</option>
                    <option value="31.5">31.5″</option>
                    <option value="32">32″</option>
                    <option value="39">39″</option>
                    <option value="40">40″</option>
                    <option value="42">42″</option>
                    <option value="43">43″</option>
                    <option value="48">48″</option>
                    <option value="49">49″</option>
                    <option value="50">50″</option>
                    <option value="55">55″</option>
                    <option value="58">58″</option>
                    <option value="60">60″</option>
                    <option value="65">65″</option>
                    <option value="70">70″</option>
                    <option value="75">75″</option>
                    <option value="77">77″</option>
                    <option value="82">82″</option>
                    <option value="85">85″</option>
                    <option value="86">86″</option>
                    <option value="98">98″</option>
                    <option value="100">100″</option>
                </select>
            </div>
        </div>
    `;

    // Rozmiar szafy RACK
    creatorHTML += `
        <div class="creator-item">
            <label for="rack_size_${objectId}">Rozmiar szafy RACK 19″:</label>
            <select id="rack_size_${objectId}" class="creator-select">
                <option value="24U">24U</option>
                <option value="42U" selected>42U</option>
                <option value="48U">48U</option>
                <option value="SPECJALNA">SPECJALNA</option>
            </select>
        </div>
    `;

    // Typ komputera
    creatorHTML += `
        <div class="creator-item">
            <label for="computer_type_${objectId}">Zastosowane komputery:</label>
            <select id="computer_type_${objectId}" class="creator-select">
                <option value="MINI PC" selected>MINI PC</option>
                <option value="PC">PC</option>
            </select>
        </div>
    `;

    // Opcja monitory na PC (widoczna tylko jeśli wybrano PC)
    creatorHTML += `
        <div id="monitorsPerPcContainer_${objectId}" class="creator-item" style="display: none;">
            <label for="monitors_per_pc_${objectId}">Monitorów na PC:</label>
            <select id="monitors_per_pc_${objectId}" class="creator-select">
                <option value="2">2 monitory</option>
                <option value="3">3 monitory</option>
                <option value="4" selected>4 monitory</option>
                <option value="special">Konfiguracja specjalna</option>
            </select>
        </div>
    `;

    // Przycisk aktualizacji tabeli
    creatorHTML += `
        <div class="creator-buttons">
            <button type="button" id="updateNastawnia_${objectId}" class="update-nastawnia-btn">🔄 Aktualizuj wyposażenie</button>
        </div>
    `;

    creatorHTML += `</div>`;
    creatorDiv.innerHTML = creatorHTML;

    // Wstaw kreator przed tabelą
    const nastawniaCalculator = document.getElementById(`nastawniaCalculator_${objectId}`);
    if (nastawniaCalculator) {
        const calculatorTitle = nastawniaCalculator.querySelector('h3');
        if (calculatorTitle) {
            nastawniaCalculator.insertBefore(creatorDiv, calculatorTitle.nextSibling);
        }
    }

    tableBody.innerHTML = '';
    generateNDLCSEquipment(objectId, tableBody);

    // Obsługa eventów
    setTimeout(() => {
        // Przycisk ręcznego odświeżenia
        const updateButton = document.getElementById(`updateNastawnia_${objectId}`);
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                updateNDLCSEquipment(objectId);
            });
        }

        // Typ komputera
        const computerTypeSelect = document.getElementById(`computer_type_${objectId}`);
        const monitorsPerPcContainer = document.getElementById(`monitorsPerPcContainer_${objectId}`);
        if (computerTypeSelect && monitorsPerPcContainer) {
            computerTypeSelect.addEventListener('change', function() {
                monitorsPerPcContainer.style.display = (this.value === 'PC') ? 'block' : 'none';
                updateNDLCSEquipment(objectId);
            });
        }

        // Event listenery dla pozostałych pól
        document.getElementById(`monitors_count_${objectId}`).addEventListener('change', () => updateNDLCSEquipment(objectId));
        document.getElementById(`monitor_size_${objectId}`).addEventListener('change', () => updateNDLCSEquipment(objectId));
        document.getElementById(`rack_size_${objectId}`).addEventListener('change', () => updateNDLCSEquipment(objectId));
        document.getElementById(`computer_type_${objectId}`).addEventListener('change', () => updateNDLCSEquipment(objectId));
        document.getElementById(`monitors_per_pc_${objectId}`).addEventListener('change', () => updateNDLCSEquipment(objectId));
    }, 100);
}

/**
 * Sprawdza, czy do nastawni są podłączone obiekty typu KAT A
 * @param {number} nastawniaId - ID nastawni
 * @returns {boolean} Czy są podłączone obiekty KAT A
 */
function checkForConnectedKatAObjects(nastawniaId) {
    const connectedObjects = document.querySelectorAll(`#connectedObjects_${nastawniaId} input[type="checkbox"]:checked`);
    
    for (const checkbox of connectedObjects) {
        const objId = checkbox.value;
        // Pomiń nastawnie
        if (objId.includes('nastawnia_')) continue;
        
        const objectElement = document.getElementById(`object_${objId}`);
        if (!objectElement) continue;
        
        const katARadio = objectElement.querySelector('input[id^="KATa_"]:checked');
        if (katARadio) return true;
    }
    
    return false;
}

/**
 * Sprawdza czy nastawnia jest podłączona do nastawni z LCS
 * @param {number} nastawniaId - ID nastawni
 * @returns {boolean} Czy nastawnia jest podłączona do nastawni z LCS
 */
function isNastawiaConnectedToLCS(nastawniaId) {
    const nastawnie = document.querySelectorAll('.nastawnia-item');
    
    for (const nastawnia of nastawnie) {
        const id = nastawnia.id.split('_')[1];
        const lcsCheckbox = document.getElementById(`lcs_${id}`);
        
        // Jeśli to nastawnia z LCS
        if (lcsCheckbox && lcsCheckbox.checked) {
            // Sprawdź czy nasza nastawnia jest do niej podłączona
            const connectedObjects = document.querySelectorAll(`#connectedObjects_${id} input[type="checkbox"]:checked`);
            for (const checkbox of connectedObjects) {
                if (checkbox.value === `nastawnia_${nastawniaId}`) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

/**
 * Generuje wyposażenie nastawni ND-LCS na podstawie ustawień kreatora
 * @param {number} objectId - ID nastawni
 * @param {HTMLElement} tableBody - Element tbody tabeli
 */
function generateNDLCSEquipment(objectId, tableBody) {
    // Pobierz wartości z kreatora
    const monitorsCount = parseInt(document.getElementById(`monitors_count_${objectId}`).value) || 0;
    const monitorSize = document.getElementById(`monitor_size_${objectId}`).value || '23.8';
    const rackSize = document.getElementById(`rack_size_${objectId}`).value || '42U';
    const computerType = document.getElementById(`computer_type_${objectId}`).value || 'MINI PC';
    
    // Pobierz opcje dotyczące monitorów na PC
    let monitorsPerPc = 4; // domyślnie 4 monitory na PC
    if (computerType === 'PC') {
        const monitorsPerPcSelect = document.getElementById(`monitors_per_pc_${objectId}`);
        if (monitorsPerPcSelect) {
            const selectedValue = monitorsPerPcSelect.value;
            if (selectedValue !== 'special') {
                monitorsPerPc = parseInt(selectedValue);
            }
        }
    }
    
    // Oblicz liczbę komputerów
    let computerCount = 0;
    if (computerType === 'MINI PC') {
        computerCount = Math.ceil(monitorsCount / 2); // Połowa liczby monitorów (zaokrąglone w górę)
    } else { // PC
        computerCount = Math.ceil(monitorsCount / monitorsPerPc); // Liczba monitorów podzielona przez monitory na PC
    }
    
    // Sprawdź, czy połączone są obiekty KAT A
    const hasKatAObjects = checkForConnectedKatAObjects(objectId);
    
    console.log(`Nastawnia ND-LCS ${objectId} - KAT A obiekty: ${hasKatAObjects}`);
    
    // Przygotuj nowy zestaw wyposażenia
    const equipmentList = [];
    
    // Dodaj monitory
    if (monitorsCount > 0) {
        equipmentList.push({
            nazwa: `Monitor ${monitorSize}″`,
            ilosc: monitorsCount,
            klasa: 'Klasa-0',
            typ: 'akcesoria'
        });
    }
    
    // Dodaj komputery
    if (computerCount > 0) {
        // Dodaj informację o liczbie wyjść monitorowych dla PC
        let computerName = computerType;
        if (computerType === 'PC') {
            computerName = `PC z ${monitorsPerPc} wyjść monitorowych`;
        }
        
        equipmentList.push({
            nazwa: `${computerName} z klawiaturą`,
            ilosc: computerCount,
            klasa: 'Lanz1',
            typ: 'komputer'
        });
        
                // Dodaj komputer serwer jeśli:
        // - Mini PC > 1, lub
        // - PC > 1, lub
        // - Klucz USB SSV/CSV ma wartość > 8
        const shouldAddServer = 
            (computerType === 'MINI PC' && computerCount > 1) || 
            (computerType === 'PC' && computerCount > 1) ||
            (!isLprEnabled && !isRedLightEnabled && connectedCamerasCount > 8);
        
        if (shouldAddServer) {
            console.log(`Dodaję serwer: PC > 1: ${computerType === 'PC' && computerCount > 1}, 
                         MiniPC > 1: ${computerType === 'MINI PC' && computerCount > 1}, 
                         Kamery > 8: ${!isLprEnabled && !isRedLightEnabled && connectedCamerasCount > 8}`);
            
            equipmentList.push({
                nazwa: 'Komputer Serwer',
                ilosc: 1,
                klasa: 'Lanz1',
                typ: 'serwer'
            });
        }
    }
    
    // Dodaj szafę rack
    equipmentList.push({
        nazwa: `Szafa rack ${rackSize}`,
        ilosc: 1,
        klasa: 'brak',
        typ: 'akcesoria'
    });
    
    // Dodaj standardowe wyposażenie (bez elementów związanych z LPR, LCS, RedLight)
    NASTAWNIA_DATA.forEach(item => {
        // Pomiń elementy już dodane (monitor i szafa rack)
        if (item.typ === 'monitor' || item.nazwa.includes('rack')) {
            return;
        }
        
        // Pomiń elementy związane z LPR, LCS, RedLight
        if (item.zaleznosc === "LPR" || item.zaleznosc === "RedLight" || item.zaleznosc === "LCS") {
            return;
        }
        
        // Pomiń klawiaturę (jest już dodana z komputerem)
        if (item.nazwa.includes("Klawiatura")) {
            return;
        }
        
        equipmentList.push({
            nazwa: item.nazwa,
            ilosc: item.zaleznosc && /^\d+$/.test(item.zaleznosc) ? parseInt(item.zaleznosc) : 1,
            klasa: item.klasa || 'brak',
            typ: item.typ
        });
    });
    
    // Dodaj telefon systemowy dla obiektów KAT A - ZAWSZE jeśli są obiekty KAT A
    if (hasKatAObjects) {
        equipmentList.push({
            nazwa: 'Telefon systemowy CTS220-ip',
            ilosc: 1,
            klasa: 'Lanz1',
            typ: 'Audio'
        });
    }
    
    // NIE DODAJEMY centrali, licencji audio, rejestratorów ani dysków
    // Dodaj klucz USB SSV/CSV jeśli potrzebny dla braku LPR i Czerwonego światła
    if (!isLprEnabled && !isRedLightEnabled) {
        console.log(`Sprawdzam warunki dla klucza USB: Kamery=${connectedCamerasCount}, !LPR=${!isLprEnabled}, !RedLight=${!isRedLightEnabled}`);
        
        if (connectedCamerasCount <= 4 && connectedCamerasCount > 0) {
            console.log(`Dodaję Klucz USB SSV/CSV 4 (kamery <= 4): ${connectedCamerasCount}`);
            equipmentList.push({
                nazwa: 'Klucz USB SSV/CSV 4',
                ilosc: 1,
                klasa: 'brak',
                typ: 'klucz'
            });
        } else if (connectedCamerasCount > 4) {
            console.log(`Dodaję Klucz USB SSV/CSV (${connectedCamerasCount}) (kamery > 4)`);
            equipmentList.push({
                nazwa: `Klucz USB SSV/CSV (${connectedCamerasCount})`,
                ilosc: 1,
                klasa: 'brak',
                typ: 'klucz'
            });
        }
    }    
    // Policz urządzenia sieciowe bezpośrednio w liście
    let networkDeviceCount = 0;
    equipmentList.forEach(item => {
        if ((item.klasa === 'Lan' || item.klasa === 'Lanz' || item.klasa === 'Lanz1') && 
            !item.nazwa.includes('Switch')) {
            networkDeviceCount += item.ilosc;
        }
    });

    console.log(`Łączna liczba urządzeń sieciowych w nastawni ND-LCS ${objectId}: ${networkDeviceCount}`);

    // Dodaj odpowiedni switch i zasilacz na podstawie liczby urządzeń
    if (networkDeviceCount > 8) {
        console.log(`Dodaję duży switch CRS328-24p-4s dla ${networkDeviceCount} urządzeń`);
        equipmentList.push({
            nazwa: 'CRS328-24p-4s',
            ilosc: 1,
            klasa: 'LAN0',
            typ: 'switch'
        });
    } else {
        console.log(`Dodaję mały switch CRS112-8p-4S dla ${networkDeviceCount} urządzeń`);
        equipmentList.push({
            nazwa: 'CRS112-8p-4S',
            ilosc: 1,
            klasa: 'LAN0',
            typ: 'switch'
        });
    }
    
    // Sprawdź, czy na liście jest switch CRS112-8p-4S i dodaj zasilacz jeśli potrzeba
    const hasCRS112 = equipmentList.some(item => item.nazwa === 'CRS112-8p-4S');
    const hasPowerSupply = equipmentList.some(item => item.nazwa === 'Zasilacz Meanwell NDR-240-48');

    // Jeśli mamy CRS112-8p-4S i nie mamy jeszcze zasilacza, dodaj go
    if (hasCRS112 && !hasPowerSupply) {
        console.log('Dodaję zasilacz Meanwell NDR-240-48 dla switcha CRS112-8p-4S');
        equipmentList.push({
            nazwa: 'Zasilacz Meanwell NDR-240-48',
            ilosc: 1,
            klasa: 'Klasa-0',
            typ: 'zasilacz'
        });
    }

    // Dodaj przewody i przejściówki w zależności od typu komputera
    if (computerType === 'MINI PC') {
        // Dla MINI PC dodaj przejściówki DP-HDMI i przewody HDMI 3m w ilości równej liczbie monitorów
        equipmentList.push({
            nazwa: 'Przejściówka DP-HDMI',
            ilosc: monitorsCount,
            klasa: 'Klasa-0',
            typ: 'adapter'
        });
        
        equipmentList.push({
            nazwa: 'Przewód HDMI 3m',
            ilosc: monitorsCount,
            klasa: 'Klasa-0',
            typ: 'przewód'
        });
    } else if (computerType === 'PC') {
        // Dla PC dodaj przejściówki miniDP-HDMI i przewody HDMI 5m w ilości równej liczbie monitorów
        equipmentList.push({
            nazwa: 'Przejściówka miniDP-HDMI',
            ilosc: monitorsCount,
            klasa: 'Klasa-0',
            typ: 'adapter'
        });
        
        equipmentList.push({
            nazwa: 'Przewód HDMI 5m',
            ilosc: monitorsCount,
            klasa: 'Klasa-0',
            typ: 'przewód'
        });
    }
    
    // NIE DODAJEMY rejestratorów ani dysków
    
    // Dodaj wszystko do tabeli
    tableBody.innerHTML = '';
    equipmentList.forEach((item, idx) => {
        addNDLCSEquipmentRow(tableBody, idx, item.nazwa, item.ilosc);
    });
    
    updateGeneratorsSummaryTable();
}

/**
 * Dodaje wiersz wyposażenia do tabeli nastawni ND-LCS
 * @param {HTMLElement} tableBody - Element tbody tabeli
 * @param {number} index - Indeks elementu
 * @param {string} nazwa - Nazwa elementu
 * @param {number} ilosc - Ilość elementu
 */
function addNDLCSEquipmentRow(tableBody, index, nazwa, ilosc) {
    const row = document.createElement('tr');
    
    // Kolumna LP
    const lpCell = document.createElement('td');
    lpCell.textContent = index + 1;
    row.appendChild(lpCell);
    
    // Kolumna Nazwa
    const nameCell = document.createElement('td');
    nameCell.textContent = nazwa;
    row.appendChild(nameCell);
    
    // Kolumna Ilość
    const qtyCell = document.createElement('td');
    
    if (typeof ilosc === 'number') {
        if (ilosc === 1) {
            qtyCell.innerHTML = `<span class="state-static">1</span>`;
        } else {
            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'state-input';
            qtyInput.min = 0;
            qtyInput.value = ilosc;
            qtyInput.step = 1;
            qtyInput.required = true;
            qtyInput.addEventListener('input', updateGeneratorsSummaryTable);
            qtyCell.appendChild(qtyInput);
        }
    } else if (ilosc && /^\d+$/.test(ilosc)) {
        qtyCell.innerHTML = `<span class="state-static">${ilosc}</span>`;
    } else {
        qtyCell.innerHTML = `<span class="state-static">1</span>`;
    }
    
    row.appendChild(qtyCell);
    tableBody.appendChild(row);
}

/**
 * Aktualizuje wyposażenie nastawni ND-LCS na podstawie ustawień kreatora
 * @param {number} objectId - ID nastawni
 */
function updateNDLCSEquipment(objectId) {
    const tableBody = document.querySelector(`#nastawniaTable_${objectId} tbody`);
    if (tableBody) {
        tableBody.innerHTML = '';
        generateNDLCSEquipment(objectId, tableBody);
    }
}