/**
 * Moduł zarządzający rejestratorami dla nastawni
 */

// Dane o rejestratorach
const RECORDERS_DATA = [
    {
        model: 'WJ-NU101',
        minCameras: 1,
        maxCameras: 4,
        diskSlots: 1,
        maxStorage: 24,
        forLcs: true,
        supportedDiskSizes: [6, 8, 10, 12, 14, 18, 24] // Obsługiwane pojemności dysków w TB
    },
    {
        model: 'WJ-NU300',
        minCameras: 5,
        maxCameras: 16,
        diskSlots: 1,
        maxStorage: 24,
        forLcs: true,
        supportedDiskSizes: [6, 8, 10, 12, 14, 18, 24]
    },
    {
        model: 'WJ-NU301',
        minCameras: 5,
        maxCameras: 16,
        diskSlots: 2,
        maxStorage: 48,
        forLcs: true,
        supportedDiskSizes: [6, 8, 10, 12, 14, 18, 24]
    },
    {
        model: 'WJ-NX310',
        minCameras: 17,
        maxCameras: 32,
        diskSlots: 4,
        maxStorage: 72,
        forLcs: true,
        supportedDiskSizes: [6, 8, 10, 12, 14, 18]
    },
    {
        model: 'WJ-NX410',
        minCameras: 33,
        maxCameras: 64,
        diskSlots: 9,
        maxStorage: 216,
        forLcs: true,
        supportedDiskSizes: [6, 8, 10, 12, 14, 18, 24]
    },
    {
        model: 'WJ-NX510',
        minCameras: 65,
        maxCameras: 128,
        diskSlots: 9,
        maxStorage: 216,
        maxStorageWithExtension: 1296,
        extensionUnit: 'WJ-HXE410',
        forLcs: true,
        supportedDiskSizes: [6, 8, 10, 12, 14, 18, 24]
    }
];

/**
 * Dostępne pojemności dysków dla poszczególnych rejestratorów
 */
const DISK_CAPACITIES = {
    'WJ-NU101': [6, 8, 10, 12, 14, 18, 24],
    'WJ-NU300': [6, 8, 10, 12, 14, 18, 24],
    'WJ-NU301': [6, 8, 10, 12, 14, 18, 24],
    'WJ-NX310': [6, 8, 10, 12, 14, 18],
    'WJ-NX410': [6, 8, 10, 12, 14, 18, 24],
    'WJ-NX510': [6, 8, 10, 12, 14, 18, 24],
    'default': [6, 8, 10, 12, 14, 18, 24]
};

/**
 * Sprawdza czy obiekt jest podłączony do nastawni z LCS
 * @param {string} objectId - ID obiektu
 * @returns {boolean} Czy obiekt jest podłączony do nastawni z LCS
 */
