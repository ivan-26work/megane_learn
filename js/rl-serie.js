// Éléments DOM
const sliders = {
  U: document.getElementById('sl_U'),
  R: document.getElementById('sl_R'),
  L: document.getElementById('sl_L'),
  f: document.getElementById('sl_f')
};

const inputs = {
  U: document.getElementById('val_U'),
  R: document.getElementById('val_R'),
  L: document.getElementById('val_L'),
  f: document.getElementById('val_f')
};

// Seuils pour les couleurs
const thresholds = {
  U: { vert: 220, orange: 300, max: 400 },
  R: { vert: 200, orange: 350, max: 500 },
  L: { vert: 400, orange: 700, max: 1000 },
  f: { vert: 400, orange: 700, max: 1000 }
};

function updateSliderColor(slider, value, param) {
  let colorClass = '';
  const t = thresholds[param];
  if (value <= t.vert) colorClass = 'thumb-vert';
  else if (value <= t.orange) colorClass = 'thumb-orange';
  else colorClass = 'thumb-rouge';
  slider.classList.remove('thumb-vert', 'thumb-orange', 'thumb-rouge');
  slider.classList.add(colorClass);
}

function validateAndUpdate(param, value) {
  const slider = sliders[param];
  const input = inputs[param];
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  if (value >= min && value <= max) {
    slider.disabled = false;
    slider.classList.remove('disabled');
    input.classList.remove('out-of-range');
    slider.value = value;
    updateSliderColor(slider, value, param);
  } else {
    slider.disabled = true;
    slider.classList.add('disabled');
    input.classList.add('out-of-range');
  }
  calculateAll();
}

function syncSliderInput(param) {
  const slider = sliders[param];
  const input = inputs[param];
  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    input.value = val;
    updateSliderColor(slider, val, param);
    calculateAll();
  });
  input.addEventListener('input', () => {
    let v = parseFloat(input.value);
    if (!isNaN(v)) validateAndUpdate(param, v);
  });
}

function formatValue(value, unit) {
  if (Math.abs(value) >= 1e6) return (value / 1e6).toFixed(2) + ' M' + unit;
  if (Math.abs(value) >= 1e3) return (value / 1e3).toFixed(2) + ' k' + unit;
  if (Math.abs(value) < 1 && value !== 0) return (value * 1000).toFixed(2) + ' m' + unit;
  return value.toFixed(2) + ' ' + unit;
}

function calculateRL() {
  const U = parseFloat(sliders.U.value);
  const R = parseFloat(sliders.R.value);
  const Lmh = parseFloat(sliders.L.value);
  const f = parseFloat(sliders.f.value);
  const L = Lmh / 1000;
  const omega = 2 * Math.PI * f;
  const XL = omega * L;
  const Z = Math.sqrt(R * R + XL * XL);
  const I = (Z === 0) ? 0 : U / Z;
  const UR = R * I;
  const UL = XL * I;
  const phi = Math.atan2(XL, R);
  const phiDeg = phi * 180 / Math.PI;
  const cosphi = (Z === 0) ? 0 : R / Z;
  const P = U * I * cosphi;
  const Q = U * I * Math.sin(phi);
  const S = U * I;
  return { U, R, L, f, omega, XL, Z, I, UR, UL, phi, phiDeg, cosphi, P, Q, S };
}

function updateCalculs(data) {
  const ids = ['omega', 'XL', 'Z', 'I', 'UR', 'UL', 'phi', 'cosphi', 'P', 'Q', 'S'];
  ids.forEach(id => {
    const el = document.getElementById(`calc_${id}`);
    if (el) {
      if (id === 'omega') el.textContent = data.omega.toFixed(1) + ' rad/s';
      else if (id === 'XL') el.textContent = formatValue(data.XL, 'Ω');
      else if (id === 'Z') el.textContent = formatValue(data.Z, 'Ω');
      else if (id === 'I') el.textContent = formatValue(data.I, 'A');
      else if (id === 'UR') el.textContent = formatValue(data.UR, 'V');
      else if (id === 'UL') el.textContent = formatValue(data.UL, 'V');
      else if (id === 'phi') el.textContent = data.phiDeg.toFixed(1) + '°';
      else if (id === 'cosphi') el.textContent = data.cosphi.toFixed(3);
      else if (id === 'P') el.textContent = formatValue(data.P, 'W');
      else if (id === 'Q') el.textContent = formatValue(data.Q, 'VAR');
      else if (id === 'S') el.textContent = formatValue(data.S, 'VA');
    }
  });
}

