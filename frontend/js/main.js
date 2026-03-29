/**
 * Główny plik JavaScript zarządzający aplikacją
 */

let objectCounter = 0;
let nastawniaCounter = 0;

// Referencje do elementów DOM
const addObjectBtn = document.getElementById('addObjectBtn');
const addNastawniaBtn = document.getElementById('addNastawniaBtn');
const objectsContainer = document.getElementById('objectsContainer');
const objectsList = document.getElementById('objectsList');
const generatorsSummaryTableContainer = document.getElementById('generatorsSummaryTableContainer');
const downloadSummaryBtn = document.getElementById('downloadSummaryBtn');
const taskForm = document.getElementById('taskForm');
const results = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');
const submitBtn = document.getElementById('submitBtn');

// Dodawanie event listenerów
addObjectBtn.addEventListener('click', appendChild);
addNastawniaBtn.addEventListener('click', addNastawnia);
taskForm.addEventListener('submit', handleSubmit);
if (downloadSummaryBtn) {
    downloadSummaryBtn.addEventListener('click', downloadSummaryCSV);
}

/**
 * Formatuje numer kilometra, uzupełniając zerami z lewej strony jeśli potrzeba
 * @param {string} value - Wartość do sformatowania
 * @returns {string} Sformatowany numer kilometra
 */
function formatKilometer(value) {
    // Usuwamy wszystko co nie jest cyfrą
    value = value.replace(/[^\d]/g, '');
    
    // Jeśli wartość ma mniej niż 6 cyfr, dopełniamy zerami z lewej strony
    if (value.length > 0 && value.length < 6) {
        value = value.padStart(6, '0');
    }
    
    // Format XXX,XXX
    if (value.length === 6) {
        return `Km ${value.substring(0, 3)},${value.substring(3)}`;
    } else {
        return value;
    }
}

/**
 * Funkcja dodająca obiekt
 */
function appendChild() {
    objectCounter++;
    if (objectsContainer.classList.contains('empty')) {
        objectsContainer.classList.remove('empty');
        objectsContainer.innerHTML = '<div id="objectsList"></div>';
    }
    const objectDiv = document.createElement('div');
    objectDiv.className = 'object-item';
    objectDiv.id = `object_${objectCounter}`;
    objectDiv.innerHTML = `
		<hr class="object-divider">
		<div class="object-header">
            <h3 class="object-title">🎯 <span id="objectTitle_${objectCounter}">Km 000,000</span></h3>
            <button type="button" class="remove-object-btn" onclick="removeObject(${objectCounter})" title="Usuń obiekt">✕</button>
        </div>
        <div class="form-group">
            <label for="objectName_${objectCounter}">Nazwa obiektu (format: Km XXX,XXX):</label>
            <div class="name-input-container">
                <input type="text" id="objectName_${objectCounter}" name="objectName_${objectCounter}" 
                       class="km-input" placeholder="Wpisz 3-6 cyfr (np. 123456)" maxlength="10" required>
                <button type="button" id="confirmName_${objectCounter}" class="confirm-name-btn">✓ Zatwierdź</button>
                <button type="button" id="editName_${objectCounter}" class="edit-name-btn hidden">✏️ Edytuj</button>
            </div>
        </div>
        <div class="section-header">
            <h3>Kategoria</h3>
        </div>
        <div class="form-group">
            <div class="radio-group">
                <div class="radio-option">
                    <input type="radio" id="skp_${objectCounter}" name="category_${objectCounter}" value="SKP" required>
                    <label for="skp_${objectCounter}">SKP</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="KATa_${objectCounter}" name="category_${objectCounter}" value="Kat A" required>
                    <label for="KATa_${objectCounter}">Kat A</label>
                </div>
                <div class="radio-option">
                    <input type="radio" id="KATB_${objectCounter}" name="category_${objectCounter}" value="Kat B" required>
                    <label for="KATB_${objectCounter}">Kat B</label>
                </div>
            </div>
        </div>
        <div id="categoryCalculators_${objectCounter}">
            <!-- Kalkulatory będą wyświetlane dynamicznie tutaj -->
        </div>
    `;
    const objectsListDiv = document.getElementById('objectsList');
    if (objectsListDiv.firstChild) {
        objectsListDiv.insertBefore(objectDiv, objectsListDiv.firstChild);
    } else {
        objectsListDiv.appendChild(objectDiv);
    }
    setupObjectEventListeners(objectCounter);
    updateSubmitButton();
    updateGeneratorsSummaryTable();
    
    // Po dodaniu nowego obiektu aktualizujemy listę połączonych obiektów we wszystkich nastawniach
    updateConnectedObjectsForAllNastawnie();
}

/**
 * Funkcja dodająca nastawnie
 */
