/* ═══════════════════════════════════════════════
   MEGANE_LEARN — cours-rlc-serie.js
   Diagramme de Fresnel pour le cours RLC Série
   (valeurs fixes de l'exemple)
═══════════════════════════════════════════════ */

// Valeurs calculées dans l'exemple
const UR = 220;
const UL = 138;
const UC = 70;
const U = 230;
const phiDeg = 17.2;
const phi = phiDeg * Math.PI / 180;

// Différence UL - UC
const Udiff = UL - UC; // 68 V

function drawFresnel() {
  const canvas = document.getElementById('fresnelCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  
  ctx.clearRect(0, 0, W, H);
  
  // Grille
  ctx.strokeStyle = '#2a3d60';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  
  // Axes
  const ox = W/2 - 30;
  const oy = H/2 + 40;
  ctx.strokeStyle = '#4a6080';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(30, oy);
  ctx.lineTo(W - 20, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox, 20);
  ctx.lineTo(ox, H - 20);
  ctx.stroke();
  
  // Échelle auto (utiliser Udiff pour la partie réactive)
  const maxV = Math.max(UR, Math.abs(Udiff), U) * 1.2;
  const scale = Math.min((W/2 - 50) / maxV, (H/2 - 50) / maxV);
  
  const drawArrow = (x0, y0, x1, y1, color, lw) => {
    const dx = x1 - x0, dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    if (len < 2) return;
    const ux = dx / len, uy = dy / len;
    const hl = 12, hw = 6;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1 - ux * hl, y1 - uy * hl);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * hl - uy * hw, y1 - uy * hl + ux * hw);
    ctx.lineTo(x1 - ux * hl + uy * hw, y1 - uy * hl - ux * hw);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  
  // Courant I (référence)
  const ILen = 80;
  drawArrow(ox, oy, ox + ILen, oy, '#4f7cff', 2);
  ctx.fillStyle = '#4f7cff';
  ctx.font = 'bold 14px Share Tech Mono';
  ctx.fillText('I', ox + ILen + 12, oy);
  
  // UR (en phase)
  const URx = UR * scale;
  drawArrow(ox, oy, ox + URx, oy, '#2ecc71', 2.5);
  ctx.fillStyle = '#2ecc71';
  ctx.fillText('UR', ox + URx/2, oy - 12);
  
  // UL - UC (différence, en avance de 90°)
  const UdiffY = Udiff * scale;
  drawArrow(ox + URx, oy, ox + URx, oy - UdiffY, '#ffc94a', 2.5);
  ctx.fillStyle = '#ffc94a';
  ctx.fillText('UL-UC', ox + URx + 12, oy - UdiffY/2);
  
  // U total
  const Ux = U * Math.cos(phi) * scale;
  const Uy = U * Math.sin(phi) * scale;
  drawArrow(ox, oy, ox + Ux, oy - Uy, '#ff4d6d', 3);
  ctx.fillStyle = '#ff4d6d';
  ctx.fillText('U', ox + Ux/2 - 12, oy - Uy/2);
  
  // Pointillés
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#4a6080';
  ctx.beginPath();
  ctx.moveTo(ox + Ux, oy - Uy);
  ctx.lineTo(ox + Ux, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox + Ux, oy - Uy);
  ctx.lineTo(ox, oy - Uy);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Arc φ
  const arcR = 50;
  ctx.strokeStyle = '#ff4d6d';
  ctx.beginPath();
  ctx.arc(ox, oy, arcR, -phi, 0);
  ctx.stroke();
  ctx.fillStyle = '#ff4d6d';
  ctx.font = 'bold 12px Share Tech Mono';
  ctx.fillText('φ = ' + phiDeg + '°', ox + arcR + 10, oy - arcR/2);
  
  // Origine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ox, oy, 4, 0, Math.PI * 2);
  ctx.fill();
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
  drawFresnel();
  loadFavorites();
  window.addEventListener('storage', loadFavorites);
  window.addEventListener('resize', drawFresnel);
}

init();