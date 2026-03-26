/* ═══════════════════════════════════════════════
   MEGANE_LEARN — convert.js
   Convertisseur d'unités avec 20 catégories
═══════════════════════════════════════════════ */

// ── DONNÉES DES CONVERSIONS ──
const conversions = {
  tension: {
    name: 'Tension',
    icon: 'fa-bolt',
    units: ['V', 'kV', 'mV', 'µV', 'nV', 'pV'],
    factors: { V: 1, kV: 1000, mV: 0.001, µV: 0.000001, nV: 1e-9, pV: 1e-12 },
    toBase: (val, unit) => val * conversions.tension.factors[unit],
    fromBase: (val, unit) => val / conversions.tension.factors[unit]
  },
  courant: {
    name: 'Courant',
    icon: 'fa-waveform',
    units: ['A', 'kA', 'mA', 'µA', 'nA', 'pA'],
    factors: { A: 1, kA: 1000, mA: 0.001, µA: 0.000001, nA: 1e-9, pA: 1e-12 },
    toBase: (val, unit) => val * conversions.courant.factors[unit],
    fromBase: (val, unit) => val / conversions.courant.factors[unit]
  },
  resistance: {
    name: 'Résistance',
    icon: 'fa-resistor',
    units: ['Ω', 'kΩ', 'MΩ', 'GΩ', 'mΩ'],
    factors: { Ω: 1, kΩ: 1000, MΩ: 1e6, GΩ: 1e9, mΩ: 0.001 },
    toBase: (val, unit) => val * conversions.resistance.factors[unit],
    fromBase: (val, unit) => val / conversions.resistance.factors[unit]
  },
  inductance: {
    name: 'Inductance',
    icon: 'fa-coil',
    units: ['H', 'kH', 'mH', 'µH', 'nH'],
    factors: { H: 1, kH: 1000, mH: 0.001, µH: 0.000001, nH: 1e-9 },
    toBase: (val, unit) => val * conversions.inductance.factors[unit],
    fromBase: (val, unit) => val / conversions.inductance.factors[unit]
  },
  capacite: {
    name: 'Capacité',
    icon: 'fa-capacitor',
    units: ['F', 'kF', 'mF', 'µF', 'nF', 'pF'],
    factors: { F: 1, kF: 1000, mF: 0.001, µF: 0.000001, nF: 1e-9, pF: 1e-12 },
    toBase: (val, unit) => val * conversions.capacite.factors[unit],
    fromBase: (val, unit) => val / conversions.capacite.factors[unit]
  },
  frequence: {
    name: 'Fréquence',
    icon: 'fa-chart-line',
    units: ['Hz', 'kHz', 'MHz', 'GHz', 'THz'],
    factors: { Hz: 1, kHz: 1000, MHz: 1e6, GHz: 1e9, THz: 1e12 },
    toBase: (val, unit) => val * conversions.frequence.factors[unit],
    fromBase: (val, unit) => val / conversions.frequence.factors[unit]
  },
  temperature: {
    name: 'Température',
    icon: 'fa-temperature-high',
    units: ['°C', '°F', 'K'],
    toBase: (val, unit) => {
      if (unit === '°C') return val;
      if (unit === '°F') return (val - 32) * 5/9;
      if (unit === 'K') return val - 273.15;
      return val;
    },
    fromBase: (val, unit) => {
      if (unit === '°C') return val;
      if (unit === '°F') return val * 9/5 + 32;
      if (unit === 'K') return val + 273.15;
      return val;
    }
  },
  longueur: {
    name: 'Longueur',
    icon: 'fa-ruler',
    units: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm', 'µm', 'nm', 'pm'],
    factors: { km: 1000, hm: 100, dam: 10, m: 1, dm: 0.1, cm: 0.01, mm: 0.001, µm: 1e-6, nm: 1e-9, pm: 1e-12 },
    toBase: (val, unit) => val * conversions.longueur.factors[unit],
    fromBase: (val, unit) => val / conversions.longueur.factors[unit]
  },
  masse: {
    name: 'Masse',
    icon: 'fa-weight-hanging',
    units: ['t', 'q', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg', 'µg', 'ng'],
    factors: { t: 1000, q: 100, kg: 1, hg: 0.1, dag: 0.01, g: 0.001, dg: 0.0001, cg: 0.00001, mg: 0.000001, µg: 1e-9, ng: 1e-12 },
    toBase: (val, unit) => val * conversions.masse.factors[unit],
    fromBase: (val, unit) => val / conversions.masse.factors[unit]
  },
  temps: {
    name: 'Temps',
    icon: 'fa-hourglass-half',
    units: ['h', 'min', 's', 'ms', 'µs', 'ns', 'ps'],
    factors: { h: 3600, min: 60, s: 1, ms: 0.001, µs: 1e-6, ns: 1e-9, ps: 1e-12 },
    toBase: (val, unit) => val * conversions.temps.factors[unit],
    fromBase: (val, unit) => val / conversions.temps.factors[unit]
  },
  donnees: {
    name: 'Données',
    icon: 'fa-database',
    units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
    factors: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 },
    toBase: (val, unit) => val * conversions.donnees.factors[unit],
    fromBase: (val, unit) => val / conversions.donnees.factors[unit]
  },
  vitesse: {
    name: 'Vitesse',
    icon: 'fa-tachometer-alt',
    units: ['m/s', 'km/h', 'mph', 'nœuds'],
    factors: { 'm/s': 1, 'km/h': 0.2777778, 'mph': 0.44704, 'nœuds': 0.514444 },
    toBase: (val, unit) => val * conversions.vitesse.factors[unit],
    fromBase: (val, unit) => val / conversions.vitesse.factors[unit]
  },
  energie: {
    name: 'Énergie',
    icon: 'fa-charging-station',
    units: ['J', 'kJ', 'MJ', 'GJ', 'Wh', 'kWh', 'MWh', 'cal', 'kcal'],
    factors: { J: 1, kJ: 1000, MJ: 1e6, GJ: 1e9, Wh: 3600, kWh: 3.6e6, MWh: 3.6e9, cal: 4.184, kcal: 4184 },
    toBase: (val, unit) => val * conversions.energie.factors[unit],
    fromBase: (val, unit) => val / conversions.energie.factors[unit]
  },
  puissance: {
    name: 'Puissance',
    icon: 'fa-chart-pie',
    units: ['W', 'kW', 'MW', 'GW', 'CV', 'ch', 'hp'],
    factors: { W: 1, kW: 1000, MW: 1e6, GW: 1e9, CV: 735.5, ch: 735.5, hp: 745.7 },
    toBase: (val, unit) => val * conversions.puissance.factors[unit],
    fromBase: (val, unit) => val / conversions.puissance.factors[unit]
  },
  pression: {
    name: 'Pression',
    icon: 'fa-thermometer-half',
    units: ['Pa', 'hPa', 'kPa', 'MPa', 'bar', 'mbar', 'psi', 'atm', 'mmHg'],
    factors: { Pa: 1, hPa: 100, kPa: 1000, MPa: 1e6, bar: 1e5, mbar: 100, psi: 6894.76, atm: 101325, mmHg: 133.322 },
    toBase: (val, unit) => val * conversions.pression.factors[unit],
    fromBase: (val, unit) => val / conversions.pression.factors[unit]
  },
  surface: {
    name: 'Surface',
    icon: 'fa-table-cells-large',
    units: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²', 'ha', 'a'],
    factors: { 'km²': 1e6, 'hm²': 10000, 'dam²': 100, 'm²': 1, 'dm²': 0.01, 'cm²': 0.0001, 'mm²': 1e-6, 'ha': 10000, 'a': 100 },
    toBase: (val, unit) => val * conversions.surface.factors[unit],
    fromBase: (val, unit) => val / conversions.surface.factors[unit]
  },
  volume: {
    name: 'Volume',
    icon: 'fa-cube',
    units: ['m³', 'dm³', 'cm³', 'mm³', 'L', 'dL', 'cL', 'mL', 'gal', 'qt', 'pt'],
    factors: { 'm³': 1, 'dm³': 0.001, 'cm³': 1e-6, 'mm³': 1e-9, L: 0.001, dL: 0.0001, cL: 0.00001, mL: 0.000001, gal: 0.00378541, qt: 0.000946353, pt: 0.000473176 },
    toBase: (val, unit) => val * conversions.volume.factors[unit],
    fromBase: (val, unit) => val / conversions.volume.factors[unit]
  },
  angle: {
    name: 'Angle',
    icon: 'fa-angle-double-right',
    units: ['deg', 'rad', 'grad', 'tour', 'arcmin', 'arcsec'],
    factors: { deg: 1, rad: 57.2958, grad: 0.9, tour: 360, arcmin: 0.0166667, arcsec: 0.000277778 },
    toBase: (val, unit) => val * conversions.angle.factors[unit],
    fromBase: (val, unit) => val / conversions.angle.factors[unit]
  },
  pourcentage: {
    name: 'Pourcentage',
    icon: 'fa-percent',
    units: ['%', '‰', 'fraction', 'ratio'],
    factors: { '%': 1, '‰': 0.1, fraction: 100, ratio: 100 },
    toBase: (val, unit) => val * conversions.pourcentage.factors[unit],
    fromBase: (val, unit) => val / conversions.pourcentage.factors[unit]
  },
  charge: {
    name: 'Charge électrique',
    icon: 'fa-battery-full',
    units: ['C', 'mC', 'µC', 'nC', 'pC', 'Ah', 'mAh'],
    factors: { C: 1, mC: 0.001, µC: 1e-6, nC: 1e-9, pC: 1e-12, Ah: 3600, mAh: 3.6 },
    toBase: (val, unit) => val * conversions.charge.factors[unit],
    fromBase: (val, unit) => val / conversions.charge.factors[unit]
  }
};