function addNastawnia() {
    nastawniaCounter++;
    if (objectsContainer.classList.contains('empty')) {
        objectsContainer.classList.remove('empty');
        objectsContainer.innerHTML = '<div id="objectsList"></div>';
    }
    const nastawniaDiv = document.createElement('div');
    nastawniaDiv.className = 'nastawnia-item';
    nastawniaDiv.id = `nastawnia_${nastawniaCounter}`;
    nastawniaDiv.innerHTML = `
		<hr class="object-divider">
        <div class="object-header">
            <br>
			<h3 class="nastawnia-title">🏢 <span id="nastawniaTitle_${nastawniaCounter}">Nastawnia ${nastawniaCounter}</span></h3>
            <button type="button" class="remove-object-btn" onclick="removeNastawnia(${nastawniaCounter})" title="Usuń nastawnie">✕</button>
        </div>
        <div class="form-group">
            <label for="nastawniaName_${nastawniaCounter}">Nazwa nastawni:</label>
            <div class="name-input-container">
                <input type="text" id="nastawniaName_${nastawniaCounter}" name="nastawniaName_${nastawniaCounter}" 
                       placeholder="Wprowadź nazwę nastawni" required>
                <button type="button" id="confirmNastawniaName_${nastawniaCounter}" class="confirm-name-btn">✓ Zatwierdź</button>
                <button type="button" id="editNastawniaName_${nastawniaCounter}" class="edit-name-btn hidden">✏️ Edytuj</button>
            </div>
        </div>
        <div class="section-header">
            <h3>Dodatkowe opcje</h3>
        </div>
        <div class="form-group">
            <div class="nastawnia-options">
                <div class="option-item">
                    <input type="checkbox" id="lpr_${nastawniaCounter}" name="lpr_${nastawniaCounter}">
                    <label for="lpr_${nastawniaCounter}">🔍🚗 LPR</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="redLight_${nastawniaCounter}" name="redLight_${nastawniaCounter}">
                    <label for="redLight_${nastawniaCounter}">🚦🚄 Czerwone światło</label>
                </div>
                <div class="option-item">
                    <input type="checkbox" id="lcs_${nastawniaCounter}" name="lcs_${nastawniaCounter}">
                    <label for="lcs_${nastawniaCounter}">🏢↻ LCS</label>
                </div>
            </div>
        </div>
        <div class="section-header">
            <h3>Połączone obiekty</h3>
        </div>
        <div class="form-group">
            <label>Wybierz obiekty połączone z nastawnią:</label>
            <div id="connectedObjects_${nastawniaCounter}" class="checkbox-group">
                <p style="color: #666; font-style: italic;">Brak dostępnych obiektów. Dodaj obiekty najpierw.</p>
            </div>
        </div>
        <div id="nastawniaCalculators_${nastawniaCounter}">
            <div id="nastawniaCalculator_${nastawniaCounter}" class="nastawnia-calculator">
                <h3>Kalkulator Nastawni</h3>
                <div class="nastawnia-results">
                    <table id="nastawniaTable_${nastawniaCounter}">
                        <thead>
                            <tr>
                                <th>L.P.</th>
                                <th>Nazwa</th>
                                <th>Ilość</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    const objectsListDiv = document.getElementById('objectsList');
    if (objectsListDiv.firstChild) {
        objectsListDiv.insertBefore(nastawniaDiv, objectsListDiv.firstChild);
    } else {
        objectsListDiv.appendChild(nastawniaDiv);
    }
    setupNastawniaEventListeners(nastawniaCounter);
    updateConnectedObjectsForAllNastawnie();
    updateSubmitButton();
    updateGeneratorsSummaryTable();
}

/**
 * Sprawdza typ SMOK/CMOK dla nastawni na podstawie zaznaczonych obiektów
 * @param {number} nastawniaId - ID nastawni
 * @returns {string} Typ SMOK/CMOK ('A', 'B', lub puste jeśli nieokreślony)
 */
function getNastawniaSmokType(nastawniaId) {
    const connectedObjectsDiv = document.getElementById(`connectedObjects_${nastawniaId}`);
    if (!connectedObjectsDiv) return '';
    
    let hasSkpOrKatA = false;
    let hasKatB = false;
    
    // Sprawdzamy wszystkie zaznaczone checkboxy
    const checkboxes = connectedObjectsDiv.querySelectorAll('input[type="checkbox"]:checked');
    
    for (const checkbox of checkboxes) {
        const objId = checkbox.value;
        const objectElement = document.getElementById(`object_${objId}`);
        
        // Pomijamy jeśli to nie obiekt (może być nastawnia)
        if (!objectElement) continue;
        
        // Sprawdzamy kategorię obiektu
        const skpRadio = objectElement.querySelector('input[id^="skp_"]:checked');
        const katARadio = objectElement.querySelector('input[id^="KATa_"]:checked');
        const katBRadio = objectElement.querySelector('input[id^="KATB_"]:checked');
        
        if (skpRadio || katARadio) {
            hasSkpOrKatA = true;
        } else if (katBRadio) {
            hasKatB = true;
        }
    }
    
    // Określenie typu SMOK/CMOK
    if (hasSkpOrKatA && !hasKatB) return 'A';
    if (hasKatB && !hasSkpOrKatA) return 'B';
    return ''; // Nieokreślony jeśli mieszany lub żaden
}

/**
 * Aktualizacja listy dostępnych obiektów dla wszystkich nastawni
 * uwzględniająca zachowanie zaznaczonych obiektów i logikę SMOK/CMOK
 */
function updateConnectedObjectsForAllNastawnie() {
    const nastawnie = document.querySelectorAll('.nastawnia-item');
    
    nastawnie.forEach(nastawnia => {
        const id = nastawnia.id.split('_')[1];
        updateConnectedObjectsOptions(id);
    });
}

/**
 * Aktualizacja opcji połączonych obiektów dla konkretnej nastawni
 * @param {number} nastawniaId - ID nastawni
 */
function updateConnectedObjectsOptions(nastawniaId) {
    const connectedObjectsDiv = document.getElementById(`connectedObjects_${nastawniaId}`);
    const lcsCheckbox = document.getElementById(`lcs_${nastawniaId}`);
    const isLcsEnabled = lcsCheckbox && lcsCheckbox.checked;
    
    // Pobierz wszystkie obiekty i nastawnie
    const objects = document.querySelectorAll('.object-item');
    const nastawnie = document.querySelectorAll('.nastawnia-item');
    
    if (objects.length === 0 && nastawnie.length <= 1) {
        connectedObjectsDiv.innerHTML = '<p style="color: #666; font-style: italic;">Brak dostępnych obiektów. Dodaj obiekty najpierw.</p>';
        return;
    }

    // Zapisz aktualnie zaznaczone obiekty
    const selectedConnections = Array.from(connectedObjectsDiv.querySelectorAll('input[type="checkbox"]:checked'))
                                    .map(cb => cb.value);
    
    // Określenie typu SMOK/CMOK dla tej nastawni
    let currentSmokType = getNastawniaSmokType(nastawniaId);
    
    let optionsHTML = '';
    
    // Dodaj opcje dla obiektów
    objects.forEach(obj => {
        const objId = obj.id.split('_')[1];
        const objNameInput = document.getElementById(`objectName_${objId}`);
        const objName = objNameInput ? objNameInput.value || `Obiekt ${objId}` : `Obiekt ${objId}`;
        
        // Sprawdź kategorie obiektu
        const skpRadio = obj.querySelector('input[id^="skp_"]:checked');
        const katARadio = obj.querySelector('input[id^="KATa_"]:checked');
        const katBRadio = obj.querySelector('input[id^="KATB_"]:checked');
        
        const isSkpOrKatA = skpRadio || katARadio;
        const isKatB = katBRadio;
        
        // Sprawdź kompatybilność z aktualnym typem SMOK/CMOK
        let isDisabled = false;
        let disabledReason = '';
        
        if (currentSmokType === 'A' && isKatB) {
            isDisabled = true;
            disabledReason = 'Niekompatybilny z SMOK/CMOK-A';
        } else if (currentSmokType === 'B' && isSkpOrKatA) {
            isDisabled = true;
            disabledReason = 'Niekompatybilny z SMOK/CMOK-B';
        }
        
        // Sprawdź czy obiekt był zaznaczony wcześniej
        const isChecked = selectedConnections.includes(objId);
        
        optionsHTML += `
            <div class="checkbox-option ${isDisabled ? 'disabled-option' : ''}">
                <input type="checkbox" id="connect_${nastawniaId}_${objId}" name="connected_${nastawniaId}" 
                       value="${objId}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled title="' + disabledReason + '"' : ''}>
                <label for="connect_${nastawniaId}_${objId}">${objName}${skpRadio ? ' (SKP)' : (isKatB ? ' (KAT B)' : (katARadio ? ' (KAT A) ' : ' '))}</label>
            </div>
        `;
    });
    
    // Dodaj opcje dla innych nastawni tylko jeśli ta nastawnia ma LCS
    if (isLcsEnabled) {
        nastawnie.forEach(otherNastawnia => {
            const otherNastawniaId = otherNastawnia.id.split('_')[1];
            
            // Nie pokazuj tej samej nastawni
            if (otherNastawniaId === nastawniaId) return;
            
            const otherNastawniaNameInput = document.getElementById(`nastawniaName_${otherNastawniaId}`);
            const otherNastawniaName = otherNastawniaNameInput ? 
                otherNastawniaNameInput.value || `Nastawnia ${otherNastawniaId}` : `Nastawnia ${otherNastawniaId}`;
            
            // Sprawdź czy inna nastawnia ma kompatybilny typ SMOK/CMOK
            const otherSmokType = getNastawniaSmokType(otherNastawniaId);
            
            let isDisabled = false;
            let disabledReason = '';
            
            if (currentSmokType && otherSmokType && currentSmokType !== otherSmokType) {
                isDisabled = true;
                disabledReason = `Niekompatybilny typ SMOK/CMOK (${currentSmokType} vs ${otherSmokType})`;
            }
            
            // Sprawdź czy nastawnia była zaznaczona wcześniej
            const isChecked = selectedConnections.includes(`nastawnia_${otherNastawniaId}`);
            
            optionsHTML += `
                <div class="checkbox-option ${isDisabled ? 'disabled-option' : ''}">
                    <input type="checkbox" id="connect_${nastawniaId}_nastawnia_${otherNastawniaId}" 
                           name="connected_${nastawniaId}" value="nastawnia_${otherNastawniaId}" 
                           ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled title="' + disabledReason + '"' : ''}>
                    <label for="connect_${nastawniaId}_nastawnia_${otherNastawniaId}">
                        ${otherNastawniaName} (Nastawnia${otherSmokType ? ' SMOK/CMOK-' + otherSmokType : ''})
                    </label>
                </div>
            `;
        });
    }
    
    connectedObjectsDiv.innerHTML = optionsHTML || '<p style="color: #666; font-style: italic;">Brak dostępnych obiektów do połączenia.</p>';
    
    // Dodaj event listenery dla checkboxów
    const checkboxes = connectedObjectsDiv.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Aktualizuj typ SMOK/CMOK po zmianie zaznaczenia
            updateNastawniaSmokType(nastawniaId);
            // Aktualizuj opcje dla wszystkich nastawni w razie zmiany typu
            updateConnectedObjectsForAllNastawnie();
            // NOWA LOGIKA - sprawdź czy zmienić generator po zmianie połączeń
            chooseNastawniaGenerator(nastawniaId);
        });
    });
}

/**
 * Aktualizuje typ SMOK/CMOK dla nastawni i aktualizuje jej nagłówek
 * @param {number} nastawniaId - ID nastawni
 */
function updateNastawniaSmokType(nastawniaId) {
    const smokType = getNastawniaSmokType(nastawniaId);
    
    // Aktualizacja nagłówka collapse
    const collapseCategory = document.getElementById(`collapseCategory_nastawnia_${nastawniaId}`);
    if (collapseCategory) {
        let categoryText = 'Nastawnia';
        if (smokType) {
            categoryText += ` SMOK/CMOK-${smokType}`;
        }
        collapseCategory.textContent = categoryText;
    }
}

/**
 * NOWA FUNKCJA - Sprawdza czy nastawnia jest podłączona do nastawni z LCS
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
 * NOWA FUNKCJA - Wybiera odpowiedni generator dla nastawni
 * @param {number} id - ID nastawni
 */
function chooseNastawniaGenerator(id) {
    const lprCheckbox = document.getElementById(`lpr_${id}`);
    const redLightCheckbox = document.getElementById(`redLight_${id}`);
    const lcsCheckbox = document.getElementById(`lcs_${id}`);
    
    // Sprawdź stan checkboxów i połączenie z LCS
    setTimeout(() => {
        const isLprEnabled = lprCheckbox && lprCheckbox.checked;
        const isRedLightEnabled = redLightCheckbox && redLightCheckbox.checked;
        const isLcsEnabled = lcsCheckbox && lcsCheckbox.checked;
        const connectedToLcs = isNastawiaConnectedToLCS(id);
        
        // Warunki dla ND-LCS generatora:
        // - brak zaznaczonego LCS
        // - brak zaznaczonego LPR  
        // - brak zaznaczonego Czerwone światło
        // - podłączony do nastawni z LCS
        const shouldUseNDLCS = !isLcsEnabled && !isLprEnabled && !isRedLightEnabled && connectedToLcs;
        
        if (shouldUseNDLCS) {
            console.log(`Używam ND-LCS generatora dla nastawni ${id}`);
            // Sprawdź czy funkcja istnieje przed wywołaniem
            if (typeof generateNDLCSTable === 'function') {
                generateNDLCSTable(id);
            } else {
                console.warn('Funkcja generateNDLCSTable nie jest dostępna, używam standardowego generatora');
                generateNastawniaTable(id);
            }
        } else {
            console.log(`Używam standardowego generatora dla nastawni ${id}`);
            generateNastawniaTable(id);
        }
    }, 200); // Opóźnienie aby inne elementy zdążyły się załadować
}

/**
 * Ustawienia event listenerów dla nastawni
 * @param {number} id - ID nastawni
 */
function setupNastawniaEventListeners(id) {
    const nastawniaNameInput = document.getElementById(`nastawniaName_${id}`);
    const nastawniaTitle = document.getElementById(`nastawniaTitle_${id}`);
    const confirmBtn = document.getElementById(`confirmNastawniaName_${id}`);
    const editBtn = document.getElementById(`editNastawniaName_${id}`);
    const lprCheckbox = document.getElementById(`lpr_${id}`);
    const redLightCheckbox = document.getElementById(`redLight_${id}`);
    const lcsCheckbox = document.getElementById(`lcs_${id}`);

    // Logika - gdy zaznaczone "Czerwone światło", automatycznie zaznacz "LPR"
    redLightCheckbox.addEventListener('change', function() {
        if (this.checked) {
            lprCheckbox.checked = true;
            lprCheckbox.disabled = true;
        } else {
            lprCheckbox.disabled = false;
        }
        updateNastawniaTitle();
        updateNastawniaDevices(id);
        updateConnectedObjectsForAllNastawnie();
    });

    // Event listenery dla checkboxów
    [lprCheckbox, lcsCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateNastawniaTitle();
            updateNastawniaDevices(id);
            updateConnectedObjectsForAllNastawnie();
        });
    });

    // Funkcja aktualizująca tytuł nastawni z oznaczeniami opcji
    function updateNastawniaTitle() {
        const baseName = nastawniaNameInput.value.trim() || `Nastawnia ${id}`;
        let prefix = '';
        
        if (lcsCheckbox.checked) {
            prefix += 'LCS ';
        }
        
        nastawniaTitle.textContent = prefix + baseName;
        
        // Aktualizuj typ SMOK/CMOK w nagłówku
        updateNastawniaSmokType(id);
    }

    confirmBtn.addEventListener('click', function() {
        const inputValue = nastawniaNameInput.value.trim();
        if (inputValue) {
            nastawniaNameInput.disabled = true;
            confirmBtn.classList.add('hidden');
            editBtn.classList.remove('hidden');
            updateNastawniaTitle();
            // Dodaj małe opóźnienie przed aktualizacją opcji
            setTimeout(() => {
                updateConnectedObjectsForAllNastawnie();
            }, 50);
        } else {
            alert('Proszę wprowadzić nazwę nastawni');
            nastawniaNameInput.focus();
        }
    });

    editBtn.addEventListener('click', function() {
        nastawniaNameInput.disabled = false;
        editBtn.classList.add('hidden');
        confirmBtn.classList.remove('hidden');
        nastawniaNameInput.focus();
        updateNastawniaTitle();
    });

    // Event listener dla zmiany nazwy - aktualizuje tytuł w czasie rzeczywistym
    nastawniaNameInput.addEventListener('input', function() {
        updateNastawniaTitle();
        // Aktualizuj opcje połączonych obiektów tylko gdy nazwa jest zatwierdzona
        if (nastawniaNameInput.disabled) {
            updateConnectedObjectsForAllNastawnie();
        }
    });

    // NOWA LOGIKA - wybór odpowiedniego generatora
    // Sprawdź stan nastawni i wybierz odpowiedni generator
    chooseNastawniaGenerator(id);
    
    nastawniaNameInput.focus();
    setupObjectCollapse(id, 'nastawnia');
}

/**
 * Aktualizuje wyposażenie nastawni na podstawie ustawień kreatora
 * @param {number} nastawniaId - ID nastawni
 */
function updateNastawniaDevices(nastawniaId) {
    const lprCheckbox = document.getElementById(`lpr_${nastawniaId}`);
    const redLightCheckbox = document.getElementById(`redLight_${nastawniaId}`);
    const lcsCheckbox = document.getElementById(`lcs_${nastawniaId}`);
    
    // Sprawdź czy czerwone światło jest zaznaczone - jeśli tak, automatycznie zaznacz LPR
    // i zablokuj możliwość jego odznaczenia
    if (redLightCheckbox && redLightCheckbox.checked) {
        if (lprCheckbox) {
            lprCheckbox.checked = true;
            lprCheckbox.disabled = true; // Zablokuj możliwość odznaczenia LPR gdy jest czerwone światło
        }
    } else if (lprCheckbox) {
        lprCheckbox.disabled = false; // Odblokuj LPR gdy czerwone światło jest wyłączone
    }
    
    // NOWA LOGIKA - wybierz odpowiedni generator po zmianie opcji
    chooseNastawniaGenerator(nastawniaId);
    
    // Aktualizuj tytuł nastawni z funkcjami
    updateNastawniaTitle(nastawniaId);
    
    // Aktualizuj tabelę podsumowującą
    updateGeneratorsSummaryTable();
}

/**
 * Aktualizuje tytuł nastawni z oznaczeniami funkcji
 * @param {number} id - ID nastawni
 */
function updateNastawniaTitle(id) {
    const nastawniaNameInput = document.getElementById(`nastawniaName_${id}`);
    const nastawniaTitle = document.getElementById(`nastawniaTitle_${id}`);
    const lcsCheckbox = document.getElementById(`lcs_${id}`);
    const lprCheckbox = document.getElementById(`lpr_${id}`);
    const redLightCheckbox = document.getElementById(`redLight_${id}`);
    
    const baseName = nastawniaNameInput.value.trim() || `Nastawnia ${id}`;
    let functionTags = [];
    
    // Zbierz wszystkie aktywne funkcje
    if (lcsCheckbox && lcsCheckbox.checked) functionTags.push('LCS');
    if (lprCheckbox && lprCheckbox.checked) functionTags.push('LPR');
    if (redLightCheckbox && redLightCheckbox.checked) functionTags.push('RL');
    
    // Aktualizuj tytuł z funkcjami
    if (functionTags.length > 0) {
        nastawniaTitle.textContent = `[${functionTags.join('/')}] ${baseName}`;
    } else {
        nastawniaTitle.textContent = baseName;
    }
    
    // Również aktualizuj nagłówek collapse
    const collapseTitle = document.getElementById(`collapseTitle_nastawnia_${id}`);
    if (collapseTitle) {
        collapseTitle.textContent = nastawniaTitle.textContent;
    }
}

/**
 * Konfiguracja event listenerów dla obiektów
 * @param {number} id - ID obiektu
 */
function setupObjectEventListeners(id) {
    const objectNameInput = document.getElementById(`objectName_${id}`);
    const objectTitle = document.getElementById(`objectTitle_${id}`);
    const confirmBtn = document.getElementById(`confirmName_${id}`);
    const editBtn = document.getElementById(`editName_${id}`);
    const calculatorsDiv = document.getElementById(`categoryCalculators_${id}`);

    objectNameInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value.length > 6) value = value.substring(0, 6);
        e.target.value = value;
        
        // Aktualizuj opcje tylko gdy nazwa jest zatwierdzona
        if (objectNameInput.disabled) {
            updateConnectedObjectsForAllNastawnie();
        }
    });

    confirmBtn.addEventListener('click', function() {
        const inputValue = objectNameInput.value;
        const formattedValue = formatKilometer(inputValue);
        
        if (inputValue.length >= 3 && inputValue.length <= 6) {
            objectNameInput.value = formattedValue;
            objectTitle.textContent = formattedValue;
            
            // Aktualizuj collapse header
            const collapseTitle = document.getElementById(`collapseTitle_object_${id}`);
            if (collapseTitle) {
                collapseTitle.textContent = formattedValue;
            }
            
            objectNameInput.disabled = true;
            confirmBtn.classList.add('hidden');
            editBtn.classList.remove('hidden');
            
            // Aktualizuj opcje w Nastawniach po zatwierdzeniu nazwy
            updateConnectedObjectsForAllNastawnie();
        } else {
            alert('Proszę wpisać od 3 do 6 cyfr');
            objectNameInput.focus();
        }
    });

    editBtn.addEventListener('click', function() {
        const currentValue = objectNameInput.value;
        const numbers = currentValue.replace(/[^\d]/g, '');
        objectNameInput.value = numbers;
        objectTitle.textContent = 'Km 000,000';
        
        // Aktualizuj collapse header
        const collapseTitle = document.getElementById(`collapseTitle_object_${id}`);
        if (collapseTitle) {
            collapseTitle.textContent = 'Km 000,000';
        }
        
        objectNameInput.disabled = false;
        editBtn.classList.add('hidden');
        confirmBtn.classList.remove('hidden');
        objectNameInput.focus();
        
        // Aktualizuj opcje w Nastawniach po edycji nazwy
        updateConnectedObjectsForAllNastawnie();
    });

    // Obsługa kategorii i dynamiczne kalkulatory
    const skpRadio = document.getElementById(`skp_${id}`);
    const KATaRadio = document.getElementById(`KATa_${id}`);
    const KATBRadio = document.getElementById(`KATB_${id}`);

    function showCalculator(category) {
        calculatorsDiv.innerHTML = "";
        if (category === "SKP") {
            calculatorsDiv.innerHTML = `
                <div id="skpCalculator_${id}" class="skp-calculator">
                    <h3>Kalkulator SKP</h3>
                    <div class="skp-results">
                        <table id="skpTable_${id}">
                            <thead>
                                <tr>
                                    <th>L.P.</th>
                                    <th>Nazwa</th>
                                    <th>Ilość</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `;
            generateSKPTable(id);
        } else if (category === "Kat A") {
            calculatorsDiv.innerHTML = `
                <div id="KATaCalculator_${id}" class="KATa-calculator">
                    <h3>Kalkulator KAT A</h3>
                    <div class="KATa-results">
                        <table id="KATaTable_${id}">
                            <thead>
                                <tr>
                                    <th>L.P.</th>
                                    <th>Nazwa</th>
                                    <th>Ilość</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `;
            generateKATaTable(id);
        } else if (category === "Kat B") {
            calculatorsDiv.innerHTML = `
                <div id="KATBCalculator_${id}" class="KATB-calculator">
                    <h3>Kalkulator KAT B</h3>
                    <div class="KATB-results">
                        <table id="KATBTable_${id}">
                            <thead>
                                <tr>
                                    <th>L.P.</th>
                                    <th>Nazwa</th>
                                    <th>Ilość</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            `;
            generateKATBTable(id);
        }
        
        updateGeneratorsSummaryTable();
        
        // Aktualizacja połączonych obiektów w nastawniach po zmianie kategorii
        updateConnectedObjectsForAllNastawnie();
    }

    [skpRadio, KATaRadio, KATBRadio].forEach(radio => {
        radio.addEventListener('change', () => {
            if (skpRadio.checked) showCalculator("SKP");
            else if (KATaRadio.checked) showCalculator("Kat A");
            else if (KATBRadio.checked) showCalculator("Kat B");
            updateGeneratorsSummaryTable();
        });
    });

    objectNameInput.focus();
    setupObjectCollapse(id);
}

/**
 * Konfiguracja zwijania/rozwijania obiektów
 * @param {number} id - ID obiektu/nastawni
 * @param {string} type - Typ elementu ('object' lub 'nastawnia')
 */
function setupObjectCollapse(id, type = 'object') {
    const elementDiv = document.getElementById(`${type}_${id}`);
    if (!elementDiv) return; // Zabezpieczenie przed nieistniejącymi elementami
    // Tworzymy pasek nagłówka z nazwą i kategorią
    // Przenosimy całą zawartość do "object-content"
    const content = document.createElement('div');
    content.className = 'object-content';
    // przenieś dzieci elementDiv do content
    while (elementDiv.firstChild) {
        content.appendChild(elementDiv.firstChild);
    }
    // Tworzymy pasek nagłówka
    const header = document.createElement('div');
    header.className = 'object-collapse-header';
    
    // POPRAWKA: Unikalne identyfikatory dla każdego typu
    const uniqueId = `${type}_${id}`;
    let titleId, categoryText;
    if (type === 'nastawnia') {
        titleId = `nastawniaName_${id}`;
        categoryText = 'Nastawnia';
    } else {
        titleId = `objectName_${id}`;
        categoryText = 'SKP'; // domyślnie
    }
    
   // Nazwa obiektu i kategoria (domyślnie Km 000,000, potem aktualizowane)
		header.innerHTML = `
			<span class="collapse-title" id="collapseTitle_${uniqueId}">${type === 'nastawnia' ? `Nastawnia ${id}` : 'Km 000,000'}</span>
			<span class="collapse-category" id="collapseCategory_${uniqueId}">${categoryText}</span>
			<span class="collapse-arrow" id="collapseArrow_${uniqueId}">&#9654;</span>
		`;
		header.style.cursor = "pointer";
		header.addEventListener('click', function() {
			content.classList.toggle('collapsed');
			const arrow = document.getElementById(`collapseArrow_${uniqueId}`);
			arrow.classList.toggle('rotated');
		});
		// Ustaw na starcie, jeśli sekcja jest zwinięta
		const arrow = header.querySelector(`#collapseArrow_${uniqueId}`);
		if (content.classList.contains('collapsed')) {
			arrow.classList.add('rotated');
		}
		elementDiv.appendChild(header);
		elementDiv.appendChild(content);

    // Ukryj na starcie środek
    content.classList.add('collapsed');

    // Funkcja aktualizująca tytuł i kategorię w nagłówku - TYLKO dla tego elementu
    function updateCollapseHeader() {
        const nameInput = document.getElementById(titleId);
        const title = document.getElementById(`collapseTitle_${uniqueId}`);
        const cat = document.getElementById(`collapseCategory_${uniqueId}`);
        
        // Sprawdź czy elementy istnieją dla tego konkretnego typu i id
        if (!nameInput || !title || !cat) return;
        
        if (type === 'nastawnia') {
            const lcsCheckbox = document.getElementById(`lcs_${id}`);
            const inputValue = nameInput.value.trim();
            const baseName = inputValue || `Nastawnia ${id}`;
            let displayName = baseName;
            
            // Dodano oznaczenie LCS w tytule collapse
            if (lcsCheckbox && lcsCheckbox.checked) {
                displayName = `LCS ${baseName}`;
            }
            
            title.textContent = displayName;
            
            // Dodanie oznaczenia SMOK/CMOK w kategorii nastawni
            const smokType = getNastawniaSmokType(id);
            cat.textContent = smokType ? `Nastawnia SMOK/CMOK-${smokType}` : 'Nastawnia';
        } else {
            const inputValue = nameInput.value.trim();
            
            // Sprawdź czy input jest wyłączony (zatwierdzona nazwa)
            if (nameInput.disabled) {
                // Nazwa jest zatwierdzona - użyj sformatowanej wartości
                title.textContent = inputValue || 'Km 000,000';
            } else {
                // Nazwa jest w trakcie edycji - pokaż format domyślny lub surowe cyfry
                if (inputValue && inputValue.length >= 3 && inputValue.length <= 6 && /^\d+$/.test(inputValue)) {
                    title.textContent = formatKilometer(inputValue);
                } else if (inputValue) {
                    title.textContent = `Km ${inputValue}`;
                } else {
                    title.textContent = 'Km 000,000';
                }
            }
            
            // Aktualizuj kategorię
            const skp = document.getElementById(`skp_${id}`);
            const KATa = document.getElementById(`KATa_${id}`);
            const KATB = document.getElementById(`KATB_${id}`);
            if (skp && skp.checked) cat.textContent = 'SKP';
            else if (KATa && KATa.checked) cat.textContent = 'Kat A';
            else if (KATB && KATB.checked) cat.textContent = 'Kat B';
            else cat.textContent = '';
        }
    }
    
    // Nasłuchuj na zmiany nazwy/kategorii - TYLKO dla tego elementu
    if (type === 'nastawnia') {
        const nameInput = document.getElementById(titleId);
        if (nameInput) {
            nameInput.addEventListener('input', updateCollapseHeader);
        }
        // Dodano nasłuchiwanie zmian checkboxów LCS dla aktualizacji nagłówka
        const lcsCheckbox = document.getElementById(`lcs_${id}`);
        if (lcsCheckbox) {
            lcsCheckbox.addEventListener('change', updateCollapseHeader);
        }
        
        // Obserwuj zmiany połączonych obiektów, które mogą wpłynąć na typ SMOK/CMOK
        const connectedObjectsDiv = document.getElementById(`connectedObjects_${id}`);
        if (connectedObjectsDiv) {
            const observer = new MutationObserver(function() {
                setTimeout(updateCollapseHeader, 10);
            });
            observer.observe(connectedObjectsDiv, { 
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['checked']
            });
        }
    } else {
        const nameInput = document.getElementById(titleId);
        if (nameInput) {
            nameInput.addEventListener('input', updateCollapseHeader);
            // Dodaj nasłuchiwanie na zmiany stanu disabled
            const observer = new MutationObserver(function() {
                setTimeout(updateCollapseHeader, 10); // Małe opóźnienie dla synchronizacji
            });
            observer.observe(nameInput, { 
                attributes: true, 
                attributeFilter: ['disabled', 'value'],
                childList: true,
                subtree: true
            });
        }
        ['skp', 'KATa', 'KATB'].forEach(opt => {
            const radio = document.getElementById(`${opt}_${id}`);
            if (radio) {
                radio.addEventListener('change', updateCollapseHeader);
            }
        });
    }
    updateCollapseHeader();
}

