/* ═══════════════════════════════════════════════
   MEGANE_LEARN — index.js
   Sidebar, dark mode, recherche, favoris (localStorage), loader, appui long
═══════════════════════════════════════════════ */

/* ── Éléments DOM ── */
const logoBtn     = document.getElementById('logoBtn');
const sidebar     = document.getElementById('sidebar');
const overlay     = document.getElementById('sidebarOverlay');
const darkToggle  = document.getElementById('darkToggle');
const searchInput = document.getElementById('searchInput');
const favSection  = document.getElementById('favSection');
const favList     = document.getElementById('favList');
const toastEl     = document.getElementById('toast');
const html        = document.documentElement;

/* ═══════════════════════════════════════════════
   DARK MODE
═══════════════════════════════════════════════ */
function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('ml_theme', dark ? 'dark' : 'light');
  darkToggle.checked = dark;
}

const savedTheme = localStorage.getItem('ml_theme');
if (savedTheme) {
  applyTheme(savedTheme === 'dark');
} else {
  applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

darkToggle.addEventListener('change', () => {
  applyTheme(darkToggle.checked);
  const row = darkToggle.closest('.dark-toggle-row');
  row.style.transform = 'scale(0.97)';
  setTimeout(() => row.style.transform = '', 120);
});

/* ═══════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════ */
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Animation cascade boutons
  const btns = sidebar.querySelectorAll('.sidebar-btn, .fav-item');
  btns.forEach((b, i) => {
    b.style.opacity = '0';
    b.style.transform = 'translateX(18px)';
    setTimeout(() => {
      b.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      b.style.opacity = '1';
      b.style.transform = 'translateX(0)';
    }, 60 + i * 45);
  });
}

function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

logoBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

/* ═══════════════════════════════════════════════
   LOADER NITRO
═══════════════════════════════════════════════ */
function runLoader(href) {
  // Créer le loader
  const wrap = document.createElement('div');
  wrap.id = 'nitroLoader';
  wrap.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    background:var(--bg);
    transition:opacity 0.25s ease;
  `;

  const track = document.createElement('div');
  track.style.cssText = `
    width:160px; height:6px; border-radius:3px;
    background:var(--shadow-dark);
    box-shadow:inset 2px 2px 5px var(--shadow-dark),inset -2px -2px 5px var(--shadow-light);
    overflow:hidden; position:relative;
  `;

  const bar = document.createElement('div');
  bar.style.cssText = `
    height:100%; width:0%; border-radius:3px;
    background:linear-gradient(90deg,#4f7cff,#a78bfa,#4f7cff);
    background-size:200% 100%;
    box-shadow:0 0 10px #4f7cff88;
    transition:width 1.9s cubic-bezier(0.1,0.6,0.4,1);
    animation:nitroShine 1s linear infinite;
  `;

  const lbl = document.createElement('div');
  lbl.style.cssText = `
    margin-top:12px;
    font-family:'Share Tech Mono',monospace;
    font-size:0.7rem; letter-spacing:2px;
    color:var(--text-muted);
  `;
  lbl.textContent = 'CHARGEMENT...';

  if (!document.getElementById('nitroStyle')) {
    const s = document.createElement('style');
    s.id = 'nitroStyle';
    s.textContent = `@keyframes nitroShine{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
    document.head.appendChild(s);
  }

  track.appendChild(bar);
  wrap.appendChild(track);
  wrap.appendChild(lbl);
  document.body.appendChild(wrap);

  requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = '100%'; }));

  setTimeout(() => {
    wrap.style.opacity = '0';
    setTimeout(() => window.location.href = href, 250);
  }, 2000);
}

/* ═══════════════════════════════════════════════
   FAVORIS — localStorage
═══════════════════════════════════════════════ */
let favorites = new Set(JSON.parse(localStorage.getItem('ml_favorites') || '[]'));

function saveFavorites() {
  localStorage.setItem('ml_favorites', JSON.stringify([...favorites]));
}