const conversionKeys = Object.keys(conversions);
let currentConversion = 'tension';
let inputUnit = 'V';
let outputUnit = 'V';

// ── RÉFÉRENCES DOM ──
const inputUnitsContainer = document.getElementById('inputUnits');
const outputUnitsContainer = document.getElementById('outputUnits');
const inputValue = document.getElementById('inputValue');
const resultValue = document.getElementById('resultValue');
const conversionNav = document.getElementById('conversionNav');
const inputHeader = document.getElementById('inputHeader');
const outputHeader = document.getElementById('outputHeader');

// ── FORMATAGE DU RÉSULTAT (affichage intégral) ──
function formatResult(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  // Pour les entiers
  if (Number.isInteger(value)) {
    return value.toString();
  }
  
  // Pour les décimaux - afficher sans notation scientifique
  let str = value.toString();
  
  // Si c'est en notation scientifique (ex: 1.23e-7)
  if (str.includes('e')) {
    // Convertir en nombre décimal complet
    str = value.toFixed(20).replace(/\.?0+$/, '');
  }
  
  // Supprimer les zéros inutiles à la fin
  str = str.replace(/\.?0+$/, '');
  
  // Si c'est un nombre très petit qui devient "0" après nettoyage
  if (str === '0' && value !== 0) {
    str = value.toFixed(15).replace(/\.?0+$/, '');
  }
  
  return str;
}

