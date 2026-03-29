/**
 * Generator KAT A - Nowa implementacja
 */

// Sprawdzenie dostępności tablicy KATa_DATA
if (typeof KATa_DATA === 'undefined') {
    console.error("Błąd: Brak dostępu do tablicy KATa_DATA!");
}

/**
 * Generuje kreator i tabelę KAT A dla danego obiektu
 * @param {number} objectId - ID obiektu
 */
function generateKATaTable(objectId) {
    console.log("Inicjalizacja generatora KAT A dla obiektu ID:", objectId);
    
    // Czekamy na załadowanie DOM
    document.addEventListener('DOMContentLoaded', function() {
        initKATaGenerator(objectId);
    });
    
    // Jeśli DOM jest już załadowany, inicjalizujemy natychmiast
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initKATaGenerator(objectId);
    }
}

/**
 * Inicjalizuje generator KAT A
 * @param {number} objectId - ID obiektu
 */
function initKATaGenerator(objectId) {
    // Sprawdź czy element kontenera istnieje
    const container = document.querySelector(`.object-item[id="object_${objectId}"]`);
    if (!container) {
        console.error(`Błąd: Nie znaleziono kontenera dla obiektu ID ${objectId}`);
        return;
    }
    
    // Sprawdź czy kategoria jest ustawiona na KAT A
    const isKATaSelected = container.querySelector('input[value="Kat A"]:checked');
    if (!isKATaSelected) {
        console.log(`Generator KAT A nie jest aktywny dla obiektu ID ${objectId}`);
        return;
    }
    
    // Przygotuj kontener dla kalkulatora, jeśli nie istnieje
    let calculatorDiv = container.querySelector('#KATaCalculator_' + objectId);
    if (!calculatorDiv) {
        calculatorDiv = document.createElement('div');
        calculatorDiv.id = 'KATaCalculator_' + objectId;
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
    let resultsContainer = calculatorDiv.querySelector('.KATa-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'KATa-results';
        calculatorDiv.appendChild(resultsContainer);
    }
    
    // Przygotuj kreator
    let creatorDiv = calculatorDiv.querySelector('.kata-creator');
    if (!creatorDiv) {
        creatorDiv = document.createElement('div');
        creatorDiv.className = 'kata-creator';
        calculatorDiv.insertBefore(creatorDiv, resultsContainer);
    }
    
    // Wypełnij kreator
    creatorDiv.innerHTML = `
        <div class="creator-header">
            <h3>Kreator KAT A</h3>
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
                <select id="camera_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="camera_lpr_count_${objectId}">Ilość kamer LPR:</label>
                <select id="camera_lpr_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="tuba_count_${objectId}">Ilość tub Slican:</label>
                <select id="tuba_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="sar_count_${objectId}">Ilość SAR:</label>
                <select id="sar_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i === 1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="slupek_sar_count_${objectId}">Ilość słupków pod SAR:</label>
                <select id="slupek_sar_count_${objectId}" class="creator-select">
                    ${Array.from({length: 21}, (_, i) => `<option value="${i}" ${i === 0 ? 'selected' : ''}>${i}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <button type="button" id="generate_kata_${objectId}" class="update-kata-btn">Generuj tabelę KAT A</button>
            </div>
        </div>
    `;
    
    // Utwórz tabelę jeśli nie istnieje
    let tableElement = resultsContainer.querySelector(`table`);
    if (!tableElement) {
        tableElement = document.createElement('table');
        tableElement.id = `KATaTable_${objectId}`;
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
    
    // Dodaj event listener do przycisku
    const generateButton = document.getElementById(`generate_kata_${objectId}`);
    if (generateButton) {
        // Usuń istniejące listenery, aby uniknąć duplikacji
        generateButton.replaceWith(generateButton.cloneNode(true));
        document.getElementById(`generate_kata_${objectId}`).addEventListener('click', function() {
            generateKATaTableFromCreator(objectId);
        });
    }
    
    // Wygeneruj tabelę z domyślnymi wartościami
    generateKATaTableFromCreator(objectId);
    console.log("Generator KAT A zainicjalizowany dla obiektu ID:", objectId);
}

/**
 * Generuje tabelę KAT A na podstawie wyborów z kreatora
 * @param {number} objectId - ID obiektu
 */
function generateKATaTableFromCreator(objectId) {
    console.log("Generowanie tabeli KAT A dla obiektu ID:", objectId);
    
    // Sprawdź czy KATa_DATA istnieje
    if (typeof KATa_DATA === 'undefined' || !Array.isArray(KATa_DATA) || KATa_DATA.length === 0) {
        console.error("Błąd: Nieprawidłowa tablica KATa_DATA");
        return;
    }
    
    const tableBody = document.querySelector(`#KATaTable_${objectId} tbody`);
    if (!tableBody) {
        console.error(`Błąd: Nie znaleziono tbody tabeli dla obiektu ${objectId}`);
        return;
    }
    
    // Pobierz wartości z kreatora
    try {
        const slupCount = parseInt(document.getElementById(`slup_count_${objectId}`).value) || 2;
        const cameraCount = parseInt(document.getElementById(`camera_count_${objectId}`).value) || 2;
        const cameraLPRCount = parseInt(document.getElementById(`camera_lpr_count_${objectId}`).value) || 2;
        const tubaCount = parseInt(document.getElementById(`tuba_count_${objectId}`).value) || 2;
        const sarCount = parseInt(document.getElementById(`sar_count_${objectId}`).value) || 2;
        const slupekSarCount = parseInt(document.getElementById(`slupek_sar_count_${objectId}`).value) || 0;
        
        console.log(`Parametry KAT A: słupy=${slupCount}, kamery=${cameraCount}, kamery LPR=${cameraLPRCount}, tuby=${tubaCount}, SAR=${sarCount}, słupki SAR=${slupekSarCount}`);
        
        // Wyczyść tabelę
        tableBody.innerHTML = '';
        
        // Tablica na wiersze tabeli
        const tableRows = [];
        let rowIndex = 1;
        
        // Funkcje pomocnicze
        function ceil(value, divisor) {
            return Math.ceil(value / divisor);
        }
        
        function addTableRow(name, quantity) {
            tableRows.push(createTableRow(rowIndex++, name, quantity));
        }
        
        // Sprawdzenie, czy nazwy elementów są dostępne w KATa_DATA
        const getNazwa = (idx) => {
            return KATa_DATA[idx] && KATa_DATA[idx].nazwa ? KATa_DATA[idx].nazwa : `Element ${idx}`;
        };
        
        // Obliczenia dla łącznej ilości urządzeń (często używane)
        const totalDevices = cameraCount + cameraLPRCount + tubaCount + sarCount;
        
        // 1. Dodaj słupy (idx 17)
        addTableRow(getNazwa(17), slupCount);
        
        // 2. Dodaj kamery (idx 0)
        addTableRow(getNazwa(0), cameraCount);
        
        // 3. Dodaj kamery LPR (idx 21)
        addTableRow(getNazwa(21), cameraLPRCount);
        
        // 4. Dodaj tuby Slican (idx 22)
        addTableRow(getNazwa(22), tubaCount);
        
        // 5. Dodaj SAR (idx 23)
        addTableRow(getNazwa(23), sarCount);
        
        // 6. Dodaj słupki pod SAR (idx 26)
        addTableRow(getNazwa(26), slupekSarCount);
        
        // 7. Dodaj iglicodaszek/kapturek (idx 15) = ilość słupów
        addTableRow(getNazwa(15), slupCount);
        
        // 8. Dodaj szafę terenową (idx 19) - zawsze 1
        addTableRow(getNazwa(19), 1);
        
        // 9. Dodaj uziom kompletny = słupy + szafa
        addTableRow("Uziom kompletny", slupCount + 1);
        
        // 10. Dodaj adapter nasłupowy (idx 1) = kamery + kamery LPR
        addTableRow(getNazwa(1), cameraCount + cameraLPRCount);
        
        // 11. Dodaj puszkę (idx 2) = ilość kamer
        addTableRow(getNazwa(2), cameraCount);
        
        // 12. Dodaj przepięciówkę (idx 3) = kamery + kamery LPR
        addTableRow(getNazwa(3), cameraCount + cameraLPRCount);
        
        // 13. Dodaj przepięciówkę 4 kanałową (idx 4) = ceil(totalDevices / 4)
        const przepieciowki4 = ceil(totalDevices, 4);
        addTableRow(getNazwa(4), przepieciowki4);
        
        // 14. Dodaj panel ochronny (idx 5) = ceil(przepieciowki4 / 4)
        addTableRow(getNazwa(5), ceil(przepieciowki4, 4));
        
        // 15. Dodaj zasilacz (idx 6) - zawsze 1
        addTableRow(getNazwa(6), 1);
        
        // 16. Dodaj przewód (idx 7) = totalDevices * 5 metrów
        addTableRow(getNazwa(7), totalDevices * 5 + " m");
        
        // 17. Dodaj keyston (idx 8) = totalDevices * 2
        addTableRow(getNazwa(8), totalDevices * 2);
        
        // 18. Dodaj przetwornicę (idx 9) - zawsze 1
        addTableRow(getNazwa(9), 1);
        
        // 19. Dodaj akumulator (idx 10) - zawsze 1
        addTableRow(getNazwa(10), 1);
        
        // 20. Dodaj przekaźnik (idx 11) - zawsze 1
        addTableRow(getNazwa(11), 1);
        
        // 21. Dodaj wtyki (idx 12) = totalDevices * 2
        addTableRow(getNazwa(12), totalDevices * 2);
        
        // 22. Dodaj moduł dozorowy (idx 13) - zawsze 1
        addTableRow(getNazwa(13), 1);
        
        // 23. Dodaj patchcord 0,5m (idx 14) = totalDevices
        addTableRow(getNazwa(14), totalDevices);
        
        // 24. Dodaj patchcord 2m (idx 16) - zawsze 1
        addTableRow(getNazwa(16), 1);
        
        // 25. Dodaj patchcord 0,25m (idx 18) = totalDevices * 4
        addTableRow(getNazwa(18), totalDevices * 4);
        
        // 26. Dodaj switch (idx 20) z odpowiednią nazwą
        // Określ nazwę switcha na podstawie sumy urządzeń
        let switchName = totalDevices >= 8 ? "Switch CRS328-24p-4s" : "Switch CRS112-8p-4s";
        
        // Dodaj wiersz switcha
        addTableRow(switchName, 1);
        
        // 27. Dodaj idx 24 - zawsze 1
        addTableRow(getNazwa(24), 1);
        
        // 28. Dodaj idx 25 - zawsze 1
        addTableRow(getNazwa(25), 1);
        
        // 29. Dodaj tabliczkę - zawsze 2
        addTableRow("Tabliczka Przejazd Monitorowany Kompletna", 2);
        
        // 30. Dodaj dodatkowe akcesoria - zawsze 1
        addTableRow("Dodatkowe akcesoria montażowe (wago, Power Cord, ITP)", 1);
        
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
        
        console.log(`Wygenerowano ${tableRows.length} elementów w tabeli KAT A`);
        
    } catch (error) {
        console.error("Wystąpił błąd podczas generowania tabeli KAT A:", error);
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