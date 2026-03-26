/* ═══════════════════════════════════════════════
   MEGANE_LEARN — cours-rlc-parallele.js
   Diagramme de Fresnel pour le cours RLC Parallèle
   (valeurs fixes de l'exemple)
═══════════════════════════════════════════════ */

// Valeurs calculées dans l'exemple
const IR = 2.30;
const IL = 3.66;
const IC = 7.23;
const I = 4.25;
const phiDeg = -57.2;
const phi = phiDeg * Math.PI / 180;

// Différence IL - IC
const Idiff = IL - IC; // -3.57 A

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
  
  // Échelle auto (pour les courants)
  const maxI = Math.max(IR, IL, IC, I) * 1.2;
  const scale = Math.min((W/2 - 50) / maxI, (H/2 - 50) / maxI);
  
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
  
  // Tension U (référence, axe réel)
  const ULen = 80;
  drawArrow(ox, oy, ox + ULen, oy, '#4f7cff', 2);
  ctx.fillStyle = '#4f7cff';
  ctx.font = 'bold 14px Share Tech Mono';
  ctx.fillText('U', ox + ULen + 12, oy);
  
  // Courant IR (en phase)
  const IRx = IR * scale;
  drawArrow(ox, oy, ox + IRx, oy, '#2ecc71', 2.5);
  ctx.fillStyle = '#2ecc71';
  ctx.fillText('IR', ox + IRx/2, oy - 12);
  
  // Courant IL (en retard de 90°, vers le bas)
  const ILy = IL * scale;
  drawArrow(ox + IRx, oy, ox + IRx, oy + ILy, '#ffc94a', 2.5);
  ctx.fillStyle = '#ffc94a';
  ctx.fillText('IL', ox + IRx + 12, oy + ILy/2);
  
  // Courant IC (en avance de 90°, vers le haut)
  const ICy = IC * scale;
  drawArrow(ox + IRx, oy, ox + IRx, oy - ICy, '#ff6b6b', 2.5);
  ctx.fillStyle = '#ff6b6b';
  ctx.fillText('IC', ox + IRx + 12, oy - ICy/2);
  
  // Courant total I
  const Ix = I * Math.cos(phi) * scale;
  const Iy = I * Math.sin(phi) * scale;
  drawArrow(ox, oy, ox + Ix, oy + Iy, '#ff4d6d', 3);
  ctx.fillStyle = '#ff4d6d';
  ctx.fillText('I', ox + Ix/2 - 12, oy + Iy/2);
  
  // Pointillés
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#4a6080';
  ctx.beginPath();
  ctx.moveTo(ox + Ix, oy + Iy);
  ctx.lineTo(ox + Ix, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox + Ix, oy + Iy);
  ctx.lineTo(ox, oy + Iy);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Arc φ (angle négatif vers le bas)
  const arcR = 50;
  ctx.strokeStyle = '#ff4d6d';
  ctx.beginPath();
  ctx.arc(ox, oy, arcR, 0, phi);
  ctx.stroke();
  ctx.fillStyle = '#ff4d6d';
  ctx.font = 'bold 12px Share Tech Mono';
  ctx.fillText('φ = ' + phiDeg + '°', ox + arcR + 10, oy + arcR/2);
  
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