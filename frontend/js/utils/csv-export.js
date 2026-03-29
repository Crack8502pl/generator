/**
 * Obsługa eksportu plików CSV
 */

/**
 * Pobiera plik CSV z podsumowaniem generatorów
 */
function downloadSummaryCSV() {
    const summaryTable = document.querySelector('.generators-summary-table');
    if (!summaryTable) {
        alert('Brak danych do przetworzenia. Proszę najpierw dodać obiekty i wygenerować podsumowanie.');
        return;
    }
    
    const taskName = document.getElementById('taskName').value || 'BrakNazwy';
    const rows = summaryTable.querySelectorAll('tbody tr');
    const csvData = [];
    
    // Nagłówki
    const headers = [];
    summaryTable.querySelectorAll('thead th').forEach(th => headers.push(th.textContent.trim()));
    csvData.push(headers.join(';'));
    
    // Wiersze
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let rowData = [];
        cells.forEach(cell => rowData.push(cell.textContent.trim()));
        csvData.push(rowData.join(';'));
    });
    
    const csvContent = csvData.join('\n');
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const sanitizedTaskName = taskName.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '_');
    const filename = `zestawienie_${sanitizedTaskName}_${dateStr}.csv`;
    
    // 1. POBIERZ PLIK CSV
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 2. WYŚLIJ E-MAILEM (z małym opóźnieniem)
    setTimeout(() => {
        sendCSVByEmail(csvContent, filename, taskName, false);
    }, 500);
    
    // 3. POKAŻ KOMUNIKAT O PODWÓJNEJ AKCJI
    showDualActionMessage(taskName, filename, false);
}

/**
 * Przygotowuje plik CSV z zadaniami
 * @param {HTMLFormElement} form - Formularz z danymi
 * @returns {Object} Dane do CSV
 */
function prepareTaskCSV(form) {
    const taskName = document.getElementById('taskName').value || 'BrakNazwy';
    const objects = document.querySelectorAll('.object-item');
    const nastawnie = document.querySelectorAll('.nastawnia-item');
    const csvData = [];
    
    // Nagłówki CSV
    const headers = [
        'Nazwa Obiektu',
        'Kategoria',
        'Nazwa',
        'Ilość',
        'Klasa'
    ];
    csvData.push(headers.join(';'));
    
    // Funkcja pomocnicza do pobrania klasy z odpowiednich tabel DATA
    function getItemClass(itemName, category) {
        let dataArray = [];
        if (category === 'SKP') {
            dataArray = SKP_DATA;
        } else if (category === 'Kat A') {
            dataArray = KATa_DATA;
        } else if (category === 'Kat B') {
            dataArray = KATB_DATA;
        } else if (category === 'Nastawnia') {
            dataArray = NASTAWNIA_DATA;
        }
        
        const item = dataArray.find(dataItem => dataItem.nazwa === itemName);
        return item ? item.klasa : 'brak';
    }
    
    // Iteracja przez obiekty i ich tabele do pobrania szczegółowych danych
    objects.forEach((objectElement) => {
        const id = objectElement.id.split('_')[1];
        const objectName = document.getElementById(`objectName_${id}`).value || 'Brak nazwy';
        const categoryRadio = objectElement.querySelector('input[type="radio"]:checked');
        const category = categoryRadio ? categoryRadio.value : 'Brak kategorii';
        
        // Znajdź odpowiednią tabelę na podstawie kategorii
        let table = null;
        if (category === 'SKP') {
            table = objectElement.querySelector('.skp-results table');
        } else if (category === 'Kat A') {
            table = objectElement.querySelector('.KATa-results table');
        } else if (category === 'Kat B') {
            table = objectElement.querySelector('.KATB-results table');
        }
        
        // Pobierz dane z tabeli
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const itemName = cells[1].textContent.trim();
                    let quantity = 0;
                    const qtyInput = cells[2].querySelector('input');
                    if (qtyInput) {
                        quantity = parseInt(qtyInput.value) || 0;
                    } else {
                        quantity = parseInt(cells[2].textContent.trim()) || 0;
                    }
                    
                    // Dodaj wiersz do CSV tylko jeśli ilość > 0
                    if (quantity > 0) {
                        const itemClass = getItemClass(itemName, category);
                        
                        const row = [
                            `"${objectName}"`,
                            `"${category}"`,
                            `"${itemName}"`,
                            quantity,
                            `"${itemClass}"`
                        ];
                        csvData.push(row.join(';'));
                    }
                }
            });
        }
    });

    // Przetwarzanie Nastawni
    nastawnie.forEach((nastawniaElement) => {
        const id = nastawniaElement.id.split('_')[1];
        const nastawniaName = document.getElementById(`nastawniaName_${id}`).value || 'Brak nazwy';
        const category = 'Nastawnia';
        
        const table = nastawniaElement.querySelector('.nastawnia-results table');
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const itemName = cells[1].textContent.trim();
                    let quantity = 0;
                    const qtyInput = cells[2].querySelector('input');
                    if (qtyInput) {
                        quantity = parseInt(qtyInput.value) || 0;
                    } else {
                        quantity = parseInt(cells[2].textContent.trim()) || 0;
                    }
                    
                    // Dodaj wiersz do CSV tylko jeśli ilość > 0
                    if (quantity > 0) {
                        const itemClass = getItemClass(itemName, category);
                        
                        const row = [
                            `"${nastawniaName}"`,
                            `"${category}"`,
                            `"${itemName}"`,
                            quantity,
                            `"${itemClass}"`
                        ];
                        csvData.push(row.join(';'));
                    }
                }
            });
        }
    });
    
    const csvContent = csvData.join('\n');
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const sanitizedTaskName = taskName.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '_');
    const filename = `wykaz_${sanitizedTaskName}_${dateStr}.csv`;
    
    return {
        csvContent,
        filename,
        taskName,
        objectCount: objects.length + nastawnie.length
    };
}