function updateDiagramme(data) {
  const els = ['UR', 'UL', 'U', 'phi'];
  els.forEach(id => {
    const el = document.getElementById(`diag_${id}`);
    if (el) {
      if (id === 'UR') el.textContent = formatValue(data.UR, 'V');
      else if (id === 'UL') el.textContent = formatValue(data.UL, 'V');
      else if (id === 'U') el.textContent = formatValue(data.U, 'V');
      else if (id === 'phi') el.textContent = data.phiDeg.toFixed(1) + '°';
    }
  });
}

function updateFormules(data) {
  const formElements = {
    U: 'form_U_val', R: 'form_R_val', L: 'form_L_val', f: 'form_f_val',
    omega: 'form_omega', XL: 'form_XL', Z: 'form_Z', I: 'form_I',
    UR: 'form_UR', UL: 'form_UL', Ucalc: 'form_U', phi: 'form_phi',
    cosphi: 'form_cosphi', P: 'form_P', Q: 'form_Q', S: 'form_S'
  };
  if (document.getElementById('form_U_val')) document.getElementById('form_U_val').textContent = data.U;
  if (document.getElementById('form_R_val')) document.getElementById('form_R_val').textContent = data.R;
  if (document.getElementById('form_L_val')) document.getElementById('form_L_val').textContent = data.L * 1000;
  if (document.getElementById('form_f_val')) document.getElementById('form_f_val').textContent = data.f;
  if (document.getElementById('form_omega')) document.getElementById('form_omega').textContent = data.omega.toFixed(1) + ' rad/s';
  if (document.getElementById('form_XL')) document.getElementById('form_XL').textContent = formatValue(data.XL, 'Ω');
  if (document.getElementById('form_Z')) document.getElementById('form_Z').textContent = formatValue(data.Z, 'Ω');
  if (document.getElementById('form_I')) document.getElementById('form_I').textContent = formatValue(data.I, 'A');
  if (document.getElementById('form_UR')) document.getElementById('form_UR').textContent = formatValue(data.UR, 'V');
  if (document.getElementById('form_UL')) document.getElementById('form_UL').textContent = formatValue(data.UL, 'V');
  if (document.getElementById('form_U')) document.getElementById('form_U').textContent = formatValue(Math.sqrt(data.UR*data.UR + data.UL*data.UL), 'V');
  if (document.getElementById('form_phi')) document.getElementById('form_phi').textContent = data.phiDeg.toFixed(1) + '°';
  if (document.getElementById('form_cosphi')) document.getElementById('form_cosphi').textContent = data.cosphi.toFixed(3);
  if (document.getElementById('form_P')) document.getElementById('form_P').textContent = formatValue(data.P, 'W');
  if (document.getElementById('form_Q')) document.getElementById('form_Q').textContent = formatValue(data.Q, 'VAR');
  if (document.getElementById('form_S')) document.getElementById('form_S').textContent = formatValue(data.S, 'VA');
}

function drawSchema() {
  const canvas = document.getElementById('schemaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 500;
  const H = canvas.offsetHeight || 200;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#4f7cff';
  ctx.lineWidth = 2;
  const mx = 20, my = H/2;
  ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + W*0.15, my); ctx.stroke();
  const rx = mx + W*0.15, rw = W*0.25;
  ctx.beginPath(); ctx.moveTo(rx, my);
  const steps = 6, sw = rw/steps, sh = 10;
  for (let i = 0; i < steps; i++) ctx.lineTo(rx + sw*(i+0.5), my + (i%2===0 ? -sh : sh));
  ctx.lineTo(rx + rw, my); ctx.stroke();
  ctx.fillStyle = '#4f7cff';
  ctx.font = 'bold 12px Share Tech Mono';
  ctx.fillText('R', rx + rw/2, my - sh - 6);
  ctx.beginPath(); ctx.moveTo(rx + rw, my); ctx.lineTo(rx + rw + W*0.08, my); ctx.stroke();
  const lx = rx + rw + W*0.08, lw = W*0.25;
  ctx.beginPath(); ctx.moveTo(lx, my);
  const arcs = 4, aw = lw/arcs;
  for (let i = 0; i < arcs; i++) ctx.arc(lx + aw*(i+0.5), my, aw/2, Math.PI, 0);
  ctx.stroke();
  ctx.fillText('L', lx + lw/2, my - aw/2 - 8);
  ctx.beginPath(); ctx.moveTo(lx + lw, my); ctx.lineTo(W - mx, my); ctx.stroke();
  ctx.fillStyle = '#ff4d6d';
  [[mx, my], [W-mx, my]].forEach(([x,y]) => { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill(); });
  ctx.fillStyle = '#ff4d6d';
  ctx.fillText('A', mx, my + 16);
  ctx.fillText('B', W - mx, my + 16);
  ctx.strokeStyle = '#ff4d6d88';
  ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(mx, my + 28); ctx.lineTo(W - mx, my + 28); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ff4d6d';
  ctx.fillText('U', W/2, my + 42);
}