function updateFavSidebar() {
  favList.innerHTML = '';

  if (favorites.size === 0) {
    favSection.style.display = 'none';
    return;
  }

  favSection.style.display = 'flex';

  favorites.forEach(name => {
    // Retrouver les hrefs depuis le DOM
    const item = document.querySelector(`.circuit-item[data-name="${name}"]`);
    const simHref  = item ? item.dataset.sim  : '#';
    const coursHref = item ? item.dataset.cours : '#';

    const btn = document.createElement('button');
    btn.className = 'fav-item';
    btn.innerHTML = `<i class="fas fa-star"></i> ${name}`;
    btn.addEventListener('click', () => {
      closeSidebar();
      runLoader(simHref);
    });
    favList.appendChild(btn);
  });
}

function applyFavoriteState(item) {
  const name = item.dataset.name;
  if (favorites.has(name)) {
    item.classList.add('favorited');
  } else {
    item.classList.remove('favorited');
  }
}

/* ═══════════════════════════════════════════════
   APPUI LONG (1000ms) — Favoris
═══════════════════════════════════════════════ */
function initCircuitItems() {
  document.querySelectorAll('.circuit-item').forEach(item => {
    const name     = item.dataset.name;
    const simHref  = item.dataset.sim;
    const coursHref = item.dataset.cours;
    const bar      = item.querySelector('.hold-bar');

    // Restaurer état favori depuis localStorage
    applyFavoriteState(item);

    let holdTimer    = null;
    let holdInterval = null;
    let holding      = false;

    function startHold(e) {
      // Ne pas déclencher si clic sur bouton action
      if (e.target.closest('.action-btn')) return;
      holding = true;
      let progress = 0;
      bar.style.transition = 'none';
      bar.style.width = '0%';

      holdInterval = setInterval(() => {
        progress += 100 / (1000 / 30);
        bar.style.width = Math.min(progress, 100) + '%';
      }, 30);

      holdTimer = setTimeout(() => {
        clearInterval(holdInterval);
        bar.style.transition = 'width 0.2s ease';
        bar.style.width = '0%';
        holding = false;

        // Toggle favori
        if (favorites.has(name)) {
          favorites.delete(name);
          item.classList.remove('favorited');
          showToast(`${name} retiré des favoris`);
        } else {
          favorites.add(name);
          item.classList.add('favorited');
          showToast(`${name} ajouté aux favoris ⭐`);
        }

        saveFavorites();
        updateFavSidebar();
      }, 1000);
    }

    function cancelHold() {
      if (!holding) return;
      clearTimeout(holdTimer);
      clearInterval(holdInterval);
      holding = false;
      bar.style.transition = 'width 0.2s ease';
      bar.style.width = '0%';
    }

    item.addEventListener('mousedown',  startHold);
    item.addEventListener('touchstart', startHold, { passive: true });
    item.addEventListener('mouseup',    cancelHold);
    item.addEventListener('mouseleave', cancelHold);
    item.addEventListener('touchend',   cancelHold);
    item.addEventListener('touchcancel',cancelHold);

    /* ── Bouton simulation ── */
    item.querySelector('.action-btn.sim').addEventListener('click', e => {
      e.stopPropagation();
      item.style.transform = 'scale(0.97)';
      setTimeout(() => item.style.transform = '', 120);
      runLoader(simHref);
    });

    /* ── Bouton cours ── */
    item.querySelector('.action-btn.cours').addEventListener('click', e => {
      e.stopPropagation();
      runLoader(coursHref);
    });
  });
}

/* ═══════════════════════════════════════════════
   RECHERCHE
═══════════════════════════════════════════════ */
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();

  document.querySelectorAll('.circuit-item').forEach(item => {
    const name = item.dataset.name.toLowerCase();
    item.classList.toggle('hidden', q.length > 0 && !name.includes(q));
  });

  // Masquer sections vides
  document.querySelectorAll('.section-label').forEach(label => {
    const list = label.nextElementSibling;
    if (!list) return;
    const visible = list.querySelectorAll('.circuit-item:not(.hidden)');
    label.style.display = visible.length === 0 ? 'none' : '';
    list.style.display  = visible.length === 0 ? 'none' : '';
  });
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
  }
});

/* ═══════════════════════════════════════════════
   ANIMATION ENTRÉE PAGE
═══════════════════════════════════════════════ */
function animatePage() {
  document.querySelectorAll('.circuit-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 50);
  });
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCircuitItems();
  updateFavSidebar();
  animatePage();
});
