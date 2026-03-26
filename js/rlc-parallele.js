// Éléments DOM
const sliders = {
  U: document.getElementById('sl_U'),
  R: document.getElementById('sl_R'),
  L: document.getElementById('sl_L'),
  C: document.getElementById('sl_C'),
  f: document.getElementById('sl_f')
};

const inputs = {
  U: document.getElementById('val_U'),
  R: document.getElementById('val_R'),
  L: document.getElementById('val_L'),
  C: document.getElementById('val_C'),
  f: document.getElementById('val_f')
};

// Seuils pour les couleurs
const thresholds = {
  U: { vert: 220, orange: 300, max: 400 },
  R: { vert: 200, orange: 350, max: 500 },
  L: { vert: 400, orange: 700, max: 1000 },
  C: { vert: 400, orange: 700, max: 1000 },
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

function calculateRLCParallele() {
  const U = parseFloat(sliders.U.value);
  const R = parseFloat(sliders.R.value);
  const Lmh = parseFloat(sliders.L.value);
  const Cuf = parseFloat(sliders.C.value);
  const f = parseFloat(sliders.f.value);
  const L = Lmh / 1000;
  const C = Cuf / 1e6;
  const omega = 2 * Math.PI * f;
  const XL = omega * L;
  const XC = (omega === 0 || C === 0) ? Infinity : 1 / (omega * C);
  const IR = (R === 0) ? Infinity : U / R;
  const IL = (XL === 0) ? Infinity : U / XL;
  const IC = (XC === Infinity) ? Infinity : U / XC;
  const I = Math.sqrt(IR * IR + Math.pow(IL - IC, 2));
  const Z = (I === 0) ? Infinity : U / I;
  const phi = Math.atan2(IL - IC, IR);
  const phiDeg = phi * 180 / Math.PI;
  const cosphi = IR / I;
  const sinphi = (IL - IC) / I;
  const P = U * I * cosphi;
  const Q = U * I * sinphi;
  const S = U * I;
  const f0 = (L === 0 || C === 0) ? 0 : 1 / (2 * Math.PI * Math.sqrt(L * C));
  const Z0 = (R === 0 || C === 0) ? Infinity : L / (R * C);
  return { U, R, L, C, f, omega, XL, XC, IR, IL, IC, I, Z, phi, phiDeg, cosphi, sinphi, P, Q, S, f0, Z0 };
}

function updateCalculs(data) {
  const ids = ['omega', 'XL', 'XC', 'IR', 'IL', 'IC', 'I', 'Z', 'phi', 'cosphi', 'P', 'Q', 'S'];
  ids.forEach(id => {
    const el = document.getElementById(`calc_${id}`);
    if (el) {
      if (id === 'omega') el.textContent = data.omega.toFixed(1) + ' rad/s';
      else if (id === 'XL') el.textContent = formatValue(data.XL, 'Ω');
      else if (id === 'XC') el.textContent = formatValue(data.XC, 'Ω');
      else if (id === 'IR') el.textContent = formatValue(data.IR, 'A');
      else if (id === 'IL') el.textContent = formatValue(data.IL, 'A');
      else if (id === 'IC') el.textContent = formatValue(data.IC, 'A');
      else if (id === 'I') el.textContent = formatValue(data.I, 'A');
      else if (id === 'Z') el.textContent = formatValue(data.Z, 'Ω');
      else if (id === 'phi') el.textContent = data.phiDeg.toFixed(1) + '°';
      else if (id === 'cosphi') el.textContent = data.cosphi.toFixed(3);
      else if (id === 'P') el.textContent = formatValue(data.P, 'W');
      else if (id === 'Q') el.textContent = formatValue(data.Q, 'VAR');
      else if (id === 'S') el.textContent = formatValue(data.S, 'VA');
    }
  });
}

function updateDiagramme(data) {
  const els = ['IR', 'IL', 'IC', 'I', 'phi'];
  els.forEach(id => {
    const el = document.getElementById(`diag_${id}`);
    if (el) {
      if (id === 'IR') el.textContent = formatValue(data.IR, 'A');
      else if (id === 'IL') el.textContent = formatValue(data.IL, 'A');
      else if (id === 'IC') el.textContent = formatValue(data.IC, 'A');
      else if (id === 'I') el.textContent = formatValue(data.I, 'A');
      else if (id === 'phi') el.textContent = data.phiDeg.toFixed(1) + '°';
    }
  });
}

function updateFormules(data) {
  if (document.getElementById('form_U_val')) document.getElementById('form_U_val').textContent = data.U;
  if (document.getElementById('form_R_val')) document.getElementById('form_R_val').textContent = data.R;
  if (document.getElementById('form_L_val')) document.getElementById('form_L_val').textContent = data.L * 1000;
  if (document.getElementById('form_C_val')) document.getElementById('form_C_val').textContent = data.C * 1e6;
  if (document.getElementById('form_f_val')) document.getElementById('form_f_val').textContent = data.f;
  if (document.getElementById('form_omega')) document.getElementById('form_omega').textContent = data.omega.toFixed(1) + ' rad/s';
  if (document.getElementById('form_XL')) document.getElementById('form_XL').textContent = formatValue(data.XL, 'Ω');
  if (document.getElementById('form_XC')) document.getElementById('form_XC').textContent = formatValue(data.XC, 'Ω');
  if (document.getElementById('form_IR')) document.getElementById('form_IR').textContent = formatValue(data.IR, 'A');
  if (document.getElementById('form_IL')) document.getElementById('form_IL').textContent = formatValue(data.IL, 'A');
  if (document.getElementById('form_IC')) document.getElementById('form_IC').textContent = formatValue(data.IC, 'A');
  if (document.getElementById('form_I')) document.getElementById('form_I').textContent = formatValue(data.I, 'A');
  if (document.getElementById('form_Z')) document.getElementById('form_Z').textContent = formatValue(data.Z, 'Ω');
  if (document.getElementById('form_phi')) document.getElementById('form_phi').textContent = data.phiDeg.toFixed(1) + '°';
  if (document.getElementById('form_cosphi')) document.getElementById('form_cosphi').textContent = data.cosphi.toFixed(3);
  if (document.getElementById('form_P')) document.getElementById('form_P').textContent = formatValue(data.P, 'W');
  if (document.getElementById('form_Q')) document.getElementById('form_Q').textContent = formatValue(data.Q, 'VAR');
  if (document.getElementById('form_S')) document.getElementById('form_S').textContent = formatValue(data.S, 'VA');
  if (document.getElementById('form_f0')) document.getElementById('form_f0').textContent = formatValue(data.f0, 'Hz');
  if (document.getElementById('form_Z0')) document.getElementById('form_Z0').textContent = formatValue(data.Z0, 'Ω');
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
  
  const maxI = Math.max(data.IR, data.IL, data.IC, data.I) * 1.2;
  const scale = Math.min((W/2 - 50) / maxI, (H/2 - 50) / maxI);
  
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
  
  // Tension U (référence, axe réel)
  const ULen = 80;
  drawArrow(ox, oy, ox + ULen, oy, '#4f7cff', 2);
  ctx.fillStyle = '#4f7cff'; ctx.font = 'bold 12px Share Tech Mono';
  ctx.fillText('U', ox + ULen + 12, oy);
  
  // Courant IR (en phase)
  const IRx = data.IR * scale;
  drawArrow(ox, oy, ox + IRx, oy, '#2ecc71', 2.5);
  ctx.fillStyle = '#2ecc71'; ctx.fillText('IR', ox + IRx/2, oy - 8);
  
  // Courant IL (en retard de 90°)
  const ILy = data.IL * scale;
  drawArrow(ox + IRx, oy, ox + IRx, oy + ILy, '#ffc94a', 2.5);
  ctx.fillStyle = '#ffc94a'; ctx.fillText('IL', ox + IRx + 12, oy + ILy/2);
  
  // Courant IC (en avance de 90°)
  const ICy = data.IC * scale;
  drawArrow(ox + IRx, oy, ox + IRx, oy - ICy, '#ff6b6b', 2.5);
  ctx.fillStyle = '#ff6b6b'; ctx.fillText('IC', ox + IRx + 12, oy - ICy/2);
  
  // Courant total I
  const Idiff = data.IL - data.IC;
  const Ix = data.I * Math.cos(data.phi) * scale;
  const Iy = data.I * Math.sin(data.phi) * scale;
  drawArrow(ox, oy, ox + Ix, oy + Iy, '#ff4d6d', 3);
  ctx.fillStyle = '#ff4d6d'; ctx.fillText('I', ox + Ix/2 - 12, oy + Iy/2);
  
  ctx.setLineDash([4,4]); ctx.strokeStyle = '#4a6080';
  ctx.beginPath(); ctx.moveTo(ox + Ix, oy + Iy); ctx.lineTo(ox + Ix, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox + Ix, oy + Iy); ctx.lineTo(ox, oy + Iy); ctx.stroke();
  ctx.setLineDash([]);
  
  const arcR = 40;
  ctx.strokeStyle = '#ff4d6d';
  ctx.beginPath(); ctx.arc(ox, oy, arcR, 0, data.phi); ctx.stroke();
  ctx.fillStyle = '#ff4d6d';
  ctx.fillText('φ = ' + data.phiDeg.toFixed(1) + '°', ox + arcR + 10, oy + arcR/2);
  
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI*2); ctx.fill();
}

function calculateAll() {
  const data = calculateRLCParallele();
  updateCalculs(data);
  updateDiagramme(data);
  updateFormules(data);
  drawFresnel(data);
}

function init() {
  syncSliderInput('U');
  syncSliderInput('R');
  syncSliderInput('L');
  syncSliderInput('C');
  syncSliderInput('f');
  calculateAll();
}

document.addEventListener('DOMContentLoaded', init);