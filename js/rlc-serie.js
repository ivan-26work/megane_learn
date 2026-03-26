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

function calculateRLC() {
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
  const X = Math.abs(XL - XC);
  const Z = (XC === Infinity) ? Infinity : Math.sqrt(R * R + X * X);
  const I = (Z === Infinity || Z === 0) ? 0 : U / Z;
  const UR = R * I;
  const UL = XL * I;
  const UC = XC * I;
  const phi = Math.atan2(XL - XC, R);
  const phiDeg = phi * 180 / Math.PI;
  const cosphi = (Z === Infinity || Z === 0) ? 0 : R / Z;
  const sinphi = (Z === Infinity || Z === 0) ? 0 : (XL - XC) / Z;
  const P = U * I * cosphi;
  const Q = U * I * sinphi;
  const S = U * I;
  const f0 = (L === 0 || C === 0) ? 0 : 1 / (2 * Math.PI * Math.sqrt(L * C));
  return { U, R, L, C, f, omega, XL, XC, X, Z, I, UR, UL, UC, phi, phiDeg, cosphi, sinphi, P, Q, S, f0 };
}

function updateCalculs(data) {
  const ids = ['omega', 'XL', 'XC', 'X', 'Z', 'I', 'UR', 'UL', 'UC', 'phi', 'cosphi', 'P', 'Q', 'S'];
  ids.forEach(id => {
    const el = document.getElementById(`calc_${id}`);
    if (el) {
      if (id === 'omega') el.textContent = data.omega.toFixed(1) + ' rad/s';
      else if (id === 'XL') el.textContent = formatValue(data.XL, 'Ω');
      else if (id === 'XC') el.textContent = formatValue(data.XC, 'Ω');
      else if (id === 'X') el.textContent = formatValue(data.X, 'Ω');
      else if (id === 'Z') el.textContent = formatValue(data.Z, 'Ω');
      else if (id === 'I') el.textContent = formatValue(data.I, 'A');
      else if (id === 'UR') el.textContent = formatValue(data.UR, 'V');
      else if (id === 'UL') el.textContent = formatValue(data.UL, 'V');
      else if (id === 'UC') el.textContent = formatValue(data.UC, 'V');
      else if (id === 'phi') el.textContent = data.phiDeg.toFixed(1) + '°';
      else if (id === 'cosphi') el.textContent = data.cosphi.toFixed(3);
      else if (id === 'P') el.textContent = formatValue(data.P, 'W');
      else if (id === 'Q') el.textContent = formatValue(data.Q, 'VAR');
      else if (id === 'S') el.textContent = formatValue(data.S, 'VA');
    }
  });
}

function updateDiagramme(data) {
  const els = ['UR', 'UL', 'UC', 'U', 'phi'];
  els.forEach(id => {
    const el = document.getElementById(`diag_${id}`);
    if (el) {
      if (id === 'UR') el.textContent = formatValue(data.UR, 'V');
      else if (id === 'UL') el.textContent = formatValue(data.UL, 'V');
      else if (id === 'UC') el.textContent = formatValue(data.UC, 'V');
      else if (id === 'U') el.textContent = formatValue(data.U, 'V');
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
  if (document.getElementById('form_X')) document.getElementById('form_X').textContent = formatValue(data.X, 'Ω');
  if (document.getElementById('form_Z')) document.getElementById('form_Z').textContent = formatValue(data.Z, 'Ω');
  if (document.getElementById('form_I')) document.getElementById('form_I').textContent = formatValue(data.I, 'A');
  if (document.getElementById('form_UR')) document.getElementById('form_UR').textContent = formatValue(data.UR, 'V');
  if (document.getElementById('form_UL')) document.getElementById('form_UL').textContent = formatValue(data.UL, 'V');
  if (document.getElementById('form_UC')) document.getElementById('form_UC').textContent = formatValue(data.UC, 'V');
  if (document.getElementById('form_U')) document.getElementById('form_U').textContent = formatValue(Math.sqrt(data.UR*data.UR + Math.pow(data.UL - data.UC, 2)), 'V');
  if (document.getElementById('form_phi')) document.getElementById('form_phi').textContent = data.phiDeg.toFixed(1) + '°';
  if (document.getElementById('form_cosphi')) document.getElementById('form_cosphi').textContent = data.cosphi.toFixed(3);
  if (document.getElementById('form_P')) document.getElementById('form_P').textContent = formatValue(data.P, 'W');
  if (document.getElementById('form_Q')) document.getElementById('form_Q').textContent = formatValue(data.Q, 'VAR');
  if (document.getElementById('form_S')) document.getElementById('form_S').textContent = formatValue(data.S, 'VA');
  if (document.getElementById('form_f0')) document.getElementById('form_f0').textContent = formatValue(data.f0, 'Hz');
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
  
  const Udiff = data.UL - data.UC;
  const maxV = Math.max(data.UR, Math.abs(Udiff), data.U) * 1.2;
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
  
  const UdiffY = Udiff * scale;
  if (Udiff >= 0) {
    drawArrow(ox + URx, oy, ox + URx, oy - UdiffY, '#ffc94a', 2.5);
    ctx.fillStyle = '#ffc94a'; ctx.fillText('UL-UC', ox + URx + 12, oy - UdiffY/2);
  } else {
    drawArrow(ox + URx, oy, ox + URx, oy - UdiffY, '#ff6b6b', 2.5);
    ctx.fillStyle = '#ff6b6b'; ctx.fillText('UC-UL', ox + URx + 12, oy - UdiffY/2);
  }
  
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
  const data = calculateRLC();
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