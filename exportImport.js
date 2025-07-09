function exportArticles() {
  const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
  const projectNameInput = document.getElementById('projectInput');
  const projectName = projectNameInput?.value.trim() || 'projekt_unbenannt';

  const exportData = {
    projectName: projectName,
    articles: items
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'artikel_export'}.json`;
  a.click();

  URL.revokeObjectURL(url);

  Swal.fire({
    icon: 'success',
    title: 'Exportiert!',
    text: 'Die Artikeldaten wurden erfolgreich gespeichert.',
    timer: 2000,
    showConfirmButton: false
  });
}

function importArticles() {
  const fileInput = document.getElementById('importFile');
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (Array.isArray(importedData)) {
          // alte Struktur ohne Projektnamen (abwärtskompatibel)
          localStorage.setItem('artikelItems', JSON.stringify(importedData));
        } else if (importedData.articles && Array.isArray(importedData.articles)) {
          localStorage.setItem('artikelItems', JSON.stringify(importedData.articles));

          // Projektnamen ins Input-Feld schreiben
          const projectInput = document.getElementById('projectInput');
          if (projectInput && importedData.projectName) {
            projectInput.value = importedData.projectName;
          }
        } else {
          return Swal.fire({
            icon: 'error',
            title: 'Ungültiges Format',
            text: 'Die Datei enthält keine gültige Artikelliste.'
          });
        }

        loadItems(); // deine vorhandene Funktion

        Swal.fire({
          icon: 'success',
          title: 'Importiert!',
          text: 'Die Artikeldaten wurden erfolgreich geladen.',
          timer: 2000,
          showConfirmButton: false
        });

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Fehler beim Importieren',
          text: 'Bitte stelle sicher, dass es sich um eine gültige JSON-Datei handelt.'
        });
      }
    };

    reader.readAsText(file);
  };
}
