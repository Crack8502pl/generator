/**
 * Obsługa wysyłania e-maili
 */

/**
 * Wysyła CSV przez mailto
 * @param {string} csvContent - Zawartość pliku CSV
 * @param {string} filename - Nazwa pliku
 * @param {string} taskName - Nazwa zadania
 * @param {boolean} isTask - Czy jest to zadanie (true) czy podsumowanie (false)
 */
function sendCSVByEmail(csvContent, filename, taskName, isTask = false) {
    // Sprawdź czy elementy istnieją
    const recipientEmailElement = document.getElementById('recipientEmail');
    const senderNameElement = document.getElementById('senderName');
    const subjectPrefixElement = document.getElementById('emailSubjectPrefix');
    
    if (!recipientEmailElement || !senderNameElement || !subjectPrefixElement) {
        console.log('Brak elementów konfiguracji e-mail - pomijam wysyłanie');
        return;
    }
    
    const recipientEmail = recipientEmailElement.value;
    const senderName = senderNameElement.value || 'System DER-MAG';
    const subjectPrefix = subjectPrefixElement.value || '[DER-MAG]';
    
    // Jeśli brak adresu e-mail, pomiń wysyłanie ale nie pokazuj błędu
    if (!recipientEmail || recipientEmail.trim() === '') {
        console.log('Brak adresu e-mail - pomijam wysyłanie');
        return;
    }
    
    const fileType = isTask ? 'wykaz' : 'zestawienie';
    const subject = encodeURIComponent(`${subjectPrefix} ${fileType.toUpperCase()}: ${taskName}`);
    
    // Podstawowa treść e-maila (bez danych CSV)
    const emailBody = `
Witam,

Przesyłam ${fileType} z systemu zarządzania zadaniami DER-MAG.

SZCZEGÓŁY ZADANIA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nazwa zadania: ${taskName}
• Typ dokumentu: ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}
• Data utworzenia: ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL')}
• Nazwa pliku: ${filename}
• Utworzono przez: ${senderName}
• Liczba pozycji: ${csvContent.split('\n').length - 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ZAŁĄCZNIK:
Dane CSV zostały dołączone jako załącznik do tego e-maila.
Aby otworzyć plik:
1. Zapisz załącznik na dysku
2. Otwórz w programie Excel/LibreOffice Calc
3. Użyj separatora ";" (średnik) przy imporcie

ALTERNATYWNIE:
Jeśli załącznik nie został dołączony automatycznie, dane CSV zostały
już pobrane do folderu Downloads na Twoim komputerze.

Pozdrawiam,
${senderName}
System DER-MAG - Systemy Teletechniczne

--
Wiadomość wygenerowana automatycznie przez System Zarządzania Zadaniami DER-MAG
Data: ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL')}
    `;
    
    const body = encodeURIComponent(emailBody);
    
    // Sprawdź długość podstawowego e-maila (bez danych CSV)
    const basicMailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    
    if (basicMailtoLink.length > 2000) {
        // Nawet podstawowy e-mail jest za długi - wyślij minimum
        sendMinimalEmail(recipientEmail, subject, taskName, filename, senderName);
        return;
    }
    
    // Spróbuj utworzyć załącznik
    try {
        // Utwórz plik CSV jako Blob
        const csvBlob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Sprawdź czy przeglądarka obsługuje File System Access API
        if ('showSaveFilePicker' in window) {
            // Nowoczesne przeglądarki - spróbuj zapisać plik i otworzyć e-mail
            saveFileAndOpenEmail(csvBlob, filename, basicMailtoLink);
        } else {
            // Starsze przeglądarki - użyj tradycyjnego podejścia
            openEmailWithFileInfo(basicMailtoLink, filename);
        }
        
    } catch (error) {
        console.error('Błąd podczas tworzenia załącznika:', error);
        // Fallback - otwórz podstawowy e-mail
        openEmailWithFileInfo(basicMailtoLink, filename);
    }
}

/**
 * Wysyła minimalną wersję e-maila (gdy standardowy jest za długi)
 * @param {string} recipientEmail - Adres e-mail odbiorcy
 * @param {string} subject - Temat e-maila
 * @param {string} taskName - Nazwa zadania
 * @param {string} filename - Nazwa pliku
 * @param {string} senderName - Nazwa nadawcy
 */