function drawFresnel(data) {
  const canvas = document.getElementById('fresnelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#2a3d60'; ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  const ox = W/2 - 30, oy = H/2 + 40;
  ctx.strokeStyle = '#4a6080'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(W-20, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, H-20); ctx.stroke();
  const maxV = Math.max(data.UR, data.UL, data.U) * 1.2;
  const scale = Math.min((W/2 - 50) / maxV, (H/2 - 50) / maxV);
  const drawArrow = (x0, y0, x1, y1, color, lw) => {
    const dx = x1-x0, dy = y1-y0, len = Math.hypot(dx, dy);
    if (len < 2) return;
    const ux = dx/len, uy = dy/len, hl = 12, hw = 6;
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1 - ux*hl, y1 - uy*hl); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux*hl - uy*hw, y1 - uy*hl + ux*hw);
    ctx.lineTo(x1 - ux*hl + uy*hw, y1 - uy*hl - ux*hw);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  const ILen = 80;
  drawArrow(ox, oy, ox + ILen, oy, '#4f7cff', 2);
  ctx.fillStyle = '#4f7cff'; ctx.font = 'bold 12px Share Tech Mono';
  ctx.fillText('I', ox + ILen + 12, oy);
  const URx = data.UR * scale;
  drawArrow(ox, oy, ox + URx, oy, '#2ecc71', 2.5);
  ctx.fillStyle = '#2ecc71'; ctx.fillText('UR', ox + URx/2, oy - 8);
  const ULy = data.UL * scale;
  drawArrow(ox + URx, oy, ox + URx, oy - ULy, '#ffc94a', 2.5);
  ctx.fillStyle = '#ffc94a'; ctx.fillText('UL', ox + URx + 12, oy - ULy/2);
  const Ux = data.U * Math.cos(data.phi) * scale;
  const Uy = data.U * Math.sin(data.phi) * scale;
  drawArrow(ox, oy, ox + Ux, oy - Uy, '#ff4d6d', 3);
  ctx.fillStyle = '#ff4d6d'; ctx.fillText('U', ox + Ux/2 - 12, oy - Uy/2);
  ctx.setLineDash([4,4]); ctx.strokeStyle = '#4a6080';
  ctx.beginPath(); ctx.moveTo(ox + Ux, oy - Uy); ctx.lineTo(ox + Ux, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox + Ux, oy - Uy); ctx.lineTo(ox, oy - Uy); ctx.stroke();
  ctx.setLineDash([]);
  const arcR = 40;
  ctx.strokeStyle = '#ff4d6d';
  ctx.beginPath(); ctx.arc(ox, oy, arcR, -data.phi, 0); ctx.stroke();
  ctx.fillStyle = '#ff4d6d';
  ctx.fillText('φ = ' + data.phiDeg.toFixed(1) + '°', ox + arcR + 10, oy - arcR/2);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI*2); ctx.fill();
}

function calculateAll() {
  const data = calculateRL();
  updateCalculs(data);
  updateDiagramme(data);
  updateFormules(data);
  drawFresnel(data);
}

function init() {
  syncSliderInput('U');
  syncSliderInput('R');
  syncSliderInput('L');
  syncSliderInput('f');
  drawSchema();
  window.addEventListener('resize', drawSchema);
  calculateAll();
}

document.addEventListener('DOMContentLoaded', init);