function isObjectConnectedToLCS(objectId) {
    const nastawnie = document.querySelectorAll('.nastawnia-item');
    
    for (const nastawnia of nastawnie) {
        const nastawniaId = nastawnia.id.split('_')[1];
        const lcsCheckbox = document.getElementById(`lcs_${nastawniaId}`);
        
        // Jeśli ta nastawnia ma LCS
        if (lcsCheckbox && lcsCheckbox.checked) {
            // Sprawdź czy obiekt jest do niej podłączony
            const connectedObjects = document.querySelectorAll(`#connectedObjects_${nastawniaId} input[type="checkbox"]:checked`);
            for (const checkbox of connectedObjects) {
                if (checkbox.value === objectId) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

/**
 * Liczy kamery w obiektach SKP i KAT A podłączonych do nastawni
 * @param {number} nastawniaId - ID nastawni
 * @returns {number} Liczba kamer
 */
function countSKPAndKATACameras(nastawniaId) {
    const connectedObjects = document.querySelectorAll(`#connectedObjects_${nastawniaId} input[type="checkbox"]:checked`);
    let cameraCount = 0;
    
    for (const checkbox of connectedObjects) {
        const objId = checkbox.value;
        // Pomiń nastawnie
        if (objId.includes('nastawnia_')) continue;
        
        // Pomiń obiekty podłączone do innej nastawni z LCS (jeśli ta nastawnia nie jest LCS)
        const thisNastawniaLcs = document.getElementById(`lcs_${nastawniaId}`)?.checked;
        if (!thisNastawniaLcs && isObjectConnectedToLCS(objId)) continue;
        
        const objectElement = document.getElementById(`object_${objId}`);
        if (!objectElement) continue;
        
        // Sprawdź czy to SKP lub KAT A
        const skpRadio = objectElement.querySelector('input[id^="skp_"]:checked');
        const katARadio = objectElement.querySelector('input[id^="KATa_"]:checked');
        
        if (skpRadio || katARadio) {
            // Znajdź wszystkie kamery w obiekcie
            let tableSelector = skpRadio ? '.skp-results tbody' : '.KATa-results tbody';
            
            const rows = objectElement.querySelectorAll(`${tableSelector} tr`);
            rows.forEach(row => {
                const nameCell = row.querySelector('td:nth-child(2)');
                if (nameCell && (
                    nameCell.textContent.includes('Kamera') || 
                    nameCell.textContent.includes('Kamra')
                )) {
                    const qtyCell = row.querySelector('td:nth-child(3)');
                    if (qtyCell) {
                        const qtyInput = qtyCell.querySelector('input');
                        const qty = qtyInput ? parseInt(qtyInput.value) || 0 : parseInt(qtyCell.textContent.trim()) || 0;
                        cameraCount += qty;
                    }
                }
            });
        }
    }
    
    // Jeśli to LCS, dodaj kamery z podłączonych nastawni bez LCS
    const isLcs = document.getElementById(`lcs_${nastawniaId}`)?.checked;
    if (isLcs) {
        // Sprawdź podłączone nastawnie
        for (const checkbox of connectedObjects) {
            const objId = checkbox.value;
            // Weź pod uwagę tylko podłączone nastawnie
            if (!objId.includes('nastawnia_')) continue;
            
            const connectedNastawniaId = objId.split('_')[1];
            const connectedNastawniaLcs = document.getElementById(`lcs_${connectedNastawniaId}`)?.checked;
            
            // Jeśli podłączona nastawnia nie jest LCS, dodaj jej kamery
            if (!connectedNastawniaLcs) {
                cameraCount += countSKPAndKATACameras(connectedNastawniaId);
            }
        }
    }
    
    return cameraCount;
}

/**
 * Oblicza wymaganą pojemność zapisu dla określonej liczby kamer i dni zapisu
 * @param {number} cameraCount - Liczba kamer
 * @param {number} recordingDays - Liczba dni zapisu
 * @returns {number} Wymagana pojemność w TB
 */
function calculateRequiredStorage(cameraCount, recordingDays) {
    // Wzór: (liczba_kamer * 4) * (liczba_dni_zapisu * 0.0108) TB
    return (cameraCount * 4) * (recordingDays * 0.0108);
}

/**
 * Oblicza optymalną konfigurację dysków dla rejestratora
 * @param {Object} recorder - Informacje o rejestratorze
 * @param {number} requiredStorage - Wymagana pojemność w TB
 * @returns {Object} Informacje o optymalnej konfiguracji dysków
 */
function calculateOptimalDiskConfiguration(recorder, requiredStorage) {
    if (!recorder || !recorder.supportedDiskSizes || recorder.supportedDiskSizes.length === 0) {
        return {
            minimumRequiredSlots: 0,
            disksConfiguration: [],
            totalStorage: 0
        };
    }
    
    // Sprawdź, czy nawet największy dysk w każdej kieszeni nie pokryje wymaganej pojemności
    const availableDiskCapacities = DISK_CAPACITIES[recorder.model] || DISK_CAPACITIES['default'];
    const sortedCapacities = [...availableDiskCapacities].sort((a, b) => a - b);
    const maxDiskSize = sortedCapacities[sortedCapacities.length - 1];
    const diskSlots = recorder.diskSlots;
    
    const maxPossibleStorage = maxDiskSize * diskSlots;
    if (maxPossibleStorage < requiredStorage) {
        return {
            minimumRequiredSlots: diskSlots,
            disksConfiguration: Array(diskSlots).fill(maxDiskSize),
            totalStorage: maxPossibleStorage,
            insufficient: true
        };
    }
    
    // Funkcja do obliczania optymalnej konfiguracji dysków
    function findOptimalConfiguration() {
        const result = new Array(diskSlots).fill(0);
        
        // Obliczamy podstawową pojemność na kieszeń
        const storagePerSlot = requiredStorage / diskSlots;
        let remainingStorage = requiredStorage;
        
        // Wypełniamy kieszenie na dyski optymalnie - zaczynając od najmniejszych pojemności
        for (let i = 0; i < diskSlots && remainingStorage > 0; i++) {
            // Znajdź najmniejszą pojemność, która spełnia wymagania
            let selectedCapacity = 0;
            
            // Znajdź najmniejszy dysk, który pomieści storagePerSlot
            for (const capacity of sortedCapacities) {
                if (capacity >= storagePerSlot) {
                    selectedCapacity = capacity;
                    break;
                }
            }
            
            // Jeśli nie znaleziono odpowiedniej pojemności, weź największą dostępną
            if (selectedCapacity === 0) {
                // Jeśli pozostało mało miejsca do zapisania, wybierz najmniejszy dysk
                if (remainingStorage < sortedCapacities[0]) {
                    selectedCapacity = sortedCapacities[0];
                } else {
                    // W przeciwnym razie wybierz najmniejszy dysk, który pomieści pozostałą pojemność
                    for (const capacity of sortedCapacities) {
                        if (capacity >= remainingStorage) {
                            selectedCapacity = capacity;
                            break;
                        }
                    }
                    
                    // Jeśli nadal nie znaleziono, użyj największego dostępnego
                    if (selectedCapacity === 0) {
                        selectedCapacity = sortedCapacities[sortedCapacities.length - 1];
                    }
                }
            }
            
            result[i] = selectedCapacity;
            remainingStorage -= selectedCapacity;
        }
        
        // Oblicz całkowitą pojemność
        const totalStorage = result.reduce((sum, size) => sum + size, 0);
        
        return {
            minimumRequiredSlots: result.filter(size => size > 0).length,
            disksConfiguration: result,
            totalStorage: totalStorage
        };
    }
    
    return findOptimalConfiguration();
}

/**
 * Określa model rejestratora na podstawie liczby kamer i pojemności zapisu
 * @param {number} cameraCount - Liczba kamer
 * @param {number} storageTB - Wymagana pojemność w TB
 * @returns {Object|null} Informacja o rejestratorze lub null jeśli nie jest potrzebny
 */
function determineRecorderModel(cameraCount, storageTB) {
    if (cameraCount === 0) {
        return null; // Nie ma kamer, nie potrzeba rejestratora
    }
    
    let selectedRecorder = null;
    
    // Szukamy odpowiedniego rejestratora na podstawie liczby kamer
    for (const recorder of RECORDERS_DATA) {
        if (cameraCount >= recorder.minCameras && cameraCount <= recorder.maxCameras) {
            // Dla WJ-NU300 i WJ-NU301 mamy dodatkowe sprawdzenie pojemności
            if (recorder.model === 'WJ-NU300' && storageTB > recorder.maxStorage) {
                continue; // Przejdź do kolejnego (WJ-NU301)
            } else if (recorder.model === 'WJ-NU301' && storageTB <= RECORDERS_DATA[1].maxStorage) {
                continue; // Lepiej użyć WJ-NU300
            }
            
            selectedRecorder = recorder;
            break;
        }
    }
    
    // Jeśli nie znaleziono dopasowania, sprawdź największy dostępny rejestrator
    if (!selectedRecorder && cameraCount > 0) {
        const lastRecorder = RECORDERS_DATA[RECORDERS_DATA.length - 1];
        if (cameraCount > lastRecorder.maxCameras) {
            // Oblicz wymaganą liczbę rejestratorów
            const recorderCount = Math.ceil(cameraCount / lastRecorder.maxCameras);
            
            return {
                model: lastRecorder.model,
                nazwa: `Rejestrator ${lastRecorder.model}`,
                ilosc: recorderCount,
                klasa: 'Lanz',
                typ: 'NVR',
                warning: `Liczba kamer (${cameraCount}) przekracza maksymalną obsługiwaną przez pojedynczy rejestrator (${lastRecorder.maxCameras}). Wymaganych jest ${recorderCount} rejestratorów.`
            };
        }
    }
    
    if (selectedRecorder) {
        // Oblicz wymaganą liczbę rejestratorów
        let recorderCount = 1;
        if (cameraCount > selectedRecorder.maxCameras) {
            recorderCount = Math.ceil(cameraCount / selectedRecorder.maxCameras);
        }
        
        // Podziel wymaganą pojemność na liczbę rejestratorów
        const storagePerRecorder = storageTB / recorderCount;
        
        // Oblicz optymalną konfigurację dysków
        const diskConfig = calculateOptimalDiskConfiguration(selectedRecorder, storagePerRecorder);
        
        // Sprawdź czy pojemność jest wystarczająca
        let warning = null;
        if (storagePerRecorder > diskConfig.totalStorage) {
            if (selectedRecorder.maxStorageWithExtension) {
                if (storagePerRecorder > selectedRecorder.maxStorageWithExtension) {
                    warning = `Wymagana pojemność zapisu (${storageTB.toFixed(2)} TB) przekracza maksymalną pojemność (${selectedRecorder.maxStorageWithExtension * recorderCount} TB dla ${recorderCount} rejestratorów)`;
                } else {
                    warning = `Wymagana pojemność zapisu (${storageTB.toFixed(2)} TB) wymaga jednostki rozszerzającej ${selectedRecorder.extensionUnit}`;
                }
            } else {
                warning = `Wymagana pojemność zapisu (${storageTB.toFixed(2)} TB) przekracza maksymalną pojemność (${selectedRecorder.maxStorage * recorderCount} TB dla ${recorderCount} rejestratorów)`;
            }
        }
        
        // Dodaj informację o wielu rejestratorach jeśli jest ich więcej niż 1
        if (recorderCount > 1 && !warning) {
            warning = `Liczba kamer (${cameraCount}) wymaga ${recorderCount} rejestratorów`;
        }
        
        return {
            model: selectedRecorder.model,
            nazwa: `Rejestrator ${selectedRecorder.model}`,
            ilosc: recorderCount,
            klasa: 'Lanz',
            typ: 'NVR',
            warning: warning,
            diskSlots: selectedRecorder.diskSlots,
            requiredDiskSlots: diskConfig.minimumRequiredSlots,
            disksConfiguration: diskConfig.disksConfiguration,
            maxStorage: selectedRecorder.maxStorage,
            totalStorage: diskConfig.totalStorage * recorderCount
        };
    }
    
    return null;
}

/**
 * Sprawdza czy nastawnia wymaga rejestratora
 * @param {number} nastawniaId - ID nastawni
 * @returns {Object|null} Informacja o rejestratorze lub null jeśli nie jest potrzebny
 */
function checkIfRecorderNeeded(nastawniaId) {
    // Sprawdź czy to nastawnia z LCS lub nastawnia bez LCS niepodłączona do LCS
    const isLcs = document.getElementById(`lcs_${nastawniaId}`)?.checked;
    const connectedToLcs = isNastawiaConnectedToLCS(nastawniaId);
    
    // Jeśli to nastawnia bez LCS podłączona do LCS, nie potrzeba rejestratora
    if (!isLcs && connectedToLcs) {
        return null;
    }
    
    // Policz kamery w podłączonych obiektach SKP i KAT A
    const cameraCount = countSKPAndKATACameras(nastawniaId);
    
    // Jeśli są kamery, określ pojemność zapisu
    if (cameraCount > 0) {
        // Pobierz liczbę dni zapisu
        const recordingDaysSelect = document.getElementById(`recording_days_${nastawniaId}`);
        const recordingDays = parseInt(recordingDaysSelect?.value) || 7;
        
        // Oblicz wymaganą pojemność
        const requiredStorage = calculateRequiredStorage(cameraCount, recordingDays);
        
        // Określ model rejestratora
        return determineRecorderModel(cameraCount, requiredStorage);
    }
    
    return null; // Nie ma kamer, nie potrzeba rejestratora
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
 * Pobiera wszystkie dostępne modele rejestratorów
 * @returns {Array} Lista modeli rejestratorów
 */
function getAllRecorderModels() {
    return RECORDERS_DATA.map(recorder => recorder.model);
}

/**
 * Pobiera informacje o konkretnym modelu rejestratora
 * @param {string} model - Model rejestratora
 * @returns {Object|null} Informacje o rejestratorze lub null jeśli nie znaleziono
 */
function getRecorderInfo(model) {
    return RECORDERS_DATA.find(recorder => recorder.model === model) || null;
}

/**
 * Aktualizuje status pojemności dyskowej
 * @param {number} nastawniaId - ID nastawni
 * @param {number} requiredStorage - Wymagana pojemność w TB
 */
function updateStorageStatus(nastawniaId, requiredStorage) {
    const storageStatusDiv = document.getElementById(`storage_status_${nastawniaId}`);
    if (!storageStatusDiv) return;
    
    const recorderInfoDiv = document.getElementById(`recorder_info_${nastawniaId}`);
    const recorderCount = parseInt(recorderInfoDiv?.dataset.recorderCount) || 1;
    
    // Pobierz wszystkie wybrane dyski
    const diskSelects = document.querySelectorAll(`[id^="diskSlot_${nastawniaId}_"]`);
    if (!diskSelects.length) return;
    
    // Oblicz całkowitą dostępną pojemność
    const disks = Array.from(diskSelects).map(select => parseInt(select.value) || 0);
    const activeDisks = disks.filter(d => d > 0);
    const totalAvailableStorage = activeDisks.reduce((sum, size) => sum + size, 0) * recorderCount;
    
    // Aktualizuj status pojemności
    let statusHTML = `
        <div class="storage-status-header">
            <strong>Status pojemności dyskowej:</strong>
        </div>
        <div class="storage-status-details">
            <div class="storage-status-item">
                <span class="status-label">Wymagana pojemność:</span>
                <span class="status-value">${requiredStorage.toFixed(2)} TB</span>
            </div>
            <div class="storage-status-item">
                <span class="status-label">Dostępna pojemność:</span>
                <span class="status-value">${totalAvailableStorage} TB</span>
                ${activeDisks.length > 0 ? 
                    `<span class="status-info">(${recorderCount > 1 ? recorderCount + ' x ' : ''}${activeDisks.length} ${activeDisks.length === 1 ? 'dysk' : activeDisks.length < 5 ? 'dyski' : 'dysków'}: ${activeDisks.join(', ')} TB)</span>` : 
                    ''}
            </div>
    `;
    
    if (totalAvailableStorage < requiredStorage) {
        const shortage = requiredStorage - totalAvailableStorage;
        statusHTML += `
            <div class="storage-status-item status-warning">
                <span class="status-icon">⚠️</span>
                <span>Niewystarczająca pojemność! Brakuje ${shortage.toFixed(2)} TB.</span>
            </div>
        `;
    } else {
        const surplus = totalAvailableStorage - requiredStorage;
        const efficiency = requiredStorage / totalAvailableStorage * 100;
        statusHTML += `
            <div class="storage-status-item status-success">
                <span class="status-icon">✅</span>
                <span>Wystarczająca pojemność. Wykorzystanie: ${efficiency.toFixed(1)}%. Nadmiar: ${surplus.toFixed(2)} TB</span>
            </div>
        `;
    }
    
    statusHTML += `</div>`;
    
    storageStatusDiv.innerHTML = statusHTML;
    storageStatusDiv.className = 'storage-status-container';
    
    // Zapisz dane dla późniejszego użycia
    recorderInfoDiv.dataset.totalStorage = totalAvailableStorage;
}

/**
 * Zapisuje ręczną konfigurację dysków
 * @param {number} nastawniaId - ID nastawni
 * @param {string} recorderModel - Model rejestratora
 * @param {Array} configuration - Konfiguracja dysków
 */
function saveManualDiskConfiguration(nastawniaId, recorderModel, configuration) {
    // Filtruj puste kieszenie (dyski o wartości 0)
    const nonEmptyConfiguration = configuration.filter(size => size > 0);
    
    // Używamy localStorage do przechowywania konfiguracji
    const storageKey = `diskConfig_${nastawniaId}_${recorderModel}`;
    localStorage.setItem(storageKey, JSON.stringify(nonEmptyConfiguration));
}

/**
 * Pobiera zapisaną ręczną konfigurację dysków
 * @param {number} nastawniaId - ID nastawni
 * @param {string} recorderModel - Model rejestratora
 * @returns {Array|null} Konfiguracja dysków lub null jeśli nie znaleziono
 */
function getManualDiskConfiguration(nastawniaId, recorderModel) {
    const storageKey = `diskConfig_${nastawniaId}_${recorderModel}`;
    const storedConfig = localStorage.getItem(storageKey);
    
    if (storedConfig) {
        try {
            const config = JSON.parse(storedConfig);
            return Array.isArray(config) ? config : null;
        } catch (e) {
            console.error("Błąd odczytu konfiguracji dysków:", e);
            return null;
        }
    }
    
    return null;
}

/**
 * Czyści zapisaną ręczną konfigurację dysków
 * @param {number} nastawniaId - ID nastawni
 * @param {string} recorderModel - Model rejestratora (opcjonalnie)
 */
function clearManualDiskConfiguration(nastawniaId, recorderModel = null) {
    if (recorderModel) {
        // Usuń konfigurację dla konkretnego modelu
        const storageKey = `diskConfig_${nastawniaId}_${recorderModel}`;
        localStorage.removeItem(storageKey);
    } else {
        // Usuń wszystkie konfiguracje dla danej nastawni
        // Znajdź wszystkie klucze zawierające id nastawni
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`diskConfig_${nastawniaId}_`)) {
                keysToRemove.push(key);
            }
        }
        
        // Usuń znalezione klucze
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}

/**
 * Konfiguruje obsługę zdarzeń dla interfejsu konfiguracji dysków
 * @param {number} nastawniaId - ID nastawni
 */
function setupDiskConfigEvents(nastawniaId) {
    // Przyciski przełączające tryb konfiguracji
    const autoConfigBtn = document.getElementById(`autoConfigDisk_${nastawniaId}`);
    const manualConfigBtn = document.getElementById(`manualConfigDisk_${nastawniaId}`);
    
    if (autoConfigBtn) {
        autoConfigBtn.addEventListener('click', () => {
            // Usuń zapisaną ręczną konfigurację
            clearManualDiskConfiguration(nastawniaId);
            // Odśwież UI
            updateRecorderInfo(nastawniaId);
            // Aktualizuj wyposażenie
            updateNastawniaEquipment(nastawniaId);
        });
    }
    
    if (manualConfigBtn) {
        manualConfigBtn.addEventListener('click', () => {
            // Pobierz aktualną konfigurację automatyczną jako punkt startowy
            const recorderSelect = document.getElementById(`recorder_model_${nastawniaId}`);
            const selectedModel = recorderSelect.value;
            const recorderInfo = getRecorderInfo(selectedModel);
            
            if (recorderInfo) {
                const recordingDays = parseInt(document.getElementById(`recording_days_${nastawniaId}`)?.value) || 7;
                const cameraCount = countSKPAndKATACameras(nastawniaId);
                const requiredStorage = calculateRequiredStorage(cameraCount, recordingDays);
                
                // Oblicz optymalną konfigurację jako punkt startowy
                const recorderInfoDiv = document.getElementById(`recorder_info_${nastawniaId}`);
                const recorderCount = parseInt(recorderInfoDiv?.dataset.recorderCount) || 1;
                const diskConfig = calculateOptimalDiskConfiguration(recorderInfo, requiredStorage / recorderCount);
                
                // Zapisz jako ręczną konfigurację
                saveManualDiskConfiguration(nastawniaId, selectedModel, diskConfig.disksConfiguration);
                
                // Odśwież UI
                updateRecorderInfo(nastawniaId);
            }
        });
    }
    
    // Obsługa zmiany wyboru dysków
    const diskSelects = document.querySelectorAll(`[id^="diskSlot_${nastawniaId}_"]`);
    diskSelects.forEach(select => {
        select.addEventListener('change', () => {
            // Pobierz aktualną konfigurację dysków
            const configuration = [];
            for (let i = 0; i < diskSelects.length; i++) {
                const slotSelect = document.getElementById(`diskSlot_${nastawniaId}_${i}`);
                if (slotSelect) {
                    configuration[i] = parseInt(slotSelect.value) || 0;
                } else {
                    configuration[i] = 0;
                }
            }
            
            // Aktualizuj sumę pojemności
            const totalStorage = configuration.reduce((sum, size) => sum + size, 0);
            const storageSpan = document.getElementById(`currentStorage_${nastawniaId}`);
            if (storageSpan) storageSpan.textContent = totalStorage + " TB";
            
            // Pobierz wymaganą pojemność
            const recordingDays = parseInt(document.getElementById(`recording_days_${nastawniaId}`)?.value) || 7;
            const cameraCount = countSKPAndKATACameras(nastawniaId);
            const requiredStorage = calculateRequiredStorage(cameraCount, recordingDays);
            
            // Aktualizuj status pojemności dyskowej
            updateStorageStatus(nastawniaId, requiredStorage);
            
            // Zapisz konfigurację
            const recorderSelect = document.getElementById(`recorder_model_${nastawniaId}`);
            const selectedModel = recorderSelect.value;
            saveManualDiskConfiguration(nastawniaId, selectedModel, configuration);
            
            // Aktualizuj wyposażenie
            updateNastawniaEquipment(nastawniaId);
        });
    });
}

/**
 * Aktualizuje informacje o wybranym rejestratorze w UI
 * @param {number} nastawniaId - ID nastawni
 */
function updateRecorderInfo(nastawniaId) {
    const recorderSelect = document.getElementById(`recorder_model_${nastawniaId}`);
    const recorderInfoDiv = document.getElementById(`recorder_info_${nastawniaId}`);
    const recorderRequirementsDiv = document.getElementById(`recorder_requirements_${nastawniaId}`);
    
    if (!recorderSelect || !recorderInfoDiv || !recorderRequirementsDiv) return;
    
    const selectedModel = recorderSelect.value;
    
    // Pobierz liczbę kamer i wymaganą pojemność
    const cameraCount = countSKPAndKATACameras(nastawniaId);
    const recordingDays = parseInt(document.getElementById(`recording_days_${nastawniaId}`)?.value) || 7;
    const requiredStorage = calculateRequiredStorage(cameraCount, recordingDays);
    
    // Aktualizuj informacje o wymaganiach
    recorderRequirementsDiv.innerHTML = `
        <div class="requirements-header">
            <strong>Aktualne wymagania:</strong>
        </div>
        <div class="requirements-details">
            <div class="requirement-item">
                <span class="requirement-icon">🎥</span>
                <span class="requirement-label">Liczba wykrytych kamer:</span>
                <span class="requirement-value">${cameraCount}</span>
            </div>
            <div class="requirement-item">
                <span class="requirement-icon">💾</span>
                <span class="requirement-label">Wymagana pojemność dla ${recordingDays} dni zapisu:</span>
                <span class="requirement-value">${requiredStorage.toFixed(2)} TB</span>
            </div>
        </div>
    `;
    
    // Funkcja tworząca interfejs konfiguracji dysków
    function createDiskConfigUI(recorderInfo, diskConfig, isAutoConfig = false) {
        if (!recorderInfo || !diskConfig) return '';
        
        const availableDiskCapacities = DISK_CAPACITIES[recorderInfo.model] || DISK_CAPACITIES['default'];
        let diskConfigUI = `
            <div class="disk-config-container" id="diskConfigContainer_${nastawniaId}">
                <div class="disk-config-header">
                    <strong>Konfiguracja dysków:</strong>
                    <div class="disk-config-actions">
                        <button type="button" id="autoConfigDisk_${nastawniaId}" class="auto-config-btn" 
                                ${isAutoConfig ? 'disabled' : ''}>Automatycznie</button>
                        <button type="button" id="manualConfigDisk_${nastawniaId}" class="manual-config-btn"
                                ${!isAutoConfig ? 'disabled' : ''}>Ręcznie</button>
                    </div>
                </div>
                <div class="disk-slots-container" id="diskSlotsContainer_${nastawniaId}">
        `;
        
        // Jeśli mamy konfigurację automatyczną
        if (isAutoConfig) {
            // Pokaż automatyczną konfigurację
            if (diskConfig.disksConfiguration && diskConfig.disksConfiguration.length > 0) {
                const nonEmptyDisks = diskConfig.disksConfiguration.filter(size => size > 0);
                diskConfigUI += `
                    <div class="auto-disk-config">
                        <div class="disk-config-summary">
                            <div class="summary-item">
                                <span class="summary-label">Optymalna konfiguracja dysków:</span>
                                <span class="summary-value">${nonEmptyDisks.map(size => `${size}TB`).join(' + ')}</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Wykorzystane kieszenie:</span>
                                <span class="summary-value">${diskConfig.minimumRequiredSlots || nonEmptyDisks.length} z ${recorderInfo.diskSlots}</span>
                            </div>
                            <div class="summary-item">
                                <span class="summary-label">Łączna pojemność:</span>
                                <span class="summary-value">${diskConfig.totalStorage} TB</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                diskConfigUI += `<p class="no-disks">Brak dysków do skonfigurowania</p>`;
            }
        } else {
            // Pokaż interfejs ręcznej konfiguracji
            diskConfigUI += `<div class="manual-disk-slots">`;
            for (let i = 0; i < recorderInfo.diskSlots; i++) {
                const currentDiskSize = diskConfig.disksConfiguration && diskConfig.disksConfiguration[i] ? diskConfig.disksConfiguration[i] : 0;
                
                diskConfigUI += `
                    <div class="disk-slot">
                        <label for="diskSlot_${nastawniaId}_${i}">Kieszeń ${i+1}:</label>
                        <select id="diskSlot_${nastawniaId}_${i}" class="disk-size-select" data-slot="${i}" data-nastawnia="${nastawniaId}">
                            <option value="0">Pusty</option>
                            ${availableDiskCapacities.map(size => `<option value="${size}" ${currentDiskSize === size ? 'selected' : ''}>${size} TB</option>`).join('')}
                        </select>
                    </div>
                `;
            }
            diskConfigUI += `</div>`;
            
            // Dodaj podsumowanie
            diskConfigUI += `
                <div id="diskConfigSummary_${nastawniaId}" class="disk-config-summary-manual">
                    <div class="summary-item">
                        <span class="summary-label">Aktualna pojemność:</span>
                        <span class="summary-value" id="currentStorage_${nastawniaId}">${diskConfig.totalStorage || 0} TB</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Wymagana pojemność:</span>
                        <span class="summary-value">${requiredStorage.toFixed(2)} TB</span>
                    </div>
                </div>
            `;
        }
        
        diskConfigUI += `
                </div>
            </div>
        `;
        
        return diskConfigUI;
    }
    
    let recorderCount = 1;
    recorderInfoDiv.dataset.recorderCount = recorderCount;
    
    if (selectedModel === 'auto') {
        // Dla wyboru automatycznego
        const recommendedRecorder = checkIfRecorderNeeded(nastawniaId);
        
        if (recommendedRecorder) {
            const recorderInfo = getRecorderInfo(recommendedRecorder.model);
            
            // Ustaw liczbę rejestratorów
            recorderCount = recommendedRecorder.ilosc || 1;
            recorderInfoDiv.dataset.recorderCount = recorderCount;
            
            const diskConfig = calculateOptimalDiskConfiguration(recorderInfo, requiredStorage / recorderCount);
            const diskConfigUI = createDiskConfigUI(recorderInfo, diskConfig, true);
            
            recorderInfoDiv.innerHTML = `
                <div class="recorder-info-header">
                    <strong>Informacje o rekomendowanym rejestratorze (${recommendedRecorder.model}):</strong>
                </div>
                <div class="recorder-info-details">
                    <div class="recorder-info-item">
                        <span class="info-icon">📹</span>
                        <span class="info-label">Maksymalna liczba kamer:</span>
                        <span class="info-value">${recorderInfo?.maxCameras || 'N/A'}</span>
                    </div>
                    <div class="recorder-info-item">
                        <span class="info-icon">💿</span>
                        <span class="info-label">Liczba kieszeni na dyski:</span>
                        <span class="info-value">${recommendedRecorder.diskSlots}</span>
                    </div>
                    ${recorderCount > 1 ? `
                    <div class="recorder-info-item recorder-count">
                        <span class="info-icon">🔢</span>
                        <span class="info-label">Wymagana liczba rejestratorów:</span>
                        <span class="info-value">${recorderCount}</span>
                    </div>` : ''}
                    <div class="recorder-info-item">
                        <span class="info-icon">${recommendedRecorder.warning ? '⚠️' : '✅'}</span>
                        <span class="info-value">${recommendedRecorder.warning || 'Zgodny z wymaganiami'}</span>
                    </div>
                </div>
                ${diskConfigUI}
            `;
            
            // Aktualizuj status pojemności dyskowej
            updateStorageStatus(nastawniaId, requiredStorage);
        } else {
            recorderInfoDiv.innerHTML = `
                <div class="recorder-info-header">
                    <strong>Informacje o rejestratorze:</strong>
                </div>
                <div class="recorder-info-details">
                    <div class="recorder-info-item">
                        <span class="info-icon">ℹ️</span>
                        <span class="info-value">Rejestrator nie jest wymagany dla tej nastawni</span>
                    </div>
                </div>
            `;
            
            // Wyczyść status pojemności
            const storageStatusDiv = document.getElementById(`storage_status_${nastawniaId}`);
            if (storageStatusDiv) storageStatusDiv.innerHTML = '';
        }
    } else {
        // Dla ręcznego wyboru
        const recorderInfo = getRecorderInfo(selectedModel);
        
        if (recorderInfo) {
            // Sprawdź czy mamy zapisaną ręczną konfigurację
            let manualConfig = getManualDiskConfiguration(nastawniaId, selectedModel);
            let isManualMode = manualConfig !== null;
            
            // Oblicz wymaganą liczbę rejestratorów
            if (cameraCount > recorderInfo.maxCameras) {
                recorderCount = Math.ceil(cameraCount / recorderInfo.maxCameras);
                recorderInfoDiv.dataset.recorderCount = recorderCount;
            }
            
            // Jeśli nie ma ręcznej konfiguracji, oblicz automatyczną
            const diskConfig = isManualMode ? 
                { disksConfiguration: manualConfig, totalStorage: manualConfig.reduce((sum, size) => sum + size, 0) } : 
                calculateOptimalDiskConfiguration(recorderInfo, requiredStorage / recorderCount);
            
            // Interfejs konfiguracji dysków
            const diskConfigUI = createDiskConfigUI(recorderInfo, diskConfig, !isManualMode);
            
            // Sprawdź zgodność z wymaganiami
            let warningMessage = '';
            let isCompatible = true;
            
            if (cameraCount > recorderInfo.maxCameras) {
                warningMessage += `<div class="warning-item"><span class="warning-icon">⚠️</span> Liczba kamer (${cameraCount}) przekracza maksymalną obsługiwaną (${recorderInfo.maxCameras}). Potrzeba ${recorderCount} rejestratorów.</div>`;
                isCompatible = false;
            }
            
            if (requiredStorage > diskConfig.totalStorage * recorderCount) {
                if (recorderInfo.maxStorageWithExtension) {
                    if (requiredStorage > recorderInfo.maxStorageWithExtension) {
                        warningMessage += `<div class="warning-item"><span class="warning-icon">⚠️</span> Wymagana pojemność (${requiredStorage.toFixed(2)} TB) przekracza maksymalną (${recorderInfo.maxStorageWithExtension} TB)</div>`;
                        isCompatible = false;
                    } else {
                        warningMessage += `<div class="warning-item"><span class="warning-icon">⚠️</span> Wymagana pojemność (${requiredStorage.toFixed(2)} TB) wymaga jednostki rozszerzającej ${recorderInfo.extensionUnit}</div>`;
                    }
                } else {
                    warningMessage += `<div class="warning-item"><span class="warning-icon">⚠️</span> Wymagana pojemność (${requiredStorage.toFixed(2)} TB) przekracza maksymalną (${recorderInfo.maxStorage} TB)</div>`;
                    isCompatible = false;
                }
            }
            
            // Sprawdź czy ta nastawnia powinna mieć rejestrator
            const isLcs = document.getElementById(`lcs_${nastawniaId}`)?.checked;
            const connectedToLcs = isNastawiaConnectedToLCS(nastawniaId);
            
            if (!isLcs && connectedToLcs) {
                warningMessage += `<div class="warning-item"><span class="warning-icon">ℹ️</span> Nastawnia bez LCS podłączona do nastawni z LCS zwykle nie wymaga rejestratora</div>`;
            }
            
            recorderInfoDiv.innerHTML = `
                <div class="recorder-info-header">
                    <strong>Informacje o rejestratorze (${recorderInfo.model}):</strong>
                </div>
                <div class="recorder-info-details">
                    <div class="recorder-info-item">
                        <span class="info-icon">📹</span>
                        <span class="info-label">Maksymalna liczba kamer:</span>
                        <span class="info-value">${recorderInfo.maxCameras}</span>
                    </div>
                    <div class="recorder-info-item">
                        <span class="info-icon">💿</span>
                        <span class="info-label">Liczba kieszeni na dyski:</span>
                        <span class="info-value">${recorderInfo.diskSlots}</span>
                    </div>
                    ${recorderCount > 1 ? `
                    <div class="recorder-info-item recorder-count">
                        <span class="info-icon">🔢</span>
                        <span class="info-label">Wymagana liczba rejestratorów:</span>
                        <span class="info-value">${recorderCount}</span>
                    </div>` : ''}
                    ${warningMessage ? `<div class="recorder-warnings">${warningMessage}</div>` : 
                    (isCompatible ? '<div class="recorder-info-item success"><span class="info-icon">✅</span> <span>Zgodny z wymaganiami</span></div>' : '')}
                </div>
                ${diskConfigUI}
            `;
            
            // Aktualizuj status pojemności dyskowej
            updateStorageStatus(nastawniaId, requiredStorage);
        } else {
            recorderInfoDiv.innerHTML = `
                <div class="recorder-info-header">
                    <strong>Informacje o rejestratorze:</strong>
                </div>
                <div class="recorder-info-details">
                    <div class="recorder-info-item warning">
                        <span class="info-icon">⚠️</span>
                        <span class="info-value">Nie znaleziono informacji o wybranym modelu</span>
                    </div>
                </div>
            `;
            
            // Wyczyść status pojemności
            const storageStatusDiv = document.getElementById(`storage_status_${nastawniaId}`);
            if (storageStatusDiv) storageStatusDiv.innerHTML = '';
        }
    }
    
    // Dodaj obsługę zdarzeń po załadowaniu UI
    setTimeout(() => {
        setupDiskConfigEvents(nastawniaId);
    }, 100);
}

// Eksportuj funkcje do globalnej przestrzeni nazw
window.checkIfRecorderNeeded = checkIfRecorderNeeded;
window.countSKPAndKATACameras = countSKPAndKATACameras;
window.calculateRequiredStorage = calculateRequiredStorage;
window.getAllRecorderModels = getAllRecorderModels;
window.getRecorderInfo = getRecorderInfo;
window.updateRecorderInfo = updateRecorderInfo;
window.calculateOptimalDiskConfiguration = calculateOptimalDiskConfiguration;
window.updateStorageStatus = updateStorageStatus;
window.saveManualDiskConfiguration = saveManualDiskConfiguration;
window.getManualDiskConfiguration = getManualDiskConfiguration;
window.clearManualDiskConfiguration = clearManualDiskConfiguration;
window.setupDiskConfigEvents = setupDiskConfigEvents;