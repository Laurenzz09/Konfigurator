function calculateAll() {
  const data = JSON.parse(localStorage.getItem('artikelItems')) || [];

  if (data.length === 0) {
    document.getElementById('configurationBase').innerText = 'Keine Daten verfügbar.';
    document.getElementById('recommendedModules').innerText = 'Keine Daten verfügbar.';
    document.getElementById('systemsOverview').innerText = 'Keine Systeme erforderlich.';
    document.getElementById('containerReturn').innerText = '-';
    document.getElementById('rowReturn').innerText = '-';
    document.getElementById('analysisReport').innerText = 'Es wurden keine Daten zur Berechnung gefunden. Bitte konfigurieren Sie zunächst Artikel.';

    const emptyResult = {
      berechnungsgrundlage: 'Keine Daten verfügbar.',
      module: 'Keine Daten verfügbar.',
      containerRueckgabe: '-',
      anreiherRueckgabe: '-'
    };
    localStorage.setItem('modulErgebnisse', JSON.stringify(emptyResult));
    return;
  }

  // Konstanten
  const TAUSCHQUOTE = 2;
  const FÜLLMENGE_SCHRANK = 80;
  const MODULE_CAPACITY = 8;
  const CONTAINER_CAPACITY = 250;
  const ROW_MULTIPLIER = 3;

  // Werte berechnen
  const totalEmployees = data.reduce((sum, item) => sum + (parseInt(item.vollzeitMitarbeiter) || 0), 0);
  const totalVariants = data.reduce((sum, item) => sum + ((parseInt(item.artikellaengen) || 0) * (parseInt(item.artikelgroessen) || 0)), 0);

  const modulesByTauschmenge = Math.ceil((totalEmployees * TAUSCHQUOTE * 0.5) / FÜLLMENGE_SCHRANK);
  const modulesByVariants = Math.ceil(totalVariants / MODULE_CAPACITY);

  let configurationBase;
  let selectedModules;
  if (modulesByVariants > modulesByTauschmenge) {
    configurationBase = 'Varianten';
    selectedModules = modulesByVariants;
  } else {
    configurationBase = 'Tauschmenge';
    selectedModules = modulesByTauschmenge;
  }

  const systems = calculateSystemsBalanced(selectedModules);

  const totalTauschmenge = totalEmployees * TAUSCHQUOTE;
  const containerReturn = Math.ceil(totalTauschmenge / CONTAINER_CAPACITY / 5);
  const rowReturn = containerReturn * ROW_MULTIPLIER;

  // Ausgabe in HTML
  document.getElementById('configurationBase').innerText = configurationBase;
  document.getElementById('recommendedModules').innerText = `${selectedModules}`;
  const systemLines = systems.map((m, i) => `🟧 System ${i + 1}: ${m} Module`).join('\n');
  document.getElementById('systemsOverview').innerText = systemLines;
  document.getElementById('containerReturn').innerText = `${containerReturn}`;
  document.getElementById('rowReturn').innerText = `${rowReturn}`;

  // Bericht generieren
  const reportText = generateReport({
    base: configurationBase,
    modules: selectedModules,
    systems,
    containerReturn,
    rowReturn
  });
  document.getElementById('analysisReport').innerHTML = reportText;

  // Ergebnisse speichern
  const modulErgebnisse = {
    berechnungsgrundlage: configurationBase,
    module: `${selectedModules}`,
    containerRueckgabe: `${containerReturn}`,
    anreiherRueckgabe: `${rowReturn}`
  };
  localStorage.setItem('modulErgebnisse', JSON.stringify(modulErgebnisse));
}

function calculateSystemsBalanced(modules) {
  const MAX_MODULES_PER_SYSTEM = 12;
  const systems = [];

  if (modules <= MAX_MODULES_PER_SYSTEM) {
    systems.push(modules);
  } else {
    const half = Math.floor(modules / 2);
    systems.push(half);
    systems.push(modules - half);
  }

  return systems;
}

function generateReport({ base, modules, systems, containerReturn, rowReturn }) {
  const systemCount = systems.length;
  const systemVerteilung = systems.length === 1
    ? `Alle ${modules} Module sind in einem System untergebracht.`
    : `Die ${modules} Module verteilen sich auf <span class="highlight"> ${systemCount} Systeme</span> mit ${systems[0]} und ${systems[1]} Modulen.`;
  const grundlageSatz = base === 'Tauschmenge'
    ? `Die Berechnung basiert vorrangig auf der <span class="highlight">Tauschmenge</span>, also dem Bedarf an Wechselkleidung innerhalb eines definierten Zeitraums.`
    : `Die Berechnung basiert hauptsächlich auf der Anzahl der <span class="highlight">Artikelvarianten </span>, die für die Belegschaft bereitgestellt werden müssen.`;

  const optimierung = `
Um die Anzahl der benötigten Module weiter zu reduzieren, könnte die Belieferungshäufigkeit erhöht werden. 
Je häufiger die Frischwäschebestückung durchgeführt wird, desto geringer ist die notwendige Lagerkapazität. 
Zudem hilft eine Reduzierung der Variantenvielfalt (z. B. durch Standardgrößen), den Platzbedarf weiter zu minimieren.
Auch eine ausgeglichene Verteilung der Module auf die Systeme kann logistische Vorteile bringen.`;

  return `${grundlageSatz} Insgesamt werden <span class="highlight">${modules} Module</span> benötigt. ${systemVerteilung}
Zur Rückgabe der benutzten Kleidung sind <span class="highlight">${containerReturn} Container-Rückgaben</span> vorgesehen. Alternativ könnten <span class="highlight">${rowReturn} Anreiher-Rückgabe-Einheiten</span> genutzt werden.

${optimierung.trim()}`;
}

document.addEventListener('DOMContentLoaded', calculateAll);