// ── AJUSTER LA TAILLE DU TEXTE SELON LA LONGUEUR ──
function adjustResultFontSize() {
  const resultElement = document.querySelector('.result-value');
  if (!resultElement) return;
  
  const textLength = resultElement.textContent.length;
  
  if (textLength < 6) {
    resultElement.style.fontSize = '2.5rem';
  } else if (textLength < 10) {
    resultElement.style.fontSize = '1.8rem';
  } else if (textLength < 15) {
    resultElement.style.fontSize = '1.4rem';
  } else if (textLength < 20) {
    resultElement.style.fontSize = '1.1rem';
  } else {
    resultElement.style.fontSize = '0.9rem';
  }
}

// ── METTRE À JOUR LES HEADERS AVEC L'UNITÉ SÉLECTIONNÉE ──
function updateCardHeaders() {
  if (inputHeader) {
    inputHeader.innerHTML = `<i class="fas fa-arrow-left-from-bracket"></i> Valeur à convertir <span class="selected-unit">${inputUnit}</span>`;
  }
  if (outputHeader) {
    outputHeader.innerHTML = `<i class="fas fa-arrow-right-to-bracket"></i> Résultat <span class="selected-unit">${outputUnit}</span>`;
  }
}

// ── FONCTION DE CONVERSION ──
function convert() {
  const conv = conversions[currentConversion];
  const val = parseFloat(inputValue.value) || 0;
  
  let baseVal;
  if (currentConversion === 'temperature') {
    baseVal = conv.toBase(val, inputUnit);
  } else {
    baseVal = conv.toBase(val, inputUnit);
  }
  
  let result;
  if (currentConversion === 'temperature') {
    result = conv.fromBase(baseVal, outputUnit);
  } else {
    result = conv.fromBase(baseVal, outputUnit);
  }
  
  resultValue.textContent = formatResult(result);
  adjustResultFontSize();
}

