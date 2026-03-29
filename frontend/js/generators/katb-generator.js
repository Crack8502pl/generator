/**
 * Generator KAT B - Rozszerzona implementacja z zaawansowaną konfiguracją rejestratora
 */

// Sprawdzenie dostępności tablicy KATB_DATA
if (typeof KATB_DATA === 'undefined') {
    console.error("Błąd: Brak dostępu do tablicy KATB_DATA!");
}


/**
 * Generuje kreator i tabelę KAT B dla danego obiektu
 * @param {number} objectId - ID obiektu
 */
function generateKATBTable(objectId) {
    console.log("Inicjalizacja generatora KAT B dla obiektu ID:", objectId);
    
    // Czekamy na załadowanie DOM
    document.addEventListener('DOMContentLoaded', function() {
        initKATBGenerator(objectId);
    });
    
    // Jeśli DOM jest już załadowany, inicjalizujemy natychmiast
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initKATBGenerator(objectId);
    }
}

/**
 * Inicjalizuje generator KAT B
 * @param {number} objectId - ID obiektu
 */
function initKATBGenerator(objectId) {
    // Sprawdź czy element kontenera istnieje
    const container = document.querySelector(`.object-item[id="object_${objectId}"]`);
    if (!container) {
        console.error(`Błąd: Nie znaleziono kontenera dla obiektu ID ${objectId}`);
        return;
    }
    
    // Sprawdź czy kategoria jest ustawiona na KAT B
    const isKATBSelected = container.querySelector('input[value="Kat B"]:checked');
    if (!isKATBSelected) {
        console.log(`Generator KAT B nie jest aktywny dla obiektu ID ${objectId}`);
        return;
    }
    
    // Przygotuj kontener dla kalkulatora, jeśli nie istnieje
    let calculatorDiv = container.querySelector('#KATBCalculator_' + objectId);
    if (!calculatorDiv) {
        calculatorDiv = document.createElement('div');
        calculatorDiv.id = 'KATBCalculator_' + objectId;
        calculatorDiv.className = 'calculator-container';
        
        // Znajdź miejsce do wstawienia kalkulatora
        const categoryContainer = container.querySelector('.category-container');
        if (categoryContainer) {
            categoryContainer.appendChild(calculatorDiv);
        } else {
            container.appendChild(calculatorDiv);
        }
    }
    
    // Utwórz kontener dla wyników
    let resultsContainer = calculatorDiv.querySelector('.KATB-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'KATB-results';
        calculatorDiv.appendChild(resultsContainer);
    }
    
    // Przygotuj kreator
    let creatorDiv = calculatorDiv.querySelector('.katb-creator');
    if (!creatorDiv) {
        creatorDiv = document.createElement('div');
        creatorDiv.className = 'katb-creator';
        calculatorDiv.insertBefore(creatorDiv, resultsContainer);
    }
    
    // Wypełnij kreator
    creatorDiv.innerHTML = `
        <div class="creator-header">
            <h3>Kreator KAT B</h3>
            <p class="info-text">Wybierz parametry do wygenerowania tabeli</p>
        </div>
        <div class="creator-form">
            <div class="creator-item">
                <label for="slup_count_${objectId}">Ilość słupów:</label>
                <select id="slup_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="camera_count_${objectId}">Ilość kamer:</label>
                <select id="camera_count_${objectId}" class="creator-select camera-count-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="camera_lpr_count_${objectId}">Ilość kamer LPR:</label>
                <select id="camera_lpr_count_${objectId}" class="creator-select camera-count-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <button type="button" id="generate_katb_${objectId}" class="update-katb-btn">Generuj tabelę KAT B</button>
            </div>
        </div>
    `;
    
    // Dodaj sekcję konfiguracji rejestratora NAD tabelą
    const existingConfig = calculatorDiv.querySelector('.recorder-config');
    if (existingConfig) {
        existingConfig.remove();
    }
    
    // Utwórz nową sekcję konfiguracji rejestratora
    const recorderConfigDiv = document.createElement('div');
    recorderConfigDiv.className = 'recorder-config';
    recorderConfigDiv.innerHTML = `
        <div class="section-header">
            <h3>Konfiguracja rejestratora</h3>
        </div>
        <div class="recorder-options">
            <label for="recording_days_${objectId}">Liczba dni zapisu:</label>
            <select id="recording_days_${objectId}" class="recording-days-select">
                <option value="7">7 dni</option>
                <option value="14" selected>14 dni</option>
                <option value="21">21 dni</option>
                <option value="28">28 dni</option>
                <option value="30">30 dni</option>
                <option value="60">60 dni</option>
            </select>
            
            <label for="recorder_model_${objectId}">Model rejestratora:</label>
            <select id="recorder_model_${objectId}" class="recorder-model-select">
                <option value="auto">Automatyczny dobór</option>
                <option value="WJ-NU101">WJ-NU101 (1-4 kamery)</option>
                <option value="WJ-NU300">WJ-NU300 (5-16 kamer)</option>
                <option value="WJ-NU301">WJ-NU301 (5-16 kamer, podwójne dyski)</option>
                <option value="WJ-NX310">WJ-NX310 (17-32 kamery)</option>
                <option value="WJ-NX410">WJ-NX410 (33-64 kamery)</option>
				<option value="WJ-NX510">WJ-NX510 (65-128 kamery)</option>
            </select>
        </div>
        
        <div id="recorder_requirements_${objectId}" class="recorder-requirements"></div>
        <div id="recorder_info_${objectId}" class="recorder-info"></div>
        <div id="storage_status_${objectId}" class="storage-status"></div>
        
        <div class="disk-config-container" id="disk_config_container_${objectId}" style="display: none;">
            <h4>Konfiguracja dysków</h4>
            <div class="disk-slots" id="disk_slots_${objectId}">
                <!-- Sloty na dyski będą dodane dynamicznie -->
            </div>
        </div>
    `;
    
    // Wstaw konfigurację przed tabelą
    calculatorDiv.insertBefore(recorderConfigDiv, resultsContainer);
    
    // Utwórz tabelę jeśli nie istnieje
    let tableElement = resultsContainer.querySelector(`table`);
    if (!tableElement) {
        tableElement = document.createElement('table');
        tableElement.id = `KATBTable_${objectId}`;
        tableElement.innerHTML = `
            <thead>
                <tr>
                    <th>L.p.</th>
                    <th>Nazwa</th>
                    <th>Ilość</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        resultsContainer.appendChild(tableElement);
    }
    
    // Dodaj event listenery
    const generateButton = document.getElementById(`generate_katb_${objectId}`);
    const cameraCounts = document.querySelectorAll(`#KATBCalculator_${objectId} .camera-count-select`);
    const recordingDays = document.getElementById(`recording_days_${objectId}`);
    const recorderModel = document.getElementById(`recorder_model_${objectId}`);
    
	// Event listenery dla elementów wpływających na obliczenia
	if (cameraCounts) {
		cameraCounts.forEach(select => {
			select.addEventListener('change', function() {
				updateRecorderInfoForKATB(objectId);
			});
		});
	}

	if (recordingDays) {
		recordingDays.addEventListener('change', function() {
			updateRecorderInfoForKATB(objectId);
		});
	}

	if (recorderModel) {
		recorderModel.addEventListener('change', function() {
			updateRecorderInfoForKATB(objectId);
		});
	}
    
    // Przycisk generowania tabeli
    if (generateButton) {
        generateButton.replaceWith(generateButton.cloneNode(true));
        document.getElementById(`generate_katb_${objectId}`).addEventListener('click', function() {
            generateKATBTableFromCreator(objectId);
        });
    }
    
    // Początkowe obliczenie wymagań rejestratora
    updateRecorderInfoForKATB(objectId);
    
    // Wygeneruj tabelę z domyślnymi wartościami
    generateKATBTableFromCreator(objectId);
    console.log("Generator KAT B zainicjalizowany dla obiektu ID:", objectId);
}

/**
 * Aktualizuje informacje o rejestratorze dla KAT B
 * @param {number} objectId - ID obiektu
 */
function updateRecorderInfoForKATB(objectId) {
    const cameraCount = parseInt(document.getElementById(`camera_count_${objectId}`).value) || 2;
    const cameraLPRCount = parseInt(document.getElementById(`camera_lpr_count_${objectId}`).value) || 2;
    const totalCameras = cameraCount + cameraLPRCount;
    
    const recorderInfoDiv = document.getElementById(`recorder_info_${objectId}`);
    const recorderRequirementsDiv = document.getElementById(`recorder_requirements_${objectId}`);
    const recorderModelSelect = document.getElementById(`recorder_model_${objectId}`);
    const recordingDaysSelect = document.getElementById(`recording_days_${objectId}`);
    const diskConfigContainer = document.getElementById(`disk_config_container_${objectId}`);
    const diskSlotsContainer = document.getElementById(`disk_slots_${objectId}`);
    const storageStatusDiv = document.getElementById(`storage_status_${objectId}`);
    
    if (!recorderInfoDiv || !recorderRequirementsDiv || !recorderModelSelect || !recordingDaysSelect) return;
    
    const selectedModel = recorderModelSelect.value;
    const recordingDays = parseInt(recordingDaysSelect.value);
    
    // Oblicz wymaganą pojemność
    const requiredStorage = calculateRequiredStorage(totalCameras, recordingDays);
    
    // Aktualizuj informacje o wymaganiach
    recorderRequirementsDiv.innerHTML = `
        <strong>Aktualne wymagania:</strong><br>
        • Liczba standardowych kamer: ${cameraCount}<br>
        • Liczba kamer LPR: ${cameraLPRCount}<br>
        • Wymagana pojemność dla ${recordingDays} dni zapisu: ${requiredStorage.toFixed(2)} TB<br>
    `;
    
    let finalRecorderModel = '';
    let recommendedDiskSizes = [];
    let diskSlots = 0;
    let recorderCount = 1;
    
    if (selectedModel === 'auto') {
        // Dla wyboru automatycznego
        const recommendedRecorder = determineRecorderModel(totalCameras, requiredStorage);
        
        if (recommendedRecorder) {
            const recorderInfo = getRecorderInfo(recommendedRecorder.model);
            finalRecorderModel = recommendedRecorder.model;
            diskSlots = recommendedRecorder.diskSlots;
            
            recorderInfoDiv.innerHTML = `
                <strong>Rekomendowany rejestrator (${recommendedRecorder.model}):</strong><br>
                • Maksymalna liczba kamer: ${recorderInfo?.maxCameras || 'N/A'}<br>
                • Liczba kieszeni na dyski: ${recommendedRecorder.diskSlots}<br>
                • Maksymalna pojemność: ${recommendedRecorder.maxStorage} TB<br>
                ${recommendedRecorder.warning ? `<span class="warning">⚠️ ${recommendedRecorder.warning}</span>` : '<span class="success">✅ Zgodny z wymaganiami</span>'}
            `;
            
            // Aktualizuj nazwę rejestratora w tabeli
            updateRecorderNameInTable(objectId, recommendedRecorder.model, 1);
            
            // Oblicz zalecane dyski
            recommendedDiskSizes = calculateRecommendedDisks(
                recommendedRecorder.model,
                requiredStorage,
                recommendedRecorder.diskSlots
            );
        } else {
            recorderInfoDiv.innerHTML = `
                <strong>Informacje o rejestratorze:</strong><br>
                <span class="info">ℹ️ Rejestrator nie jest wymagany (brak kamer)</span>
            `;
            
            // Wyczyść nazwę rejestratora w tabeli
            updateRecorderNameInTable(objectId, "Brak", 0);
            diskConfigContainer.style.display = 'none';
            storageStatusDiv.innerHTML = '';
        }
    } else {
        // Dla ręcznego wyboru
        const recorderInfo = getRecorderInfo(selectedModel);
        finalRecorderModel = selectedModel;
        
        if (recorderInfo) {
            diskSlots = recorderInfo.diskSlots;
            
            // Sprawdź zgodność z wymaganiami
            let warningMessage = '';
            let isCompatible = true;
            
            // Oblicz ile sztuk rejestratora będzie potrzebnych
            if (totalCameras > recorderInfo.maxCameras) {
                recorderCount = Math.ceil(totalCameras / recorderInfo.maxCameras);
                warningMessage += `<span class="warning">⚠️ Liczba kamer (${totalCameras}) przekracza maksymalną obsługiwaną przez pojedynczy rejestrator (${recorderInfo.maxCameras})</span><br>`;
                warningMessage += `<span class="info">ℹ️ Zostanie dodanych ${recorderCount} szt. rejestratora ${selectedModel}, aby obsłużyć wszystkie kamery</span><br>`;
                isCompatible = false;
            }
            
            // Sprawdź czy pojemność jest wystarczająca
            if (requiredStorage > recorderInfo.maxStorage) {
                if (recorderInfo.maxStorageWithExtension) {
                    if (requiredStorage > recorderInfo.maxStorageWithExtension) {
                        warningMessage += `<span class="warning">⚠️ Wymagana pojemność (${requiredStorage.toFixed(2)} TB) przekracza maksymalną (${recorderInfo.maxStorageWithExtension} TB)</span><br>`;
                        isCompatible = false;
                    } else {
                        warningMessage += `<span class="warning">⚠️ Wymagana pojemność (${requiredStorage.toFixed(2)} TB) wymaga jednostki rozszerzającej ${recorderInfo.extensionUnit}</span><br>`;
                    }
                } else {
                    warningMessage += `<span class="warning">⚠️ Wymagana pojemność (${requiredStorage.toFixed(2)} TB) przekracza maksymalną (${recorderInfo.maxStorage} TB)</span><br>`;
                    isCompatible = false;
                }
            }
            
            recorderInfoDiv.innerHTML = `
                <strong>Wybrany rejestrator (${selectedModel}):</strong><br>
                • Maksymalna liczba kamer: ${recorderInfo.maxCameras}<br>
                • Liczba kieszeni na dyski: ${recorderInfo.diskSlots}<br>
                • Maksymalna pojemność: ${recorderInfo.maxStorage} TB<br>
                ${warningMessage || (isCompatible ? '<span class="success">✅ Zgodny z wymaganiami</span>' : '')}
            `;
            
            // Aktualizuj nazwę rejestratora w tabeli z uwzględnieniem liczby sztuk
            updateRecorderNameInTable(objectId, selectedModel, recorderCount);
            
            // Oblicz zalecane dyski
            recommendedDiskSizes = calculateRecommendedDisks(
                selectedModel,
                requiredStorage / recorderCount, // Podziel wymaganą pojemność przez liczbę rejestratorów
                recorderInfo.diskSlots
            );
        } else {
            recorderInfoDiv.innerHTML = `
                <strong>Informacje o rejestratorze:</strong><br>
                <span class="warning">⚠️ Nie znaleziono informacji o wybranym modelu</span>
            `;
            
            // Wyczyść nazwę rejestratora w tabeli
            updateRecorderNameInTable(objectId, "Nieznany model", 1);
            diskConfigContainer.style.display = 'none';
            storageStatusDiv.innerHTML = '';
        }
    }
    
    // Aktualizuj konfigurację dysków
    if (totalCameras > 0 && diskSlots > 0) {
        diskConfigContainer.style.display = 'block';
        diskSlotsContainer.innerHTML = '';
        
		// Użyj DISK_CAPACITIES z recorder-manager.js
		const availableDiskCapacities = window.DISK_CAPACITIES ? window.DISK_CAPACITIES[finalRecorderModel] || window.DISK_CAPACITIES['default'] : [6, 8, 10, 12, 14, 18, 24];
        
        for (let i = 0; i < diskSlots; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'disk-slot';
            
            const diskSizeSelect = document.createElement('select');
            diskSizeSelect.id = `disk_size_${objectId}_${i}`;
            diskSizeSelect.className = 'disk-size-select';
            
            // Dodaj opcję "Brak dysku"
            const noDiskOption = document.createElement('option');
            noDiskOption.value = '0';
            noDiskOption.textContent = 'Brak dysku';
            diskSizeSelect.appendChild(noDiskOption);
            
            // Dodaj opcje dostępnych pojemności
            availableDiskCapacities.forEach(capacity => {
                const option = document.createElement('option');
                option.value = capacity;
                option.textContent = `${capacity} TB`;
                diskSizeSelect.appendChild(option);
                
                // Wybierz zalecaną pojemność dysku, jeśli jest dostępna
                if (recommendedDiskSizes[i] && capacity === recommendedDiskSizes[i]) {
                    option.selected = true;
                }
            });
            
            // Dodaj event listener do aktualizacji tabeli i statusu pojemności
            diskSizeSelect.addEventListener('change', function() {
                updateDiskInTable(objectId);
                updateStorageStatus(objectId, requiredStorage);
            });
            
            slotDiv.innerHTML = `<label for="disk_size_${objectId}_${i}">Dysk ${i+1}:</label>`;
            slotDiv.appendChild(diskSizeSelect);
            
            diskSlotsContainer.appendChild(slotDiv);
        }
        
        // Zaktualizuj tabelę na podstawie początkowej konfiguracji dysków
        updateDiskInTable(objectId);
        
        // Zaktualizuj status pojemności dyskowej
        updateStorageStatus(objectId, requiredStorage);
    } else {
        diskConfigContainer.style.display = 'none';
        storageStatusDiv.innerHTML = '';
    }
}

/**
 * Aktualizuje status pojemności dyskowej
 * @param {number} objectId - ID obiektu
 * @param {number} requiredStorage - Wymagana pojemność w TB
 */
function updateStorageStatus(objectId, requiredStorage) {
    // Jeśli jest dostępna funkcja z recorder-manager.js, użyj jej
    if (window.updateStorageStatus) {
        window.updateStorageStatus(objectId, requiredStorage);
        return;
    }
    
    // Oryginalna implementacja jako fallback
    const storageStatusDiv = document.getElementById(`storage_status_${objectId}`);
    const calculatorDiv = document.getElementById(`KATBCalculator_${objectId}`);
    
    if (!storageStatusDiv || !calculatorDiv) return;
    
    const recorderCount = parseInt(calculatorDiv.dataset.recorderCount) || 1;
    
    // Pobierz wszystkie wybrane dyski
    const diskSelects = calculatorDiv.querySelectorAll('.disk-size-select');
    if (!diskSelects.length) return;
    
    // Oblicz całkowitą dostępną pojemność
    const disks = Array.from(diskSelects).map(select => parseInt(select.value) || 0);
    const activeDisks = disks.filter(d => d > 0);
    const totalAvailableStorage = activeDisks.reduce((sum, size) => sum + size, 0) * recorderCount;
    
    // Aktualizuj status pojemności
    let statusHTML = `
        <strong>Status pojemności dyskowej:</strong><br>
        • Wymagana pojemność: ${requiredStorage.toFixed(2)} TB<br>
        • Dostępna pojemność: ${totalAvailableStorage} TB`;
    
    if (activeDisks.length > 0) {
        statusHTML += ` (${recorderCount > 1 ? recorderCount + ' x ' : ''}${activeDisks.length} ${activeDisks.length === 1 ? 'dysk' : activeDisks.length < 5 ? 'dyski' : 'dysków'}: ${activeDisks.join(', ')} TB)`;
    }
    statusHTML += '<br>';
    
    if (totalAvailableStorage < requiredStorage) {
        const shortage = requiredStorage - totalAvailableStorage;
        statusHTML += `<span class="warning">⚠️ Niewystarczająca pojemność! Brakuje ${shortage.toFixed(2)} TB do wymaganej ilości.</span>`;
    } else {
        const surplus = totalAvailableStorage - requiredStorage;
        const efficiency = requiredStorage / totalAvailableStorage * 100;
        statusHTML += `<span class="success">✅ Wystarczająca pojemność. Wykorzystanie: ${efficiency.toFixed(1)}%. Nadmiar: ${surplus.toFixed(2)} TB</span>`;
    }
    
    storageStatusDiv.innerHTML = statusHTML;
    storageStatusDiv.className = 'storage-status';
    
    // Zapisz dane o całkowitej pojemności do użycia przy generowaniu tabeli
    calculatorDiv.dataset.totalStorage = totalAvailableStorage;
}

/**
 * Aktualizuje nazwę rejestratora w tabeli
 * @param {number} objectId - ID obiektu
 * @param {string} recorderName - Nazwa rejestratora
 * @param {number} count - Liczba rejestratorów
 */
function updateRecorderNameInTable(objectId, recorderName, count) {
    const calculatorDiv = document.getElementById(`KATBCalculator_${objectId}`);
    if (calculatorDiv) {
        calculatorDiv.dataset.recorderName = recorderName;
        calculatorDiv.dataset.recorderCount = count;
    }
}

/**
 * Oblicza zalecane pojemności dysków - wybierając najmniejszą możliwą pojemność
 * @param {string} recorderModel - Model rejestratora
 * @param {number} requiredStorage - Wymagana pojemność w TB
 * @param {number} diskSlots - Liczba kieszeni na dyski
 * @returns {Array<number>} Lista zalecanych pojemności dysków
 */
function calculateRecommendedDisks(recorderModel, requiredStorage, diskSlots) {
    // Wykorzystaj funkcję z recorder-manager.js
    if (window.calculateOptimalDiskConfiguration) {
        const recorderInfo = window.getRecorderInfo(recorderModel);
        if (recorderInfo) {
            const diskConfig = window.calculateOptimalDiskConfiguration(recorderInfo, requiredStorage);
            return diskConfig.disksConfiguration;
        }
    }
    
    // Fallback - oryginalna implementacja (uproszczona)
    const result = [];
    // Pobierz dostępne pojemności dysków z recorder-manager.js
    const availableDiskCapacities = window.DISK_CAPACITIES ? 
        window.DISK_CAPACITIES[recorderModel] || window.DISK_CAPACITIES['default'] : 
        [6, 8, 10, 12, 14, 18, 24];
    
    // Sortujemy pojemności rosnąco
    const sortedCapacities = [...availableDiskCapacities].sort((a, b) => a - b);
    
    // Podstawowa logika wyboru dysków (uproszczona)
    const storagePerSlot = requiredStorage / diskSlots;
    
    for (let i = 0; i < diskSlots && requiredStorage > 0; i++) {
        let selectedCapacity = sortedCapacities[sortedCapacities.length - 1]; // Domyślnie największy
        
        // Znajdź najmniejszy dysk, który pomieści storagePerSlot
        for (const capacity of sortedCapacities) {
            if (capacity >= storagePerSlot) {
                selectedCapacity = capacity;
                break;
            }
        }
        
        result.push(selectedCapacity);
        requiredStorage -= selectedCapacity;
    }
    
    return result;
}

/**
 * Aktualizuje dyski w tabeli
 * @param {number} objectId - ID obiektu
 */
function updateDiskInTable(objectId) {
    const calculatorDiv = document.getElementById(`KATBCalculator_${objectId}`);
    if (!calculatorDiv) return;
    
    // Pobierz wszystkie wybrane dyski
    const diskSelects = calculatorDiv.querySelectorAll('.disk-size-select');
    if (!diskSelects.length) return;
    
    // Przygotuj dane o dyskach
    const disks = Array.from(diskSelects).map(select => parseInt(select.value)).filter(size => size > 0);
    
    // Zapisz dane o dyskach do atrybutu data
    calculatorDiv.dataset.disks = JSON.stringify(disks);
    
    // Pobierz wymaganą pojemność i aktualizuj status
    const recordingDays = parseInt(document.getElementById(`recording_days_${objectId}`).value) || 30;
    const cameraCount = parseInt(document.getElementById(`camera_count_${objectId}`).value) || 2;
    const cameraLPRCount = parseInt(document.getElementById(`camera_lpr_count_${objectId}`).value) || 2;
    const totalCameras = cameraCount + cameraLPRCount;
    const requiredStorage = calculateRequiredStorage(totalCameras, recordingDays);
    
    updateStorageStatus(objectId, requiredStorage);
    
    console.log(`Zaktualizowano konfigurację dysków: ${disks.join(', ')} TB`);
}

/**
 * Generuje tabelę KAT B na podstawie wyborów z kreatora
 * @param {number} objectId - ID obiektu
 */
function generateKATBTableFromCreator(objectId) {
    console.log("Generowanie tabeli KAT B dla obiektu ID:", objectId);
    
    // Sprawdź czy KATB_DATA istnieje
    if (typeof KATB_DATA === 'undefined' || !Array.isArray(KATB_DATA) || KATB_DATA.length === 0) {
        console.error("Błąd: Nieprawidłowa tablica KATB_DATA");
        return;
    }
    
    const tableBody = document.querySelector(`#KATBTable_${objectId} tbody`);
    if (!tableBody) {
        console.error(`Błąd: Nie znaleziono tbody tabeli dla obiektu ${objectId}`);
        return;
    }
    
    // Pobierz wartości z kreatora
    try {
        const slupCount = parseInt(document.getElementById(`slup_count_${objectId}`).value) || 2;
        const cameraCount = parseInt(document.getElementById(`camera_count_${objectId}`).value) || 2;
        const cameraLPRCount = parseInt(document.getElementById(`camera_lpr_count_${objectId}`).value) || 2;
        
        // Pobierz model rejestratora i dyski z konfiguracji
        const calculatorDiv = document.getElementById(`KATBCalculator_${objectId}`);
        const recorderModel = calculatorDiv.dataset.recorderName || 'Nieznany model';
        const recorderCount = parseInt(calculatorDiv.dataset.recorderCount) || 1;
        
        let disks = [];
        try {
            if (calculatorDiv.dataset.disks) {
                disks = JSON.parse(calculatorDiv.dataset.disks);
            }
        } catch (e) {
            console.error("Błąd podczas parsowania danych o dyskach:", e);
        }
        
        console.log(`Parametry KAT B: słupy=${slupCount}, kamery=${cameraCount}, kamery LPR=${cameraLPRCount}, rejestrator=${recorderModel}x${recorderCount}, dyski=${disks.join(', ')}TB`);
        
        // Wyczyść tabelę
        tableBody.innerHTML = '';
        
        // Tablica na wiersze tabeli
        const tableRows = [];
        let rowIndex = 1;
        
        // Funkcje pomocnicze
        function ceil(value, divisor) {
            return Math.ceil(value / divisor);
        }
        
        function addTableRow(name, quantity, klasa = 'klasa-0', typ = 'akcesoria') {
            const row = createTableRow(rowIndex++, name, quantity);
            // Dodaj dodatkowe atrybuty dla klasy i typu, jeśli są podane
            if (klasa) row.dataset.klasa = klasa;
            if (typ) row.dataset.typ = typ;
            tableRows.push(row);
        }
        
        // Sprawdzenie, czy nazwy elementów są dostępne w KATB_DATA
        const getNazwa = (idx) => {
            return KATB_DATA[idx] && KATB_DATA[idx].nazwa ? KATB_DATA[idx].nazwa : `Element ${idx}`;
        };
        
        // Obliczenia dla łącznej ilości urządzeń (często używane)
        const totalDevices = cameraCount + cameraLPRCount;
        
        // 1. Dodaj słupy (idx 17)
        addTableRow(getNazwa(17), slupCount);
        
        // 2. Dodaj kamery (idx 0)
        addTableRow(getNazwa(0), cameraCount);
        
        // 3. Dodaj kamery LPR (idx 21)
        addTableRow(getNazwa(21), cameraLPRCount);
        
        // 4. Dodaj iglicodaszek/kapturek (idx 15) = ilość słupów
        addTableRow(getNazwa(15), slupCount);
        
        // 5. Dodaj szafę terenową (idx 19) - zawsze 1
        addTableRow(getNazwa(19), 1);
        
        // 6. Dodaj uziom kompletny = słupy + szafa
        addTableRow("Uziom kompletny", slupCount + 1);
        
        // 7. Dodaj adapter nasłupowy (idx 1) = kamery + kamery LPR
        addTableRow(getNazwa(1), totalDevices);
        
        // 8. Dodaj puszkę (idx 2) = ilość kamer
        addTableRow(getNazwa(2), cameraCount);
        
        // 9. Dodaj przepięciówkę (idx 3) = kamery + kamery LPR
        addTableRow(getNazwa(3), totalDevices);
        
        // 10. Dodaj przepięciówkę 4 kanałową (idx 4) = ceil(totalDevices / 4)
        const przepieciowki4 = ceil(totalDevices, 4);
        addTableRow(getNazwa(4), przepieciowki4);
        
        // 11. Dodaj panel ochronny (idx 5) = ceil(przepieciowki4 / 4)
        addTableRow(getNazwa(5), ceil(przepieciowki4, 4));
        
        // 12. Dodaj zasilacz (idx 6) - zawsze 1
        addTableRow(getNazwa(6), 1);
        
        // 13. Dodaj przewód (idx 7) = totalDevices * 5 metrów
        addTableRow(getNazwa(7), totalDevices * 5 + " m");
        
        // 14. Dodaj keyston (idx 8) = totalDevices * 2
        addTableRow(getNazwa(8), totalDevices * 2);
        
        // 15. Dodaj przetwornicę (idx 9) - zawsze 1
        addTableRow(getNazwa(9), 1);
        
        // 16. Dodaj akumulator (idx 10) - zawsze 1
        addTableRow(getNazwa(10), 1);
        
        // 17. Dodaj przekaźnik (idx 11) - zawsze 1
        addTableRow(getNazwa(11), 1);
        
        // 18. Dodaj wtyki (idx 12) = totalDevices * 2
        addTableRow(getNazwa(12), totalDevices * 2);
        
        // 19. Dodaj moduł dozorowy (idx 13) - zawsze 1
        addTableRow(getNazwa(13), 1);
        
        // 20. Dodaj patchcord 0,5m (idx 14) = totalDevices
        addTableRow(getNazwa(14), totalDevices);
        
        // 21. Dodaj patchcord 2m (idx 16) - zawsze 1
        addTableRow(getNazwa(16), 1);
        
        // 22. Dodaj patchcord 0,25m (idx 18) = totalDevices * 4
        addTableRow(getNazwa(18), totalDevices * 4);
        
        // 23. Dodaj switch (idx 20) z odpowiednią nazwą
        // Dodatkowo dodajemy moduł (idx 24) do całkowitej liczby urządzeń
        const totalWithModule = totalDevices + 1; // +1 za moduł
        
        // Określ nazwę switcha na podstawie sumy urządzeń
        let switchName = totalWithModule >= 8 ? "Switch CRS328-24p-4s" : "Switch CRS112-8p-4s";
        
        // Dodaj wiersz switcha
        addTableRow(switchName, 1);
        
        // 24. Dodaj rejestrator - liczba zgodna z wyliczoną ilością
        if (recorderModel !== "Brak") {
            addTableRow(`Rejestrator ${recorderModel}`, recorderCount);
        }
        
        // 25. Dodaj idx 25 - zawsze 1
        addTableRow(getNazwa(25), 1);
        
        // 26. Dodaj tabliczkę - zawsze 2
        addTableRow("Tabliczka Przejazd Monitorowany Kompletna", 2, "klasa-0", "tabliczka");
        
        // 27. Dodaj dodatkowe akcesoria - zawsze 1
        addTableRow("Dodatkowe akcesoria montażowe (wago, Power Cord, ITP)", 1, "klasa-0", "akcesoria");
        
        // 28. Dodaj dyski twarde - uwzględniając liczbę rejestratorów i dyski w każdym
        if (disks.length > 0) {
            // Jeśli mamy więcej dysków tego samego typu, grupujemy je
            const diskCounts = {};
            disks.forEach(size => {
                diskCounts[size] = (diskCounts[size] || 0) + 1 * recorderCount; // Pomnóż przez liczbę rejestratorów
            });
            
            // Dodaj wpisy dla każdego typu dysku
            Object.entries(diskCounts).forEach(([size, count]) => {
                addTableRow(`Dysk twardy ${size}TB`, count, "klasa-0", "akcesoria");
            });
        } else {
            // Jeśli nie wybrano dysków, dodaj wpis informacyjny
            addTableRow("Dysk twardy (nie wybrano)", 0, "klasa-0", "akcesoria");
        }
        
        // Dodaj wszystkie wiersze do tabeli
        tableRows.forEach(row => tableBody.appendChild(row));
        
        // Aktualizuj podsumowanie generatorów
        if (typeof updateGeneratorsSummaryTable === 'function') {
            try {
                updateGeneratorsSummaryTable();
            } catch (error) {
                console.error("Błąd podczas aktualizacji podsumowania:", error);
            }
        } else {
            console.warn("Funkcja updateGeneratorsSummaryTable nie jest dostępna");
        }
        
        console.log(`Wygenerowano ${tableRows.length} elementów w tabeli KAT B`);
        
    } catch (error) {
        console.error("Wystąpił błąd podczas generowania tabeli KAT B:", error);
    }
}

/**
 * Tworzy wiersz tabeli z podanymi wartościami
 * @param {number} lp - Numer wiersza
 * @param {string} name - Nazwa elementu
 * @param {number|string} quantity - Ilość
 * @returns {HTMLTableRowElement} Utworzony wiersz tabeli
 */
function createTableRow(lp, name, quantity) {
    const row = document.createElement('tr');
    
    // Kolumna L.P.
    const lpCell = document.createElement('td');
    lpCell.textContent = lp;
    row.appendChild(lpCell);
    
    // Kolumna Nazwa
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    row.appendChild(nameCell);
    
    // Kolumna Ilość
    const qtyCell = document.createElement('td');
    qtyCell.textContent = quantity;
    row.appendChild(qtyCell);
    
    return row;
}