/**
 * Usuwanie obiektu
 * @param {number} id - ID obiektu
 */
function removeObject(id) {
    const objectElement = document.getElementById(`object_${id}`);
    if (objectElement) {
        objectElement.remove();
        const remainingItems = document.querySelectorAll('.object-item, .nastawnia-item');
        if (remainingItems.length === 0) {
            objectsContainer.classList.add('empty');
            objectsContainer.innerHTML = '<p>Kliknij "Dodaj obiekt" lub "Dodaj Nastawnie" aby utworzyć pierwszy element</p><div id="objectsList"></div>';
        }
        updateSubmitButton();
        updateGeneratorsSummaryTable();
        updateConnectedObjectsForAllNastawnie();
    }
}

/**
 * Usuwanie nastawni
 * @param {number} id - ID nastawni
 */
function removeNastawnia(id) {
    const nastawniaElement = document.getElementById(`nastawnia_${id}`);
    if (nastawniaElement) {
        nastawniaElement.remove();
        const remainingItems = document.querySelectorAll('.object-item, .nastawnia-item');
        if (remainingItems.length === 0) {
            objectsContainer.classList.add('empty');
            objectsContainer.innerHTML = '<p>Kliknij "Dodaj obiekt" lub "Dodaj Nastawnie" aby utworzyć pierwszy element</p><div id="objectsList"></div>';
        }
        updateSubmitButton();
        updateGeneratorsSummaryTable();
        updateConnectedObjectsForAllNastawnie();
    }
}