/**
 * Obsługuje zdarzenie submit formularza - zapisuje zadanie do CSV
 * @param {Event} event - Obiekt zdarzenia
 */
function handleSubmit(event) {
    event.preventDefault();
    
    const taskName = document.getElementById('taskName').value.trim();
    if (!taskName) {
        alert('Proszę wprowadzić nazwę zadania!');
        document.getElementById('taskName').focus();
        return;
    }
    
    // Przygotuj plik CSV
    const csvData = prepareTaskCSV(this);
    if (csvData.objectCount === 0) {
        alert('Brak danych do zapisania. Dodaj co najmniej jeden obiekt.');
        return;
    }
    
    // 1. POBIERZ PLIK CSV
    const blob = new Blob(['\ufeff' + csvData.csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', csvData.filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 2. WYŚLIJ E-MAILEM (z małym opóźnieniem)
    setTimeout(() => {
        sendCSVByEmail(csvData.csvContent, csvData.filename, csvData.taskName, true);
    }, 500);
    
    // 3. POKAŻ KOMUNIKAT O PODWÓJNEJ AKCJI
    showDualActionMessage(csvData.taskName, csvData.filename, true);
    
    // 4. AKTUALIZUJ WIDOK PODSUMOWANIA
    showResults(csvData.taskName);
}

/**
 * Wyświetla sekcję podsumowania zadania
 * @param {string} taskName - Nazwa zadania
 */
function showResults(taskName) {
    const resultsDiv = document.getElementById('results');
    const resultsContentDiv = document.getElementById('resultsContent');
    
    // Pokaż podsumowanie
    resultsDiv.classList.remove('hidden');
    
    // Dodaj treść podsumowania
    const summaryContent = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #2a5298; margin-bottom: 10px;">Zadanie "${taskName}" zostało zapisane!</h3>
            <p style="margin-bottom: 15px;">
                Dane zostały zapisane do pliku CSV i możesz je teraz otworzyć w arkuszu kalkulacyjnym (np. Excel, LibreOffice Calc).
            </p>
            <p>
                <strong>Pamiętaj:</strong> Podczas importu danych CSV wybierz "średnik" jako separator!
            </p>
        </div>
    `;
    
    resultsContentDiv.innerHTML = summaryContent;
    
    // Przewiń do sekcji podsumowania
    setTimeout(() => {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}