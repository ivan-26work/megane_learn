/* ═══════════════════════════════════════════════
   MEGANE_LEARN — structure.js
   Fonctions communes à toutes les pages circuits
═══════════════════════════════════════════════ */

// ── ÉLÉMENTS DOM COMMUNS ──
const logoBtn = document.getElementById('logoBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

// ── SIDEBAR ──
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (logoBtn) {
  logoBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
}

if (overlay) {
  overlay.addEventListener('click', closeSidebar);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

// ── DARK MODE ──
function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('ml_theme', dark ? 'dark' : 'light');
  if (darkToggle) darkToggle.checked = dark;
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('ml_theme');
if (savedTheme) {
  applyTheme(savedTheme === 'dark');
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark);
}

// Écouteur du toggle dark mode
if (darkToggle) {
  darkToggle.addEventListener('change', () => {
    applyTheme(darkToggle.checked);
    const row = darkToggle.closest('.dark-toggle-row');
    if (row) {
      row.style.transform = 'scale(0.98)';
      setTimeout(() => { row.style.transform = ''; }, 120);
    }
  });
}

// ── BOUTON RETOUR ──
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// ── GESTION DES ONGLETS ──
let currentTab = 'parametres';

function showTab(tabName) {
  currentTab = tabName;
  
  // Cacher tous les contenus
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Afficher le contenu sélectionné
  const activeContent = document.getElementById(`tab-${tabName}`);
  if (activeContent) activeContent.classList.add('active');
  
  // Mettre à jour les boutons actifs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });
}

// Initialiser les onglets
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const tabName = btn.getAttribute('data-tab');
    if (tabName) {
      btn.addEventListener('click', () => showTab(tabName));
    }
  });
  
  // Afficher l'onglet par défaut (paramètres)
  showTab('parametres');
});

// ── FORMATAGE DES GRANDS NOMBRES ──
function formatValue(value, unit) {
  if (value === Infinity || value === -Infinity) return '∞ ' + unit;
  if (isNaN(value)) return '0 ' + unit;
  
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(2) + ' M' + unit;
  }
  if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(2) + ' k' + unit;
  }
  if (Math.abs(value) < 1 && value !== 0) {
    return (value * 1000).toFixed(2) + ' m' + unit;
  }
  return value.toFixed(2) + ' ' + unit;
}

// ── FORMATAGE DES ANGLE ──
function formatAngle(degrees) {
  return degrees.toFixed(1) + '°';
}

// ── FORMATAGE DES PUISSANCES ──
function formatPower(value, unit) {
  if (value === Infinity || value === -Infinity) return '∞ ' + unit;
  if (isNaN(value)) return '0 ' + unit;
  
  if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(2) + ' M' + unit;
  }
  if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(2) + ' k' + unit;
  }
  return value.toFixed(2) + ' ' + unit;
}

// ── GESTION DES SLIDERS HORS LIMITES ──
function validateAndUpdate(sliders, inputs, param, value, thresholds, calculateAllCallback) {
  const slider = sliders[param];
  const input = inputs[param];
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  
  if (value >= min && value <= max) {
    // Valeur dans les limites
    slider.disabled = false;
    slider.classList.remove('disabled');
    input.classList.remove('out-of-range');
    slider.value = value;
    updateSliderColor(slider, value, param, thresholds);
  } else {
    // Valeur hors limites
    slider.disabled = true;
    slider.classList.add('disabled');
    input.classList.add('out-of-range');
  }
  
  if (calculateAllCallback) calculateAllCallback();
}

// ── COULEUR DU CURSEUR SELON LA VALEUR ──
function updateSliderColor(slider, value, param, thresholds) {
  let colorClass = '';
  const t = thresholds[param];
  
  if (!t) return;
  
  if (value <= t.vert) colorClass = 'thumb-vert';
  else if (value <= t.orange) colorClass = 'thumb-orange';
  else colorClass = 'thumb-rouge';
  
  slider.classList.remove('thumb-vert', 'thumb-orange', 'thumb-rouge');
  slider.classList.add(colorClass);
}

// ── SYNCHRONISATION SLIDER ↔ TEXTAREA ──
function syncSliderInput(param, sliders, inputs, thresholds, calculateAllCallback) {
  const slider = sliders[param];
  const input = inputs[param];
  
  if (!slider || !input) return;
  
  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    input.value = val;
    updateSliderColor(slider, val, param, thresholds);
    if (calculateAllCallback) calculateAllCallback();
  });
  
  input.addEventListener('input', () => {
    let v = parseFloat(input.value);
    if (!isNaN(v)) {
      validateAndUpdate(sliders, inputs, param, v, thresholds, calculateAllCallback);
    }
  });
}

// ── RÉINITIALISATION DES VALEURS PAR DÉFAUT ──
function resetToDefault(sliders, inputs, defaults, thresholds, calculateAllCallback) {
  for (const param in defaults) {
    const defaultVal = defaults[param];
    const slider = sliders[param];
    const input = inputs[param];
    
    if (slider && input) {
      slider.value = defaultVal;
      input.value = defaultVal;
      slider.disabled = false;
      slider.classList.remove('disabled');
      input.classList.remove('out-of-range');
      updateSliderColor(slider, defaultVal, param, thresholds);
    }
  }
  
  if (calculateAllCallback) calculateAllCallback();
}

// ── ANIMATION D'ENTRÉE DES CARTES ──
function animateCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 80);
  });
}

// ── AFFICHAGE D'UN MESSAGE DE CHARGEMENT ──
function showLoading(message = 'Chargement...') {
  const loader = document.createElement('div');
  loader.className = 'custom-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <i class="fas fa-spinner fa-pulse"></i>
      <span>${message}</span>
    </div>
  `;
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  `;
  document.body.appendChild(loader);
  return loader;
}

function hideLoading(loader) {
  if (loader) {
    loader.remove();
  }
}

// ── GESTION DES ERREURS ──
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-toast';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  errorDiv.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #e74c3c;
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 0.85rem;
    font-weight: 600;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
  `;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => errorDiv.remove(), 300);
  }, 3000);
}

// ── ANIMATIONS CSS POUR LES TOASTS ──
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
  }
`;
document.head.appendChild(style);

// ── EXPORT DES FONCTIONS (si nécessaire) ──
// Les fonctions sont disponibles globalement pour les scripts spécifiques
window.MEGANE = {
  formatValue,
  formatAngle,
  formatPower,
  validateAndUpdate,
  updateSliderColor,
  syncSliderInput,
  resetToDefault,
  animateCards,
  showLoading,
  hideLoading,
  showError
};