/**
 * Aktualizacja przycisku "Zapisz"
 */
function updateSubmitButton() {
    const objects = document.querySelectorAll('.object-item, .nastawnia-item');
    submitBtn.disabled = objects.length === 0;
}

/**
 * Resetowanie formularza
 */
function resetForm() {
    document.getElementById('taskName').value = '';
    document.querySelectorAll('.object-item').forEach(obj => obj.remove());
    document.querySelectorAll('.nastawnia-item').forEach(nastawnia => nastawnia.remove());
    objectsContainer.classList.add('empty');
    objectsContainer.innerHTML = '<p>Kliknij "Dodaj obiekt" lub "Dodaj Nastawnie" aby utworzyć pierwszy element</p><div id="objectsList"></div>';
    results.classList.add('hidden');
    objectCounter = 0;
    nastawniaCounter = 0;
    updateSubmitButton();
    updateGeneratorsSummaryTable();
    document.getElementById('taskName').focus();
}

/**
 * Sumaryczna tabela generatorów
 */
function updateGeneratorsSummaryTable() {
    const objectItems = document.querySelectorAll('.object-item');
    const nastawniaItems = document.querySelectorAll('.nastawnia-item');
    let summaryMap = new Map();

    // Helper do sumowania generatora tabeli
    function sumTableRows(table) {
        const trs = table.querySelectorAll('tbody tr');
        trs.forEach(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells.length < 3) return;
            const name = cells[1].textContent.trim();
            let value = 0;
            const qtyInput = cells[2].querySelector('input');
            if (qtyInput) value = parseInt(qtyInput.value) || 0;
            else value = parseInt(cells[2].textContent.trim()) || 0;
            if (!summaryMap.has(name)) summaryMap.set(name, 0);
            summaryMap.set(name, summaryMap.get(name) + value);
        });
    }

    objectItems.forEach(obj => {
        // SKP
        const skpRadio = obj.querySelector('input[type="radio"][value="SKP"]');
        if (skpRadio && skpRadio.checked) {
            const skpTable = obj.querySelector('.skp-results table');
            if (skpTable) sumTableRows(skpTable);
        }
        // Kat A
        const KATaRadio = obj.querySelector('input[type="radio"][value="Kat A"]');
        if (KATaRadio && KATaRadio.checked) {
            const KATaTable = obj.querySelector('.KATa-results table');
            if (KATaTable) sumTableRows(KATaTable);
        }
        // Kat B
        const KATBRadio = obj.querySelector('input[type="radio"][value="Kat B"]');
        if (KATBRadio && KATBRadio.checked) {
            const KATBTable = obj.querySelector('.KATB-results table');
            if (KATBTable) sumTableRows(KATBTable);
        }
    });

    nastawniaItems.forEach(nastawnia => {
        const nastawniaTable = nastawnia.querySelector('.nastawnia-results table');
        if (nastawniaTable) sumTableRows(nastawniaTable);
    });

    const summaryArr = Array.from(summaryMap.entries());
    summaryArr.sort((a, b) => a[0].localeCompare(b[0], 'pl'));

    if (summaryArr.length > 0) {
        let tableHTML = `<table class="generators-summary-table"><thead><tr><th>L.P.</th><th>Nazwa</th><th>Suma ilości</th></tr></thead><tbody>`;
        summaryArr.forEach(([name, sum], idx) => {
            tableHTML += `<tr>
                <td>${idx + 1}</td>
                <td>${name}</td>
                <td>${sum}</td>
            </tr>`;
        });
        tableHTML += `</tbody></table>`;
        generatorsSummaryTableContainer.innerHTML = tableHTML;
    } else {
        generatorsSummaryTableContainer.innerHTML = '';
    }
}

// Dodaj na końcu pliku main.js
function fixNastawniaCollapse() {
    document.querySelectorAll('.nastawnia-item').forEach(nastawnia => {
        const id = nastawnia.id.split('_')[1];
        setupObjectCollapse(id, 'nastawnia');
    });
}

// Wywołaj funkcję po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Poczekaj chwilę, aby inne skrypty zdążyły się załadować
    setTimeout(fixNastawniaCollapse, 500);
});

// Eksportowanie funkcji do global scope
window.removeObject = removeObject;
window.removeNastawnia = removeNastawnia;
window.resetForm = resetForm;