// ── AFFICHAGE DES UNITÉS ──
function renderUnits() {
  const conv = conversions[currentConversion];
  const units = conv.units;
  
  inputUnitsContainer.innerHTML = units.map(unit => `
    <button class="unit-btn ${unit === inputUnit ? 'active' : ''}" data-unit="${unit}" data-type="input">
      ${unit}
    </button>
  `).join('');
  
  outputUnitsContainer.innerHTML = units.map(unit => `
    <button class="unit-btn ${unit === outputUnit ? 'active' : ''}" data-unit="${unit}" data-type="output">
      ${unit}
    </button>
  `).join('');
  
  // Attacher événements
  document.querySelectorAll('.unit-btn[data-type="input"]').forEach(btn => {
    btn.addEventListener('click', () => {
      inputUnit = btn.getAttribute('data-unit');
      renderUnits();
      updateCardHeaders();
      convert();
    });
  });
  
  document.querySelectorAll('.unit-btn[data-type="output"]').forEach(btn => {
    btn.addEventListener('click', () => {
      outputUnit = btn.getAttribute('data-unit');
      renderUnits();
      updateCardHeaders();
      convert();
    });
  });
  
  updateCardHeaders();
}

// ── AFFICHAGE DE LA NAVIGATION ──
function renderNav() {
  conversionNav.innerHTML = conversionKeys.map(key => `
    <button class="conversion-nav-btn ${key === currentConversion ? 'active' : ''}" data-conversion="${key}">
      <i class="fas ${conversions[key].icon}"></i>
      <span>${conversions[key].name}</span>
    </button>
  `).join('');
  
  document.querySelectorAll('.conversion-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentConversion = btn.getAttribute('data-conversion');
      inputUnit = conversions[currentConversion].units[0];
      outputUnit = conversions[currentConversion].units[0];
      renderNav();
      renderUnits();
      convert();
    });
  });
}

// ── FAVORIS DANS LA SIDEBAR ──
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('megane_favorites') || '[]');
  const favoritesSection = document.getElementById('favoritesSection');
  if (!favoritesSection) return;
  
  if (favorites.length === 0) {
    favoritesSection.innerHTML = '';
    return;
  }
  
  favoritesSection.innerHTML = `
    <div class="sidebar-divider"></div>
    <div class="favorites-header">
      <i class="fas fa-star"></i> Mes favoris
    </div>
    <nav class="sidebar-nav">
      ${favorites.map(fav => `
        <a href="${fav.href}" class="sidebar-btn fav-btn" data-name="${fav.name}">
          <i class="fas fa-star"></i> ${fav.name}
        </a>
      `).join('')}
    </nav>
  `;
  
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = btn.getAttribute('href');
    });
  });
}

// ── INITIALISATION ──
function init() {
  renderNav();
  renderUnits();
  
  inputValue.value = 0;
  
  inputValue.addEventListener('input', convert);
  loadFavorites();
  
  convert();
  
  window.addEventListener('storage', loadFavorites);
}

init();