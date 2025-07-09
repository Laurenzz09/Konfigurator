// Tabelle mit gespeicherten Artikeln befüllen
function updateTable() {
    const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
    const tableBody = document.getElementById('artikelTable').querySelector('tbody');
    tableBody.innerHTML = '';

    items.forEach((item, index) => {
        const längen = parseInt(item.artikellaengen) || 0;
        const größen = parseInt(item.artikelgroessen) || 0;
        const varianten = längen * größen;

        // Varianten im Objekt speichern
        item.varianten = varianten;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.artikelname}</td>
            <td>${längen}</td>
            <td>${größen}</td>
            <td>${item.vollzeitMitarbeiter}</td>
            <td>${item.tauschquote}</td>
            <td>${item.lieferrhythmus}</td>
            <td>${varianten}</td>
            <td>${item.ausstattungsmenge}</td>
            <td>${item.tauschmenge}</td>
        `;
        tableBody.appendChild(row);
    });

    // Aktualisierte Artikel mit Varianten zurückspeichern
    localStorage.setItem('artikelItems', JSON.stringify(items));
}

// Excel-Download der Tabelle
function downloadExcel() {
    const artikelTable = document.getElementById("artikelTable");
    const modulTable = document.getElementById("modulTable");

    const wb = XLSX.utils.book_new();

    // Artikel-Tabelle (als Sheet "Artikel")
    const artikelSheet = XLSX.utils.table_to_sheet(artikelTable);
    XLSX.utils.book_append_sheet(wb, artikelSheet, "Artikel");

    // Modul-Tabelle (als Sheet "Module")
    const modulSheet = XLSX.utils.table_to_sheet(modulTable);
    XLSX.utils.book_append_sheet(wb, modulSheet, "Module");

    // Speichern unter "Ergebnisse.xlsx"
    XLSX.writeFile(wb, "Ergebnisse.xlsx");
}




function updateModulTabelle() {
    const tableBody = document.getElementById('modulTable').querySelector('tbody');
    tableBody.innerHTML = '';

    const daten = JSON.parse(localStorage.getItem('modulErgebnisse')) || {
        berechnungsgrundlage: '-',
        module: '-',
        containerRueckgabe: '-',
        anreiherRueckgabe: '-'
    };

    const zeilen = [
        { kategorie: "Berechnungsgrundlage", wert: daten.berechnungsgrundlage },
        { kategorie: "Empfohlene Module", wert: daten.module },
        { kategorie: "Container Rückgabe", wert: daten.containerRueckgabe },
        { kategorie: "Anreiher Rückgabe", wert: daten.anreiherRueckgabe },
    ];

    zeilen.forEach(eintrag => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${eintrag.kategorie}</td>
            <td>${eintrag.wert}</td>
        `;
        tableBody.appendChild(row);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    updateTable();          // Artikel-Tabelle
    updateModulTabelle();   // Modulrechner-Tabelle
});