function sendMinimalEmail(recipientEmail, subject, taskName, filename, senderName) {
    const minimalBody = encodeURIComponent(
        `Wygenerowano zadanie: ${taskName}\n\n` +
        `Plik ${filename} został pobrany lokalnie.\n\n` +
        `Pozdrawiam,\n${senderName}`
    );
    
    try {
        window.open(`mailto:${recipientEmail}?subject=${subject}&body=${minimalBody}`);
    } catch (error) {
        console.error('Nie można otworzyć klienta e-mail:', error);
    }
}

/**
 * Funkcja do zapisania pliku i otwarcia e-maila (nowoczesne przeglądarki)
 * @param {Blob} csvBlob - Obiekt Blob z danymi CSV
 * @param {string} filename - Nazwa pliku
 * @param {string} mailtoLink - Link mailto
 */
async function saveFileAndOpenEmail(csvBlob, filename, mailtoLink) {
    try {
        // Pokaż dialog zapisu pliku
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [{
                description: 'Pliki CSV',
                accept: {
                    'text/csv': ['.csv']
                }
            }]
        });
        
        // Zapisz plik
        const writable = await fileHandle.createWritable();
        await writable.write(csvBlob);
        await writable.close();
        
        console.log('Plik CSV został zapisany przez użytkownika');
        
        // Otwórz e-mail z informacją o zapisanym pliku
        setTimeout(() => {
            window.open(mailtoLink);
            console.log('E-mail został otwarty z informacją o załączniku');
        }, 500);
        
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Błąd podczas zapisywania pliku:', error);
        }
        // Fallback - otwórz podstawowy e-mail
        openEmailWithFileInfo(mailtoLink, filename);
    }
}

/**
 * Funkcja do otwarcia e-maila z informacją o pliku
 * @param {string} mailtoLink - Link mailto
 * @param {string} filename - Nazwa pliku
 */
function openEmailWithFileInfo(mailtoLink, filename) {
    try {
        window.open(mailtoLink);
        console.log('E-mail został otwarty z informacją o pliku CSV');
        
        // Pokaż dodatkową informację użytkownikowi
        setTimeout(() => {
            alert(`E-mail został przygotowany!\n\nPlik CSV: ${filename}\nZostał pobrany do folderu Downloads.\n\nDołącz go ręcznie do e-maila jako załącznik.`);
        }, 1000);
        
    } catch (error) {
        console.error('Błąd podczas otwierania e-maila:', error);
        alert(`Nie można otworzyć klienta e-mail.\n\nPlik CSV: ${filename}\nZostał pobrany do folderu Downloads.`);
    }
}

/**
 * Wyświetla komunikat o podwójnej akcji (pobranie + email)
 * @param {string} taskName - Nazwa zadania
 * @param {string} filename - Nazwa pliku
 * @param {boolean} isTask - Czy jest to zadanie (true) czy podsumowanie (false)
 */
function showDualActionMessage(taskName, filename, isTask = false) {
    const fileType = isTask ? 'wykaz' : 'zestawienie';
    const recipientEmail = document.getElementById('recipientEmail').value;
    
    if (recipientEmail && recipientEmail.trim() !== '') {
        const message = `
            <div style="text-align: center; padding: 20px; background: #eef2f7; border-radius: 10px; margin: 20px 0;">
                <h3 style="margin-bottom: 15px; color: #2a5298;">✅ ${fileType.toUpperCase()} został zapisany!</h3>
                <p>Plik <strong>${filename}</strong> został pobrany na Twój komputer.</p>
                <p style="margin: 10px 0;">
                    <strong>DODATKOWO:</strong> Wiadomość e-mail do <em>${recipientEmail}</em> została przygotowana.
                </p>
                <p style="font-size: 0.9em; opacity: 0.8; margin-top: 15px;">
                    Sprawdź okno klienta e-mail, aby wysłać wiadomość.
                </p>
            </div>
        `;
        
        // Wyświetl komunikat na stronie
        const resultsContentDiv = document.getElementById('resultsContent');
        if (resultsContentDiv) {
            resultsContentDiv.innerHTML = message + resultsContentDiv.innerHTML;
        }
    }
}