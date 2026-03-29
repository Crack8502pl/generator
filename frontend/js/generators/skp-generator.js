/**
 * Generator SKP
 * Obsługa kalkulatora SKP
 */

/**
 * Generuje kreator i tabelę SKP dla danego obiektu
 * @param {number} objectId - ID obiektu
 */
function generateSKPTable(objectId) {
    // Znajdź kontener kalkulatora
    const calculatorDiv = document.getElementById(`skpCalculator_${objectId}`);
    if (!calculatorDiv) {
        console.error(`Nie znaleziono kontenera kalkulatora dla obiektu ${objectId}`);
        return;
    }
    
    // Sprawdź czy istnieje kontener na wyniki, jeśli nie - utwórz go
    let resultsContainer = calculatorDiv.querySelector('.skp-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'skp-results';
        calculatorDiv.appendChild(resultsContainer);
    }
    
    // Sprawdź czy istnieje tabela, jeśli nie - utwórz ją
    let tableElement = resultsContainer.querySelector(`#skpTable_${objectId}`);
    if (!tableElement) {
        tableElement = document.createElement('table');
        tableElement.id = `skpTable_${objectId}`;
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
    
    // Dodaj sekcję kreatora przed tabelą
    let creatorDiv = calculatorDiv.querySelector('.skp-creator');
    if (!creatorDiv) {
        creatorDiv = document.createElement('div');
        creatorDiv.className = 'skp-creator';
        calculatorDiv.insertBefore(creatorDiv, resultsContainer);
    }
    
    // Wypełnij kreator
    creatorDiv.innerHTML = `
        <div class="creator-header">
            <h3>Kreator SKP</h3>
            <p class="info-text">Wybierz podstawowe parametry do wygenerowania tabeli SKP</p>
        </div>
        <div class="creator-form">
            <div class="creator-item">
                <label for="slup_count_${objectId}">Ilość słupów:</label>
                <select id="slup_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <label for="camera_count_${objectId}">Ilość kamer:</label>
                <select id="camera_count_${objectId}" class="creator-select">
                    ${Array.from({length: 20}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
                </select>
            </div>
            <div class="creator-item">
                <button type="button" id="generate_skp_${objectId}" class="update-skp-btn">Generuj tabelę SKP</button>
            </div>
        </div>
    `;
    
    // Dodaj event listener do przycisku generowania
    document.getElementById(`generate_skp_${objectId}`).addEventListener('click', function() {
        generateSKPTableFromCreator(objectId);
    });
    
    // Wygeneruj tabelę z domyślnymi wartościami
    generateSKPTableFromCreator(objectId);
}

/**
 * Generuje tabelę SKP na podstawie wyborów z kreatora
 * @param {number} objectId - ID obiektu
 */
function generateSKPTableFromCreator(objectId) {
    const tableBody = document.querySelector(`#skpTable_${objectId} tbody`);
    if (!tableBody) {
        console.error(`Nie znaleziono tbody tabeli dla obiektu ${objectId}`);
        return;
    }
    
    // Pobierz wartości z kreatora
    const slupCount = parseInt(document.getElementById(`slup_count_${objectId}`).value) || 1;
    const cameraCount = parseInt(document.getElementById(`camera_count_${objectId}`).value) || 1;
    
    console.log(`Generowanie SKP: słupy=${slupCount}, kamery=${cameraCount}`);
    
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
    
    // 1. Dodaj słupy (idx 17)
    addTableRow(SKP_DATA[17].nazwa, slupCount);
    
    // 2. Dodaj kamery (idx 0)
    addTableRow(SKP_DATA[0].nazwa, cameraCount);
    
    // 3. Dodaj iglicodaszek/kapturek (idx 15) = ilość słupów
    addTableRow(SKP_DATA[15].nazwa, slupCount);
    
    // 4. Dodaj szafę terenową (idx 19) - zawsze 1
    addTableRow(SKP_DATA[19].nazwa, 1);
    
    // 5. Dodaj uziom kompletny = słupy + szafa
    addTableRow("Uziom kompletny", slupCount + 1);
    
    // 6. Dodaj adapter nasłupowy (idx 1) = ilość kamer
    addTableRow(SKP_DATA[1].nazwa, cameraCount);
    
    // 7. Dodaj puszkę (idx 2) = ilość kamer
    addTableRow(SKP_DATA[2].nazwa, cameraCount);
    
    // 8. Dodaj przepięciówkę (idx 3) = ilość kamer
    addTableRow(SKP_DATA[3].nazwa, cameraCount);
    
    // 9. Dodaj przepięciówkę 4 kanałową (idx 4) = ceil(kamery / 4)
    const przepieciowki4 = ceil(cameraCount, 4);
    addTableRow(SKP_DATA[4].nazwa, przepieciowki4);
    
    // 10. Dodaj panel ochronny (idx 5) = ceil(przepieciowki4 / 4)
    addTableRow(SKP_DATA[5].nazwa, ceil(przepieciowki4, 4));
    
    // 11. Dodaj zasilacz (idx 6) - zawsze 1
    addTableRow(SKP_DATA[6].nazwa, 1);
    
    // 12. Dodaj przewód (idx 7) = kamery * 5 metrów
    addTableRow(SKP_DATA[7].nazwa, cameraCount * 5 + " m");
    
    // 13. Dodaj keyston (idx 8) = kamery * 2
    addTableRow(SKP_DATA[8].nazwa, cameraCount * 2);
    
    // 14. Dodaj przetwornicę (idx 9) - zawsze 1
    addTableRow(SKP_DATA[9].nazwa, 1);
    
    // 15. Dodaj akumulator (idx 10) - zawsze 1
    addTableRow(SKP_DATA[10].nazwa, 1);
    
    // 16. Dodaj przekaźnik (idx 11) - zawsze 1
    addTableRow(SKP_DATA[11].nazwa, 1);
    
    // 17. Dodaj wtyki (idx 12) = kamery * 2
    addTableRow(SKP_DATA[12].nazwa, cameraCount * 2);
    
    // 18. Dodaj moduł dozorowy (idx 13) - zawsze 1
    addTableRow(SKP_DATA[13].nazwa, 1);
    
    // 19. Dodaj patchcord 0,5m (idx 14) = ilość kamer
    addTableRow(SKP_DATA[14].nazwa, cameraCount);
    
    // 20. Dodaj patchcord 2m (idx 16) - zawsze 1
    addTableRow(SKP_DATA[16].nazwa, 1);
    
    // 21. Dodaj patchcord 0,25m (idx 18) = kamery * 4
    addTableRow(SKP_DATA[18].nazwa, cameraCount * 4);
    
    // 22. Dodaj switch (idx 20) z odpowiednią nazwą
    const moduleDozorowe = 1; // Zawsze 1 moduł dozorowy
    const totalDevices = cameraCount + moduleDozorowe;
    
    // Określ nazwę switcha na podstawie sumy urządzeń
    let switchName = totalDevices < 8 ? "Switch CRS112-8p-4s" : "Switch CRS328-24p-4s";
    
    // Dodaj wiersz switcha
    addTableRow(switchName, 1);
    
    // Dodaj wszystkie wiersze do tabeli
    tableRows.forEach(row => tableBody.appendChild(row));
    
    // Aktualizuj podsumowanie generatorów
    if (typeof updateGeneratorsSummaryTable === 'function') {
        updateGeneratorsSummaryTable();
    } else {
        console.warn("Funkcja updateGeneratorsSummaryTable nie jest dostępna");
    }
    
    console.log(`Wygenerowano ${tableRows.length} elementów w tabeli SKP`);
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