// ═══════════════════════════════════════════════════════════
//  GLOBAL USER PROFILE INJECTION
// ═══════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  if (typeof GameUtils !== 'undefined' && GameUtils.syncWithDatabase) {
    await GameUtils.syncWithDatabase();
  }
  initGameProfile();
});

function initGameProfile() {
  if (typeof GameUtils !== 'undefined') {
    const p = document.getElementById("userProfile");
    if (p) {
      p.innerHTML = `
                <span style="margin-right:8px;">👤 ${GameUtils.getUserName() || 'Misafir'}</span>
                <span style="color:var(--gold, #F9CA24);">🏆 ${GameUtils.getScore("cember-olcumu")}</span>
            `;
    }
  }
}


// ═══════════════════════════════════════════════════════════
//  PRESET TANIMLARI
// ═══════════════════════════════════════════════════════════
const PRESETS = [
  { id: 0, name: 'KÜÇÜK', r: 100_000, step: 0.5, color: '#f0f0f0', textColor: '#111' },
  { id: 1, name: 'ORTA', r: 1_000_000, step: 0.5, color: '#f5e642', textColor: '#111' },
  { id: 2, name: 'BÜYÜK', r: 10_000_000, step: 0.5, color: '#7de87d', textColor: '#111' },
];

// Sonuçları sakla
const results = { 0: null, 1: null, 2: null };
const REWARD_GRANTED_FLAGS = { 0: false, 1: false, 2: false }; // Oyun bitimi rozet ödülleri

let currentP = 0;   // aktif preset
let animT = 0;
let animId = null;
let playing = false;
const ANIM_MS = 5500;

// ═══════════════════════════════════════════════════════════
//  PRESET SWITCH
// ═══════════════════════════════════════════════════════════
window.switchPreset = function (id) {
  if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
  currentP = id;
  // Tab renkleri
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.className = 'tab' + (i === id ? ` active-${id}` : '');
  });
  animT = 0;
  cancelAnimationFrame(animId); playing = false;
  renderPreset(id);
}

function renderPreset(id) {
  const p = PRESETS[id];

  // Preset bar
  document.getElementById('presetBar').innerHTML = `
      <div class="preset-cell">
        <div class="label">YARIÇAP</div>
        <div class="value col${id}">${p.r.toLocaleString()} px</div>
      </div>
      <div class="preset-cell">
        <div class="label">ÇAP (2r)</div>
        <div class="value col${id}">${(2 * p.r).toLocaleString()} px</div>
      </div>
      <div class="preset-cell">
        <div class="label">ADIM</div>
        <div class="value col${id}">${p.step} px</div>
      </div>
      <div class="preset-cell">
        <div class="label">TOPLAM ADIM</div>
        <div class="value col${id}">~${Math.round(2 * p.r / p.step / 1000)}k</div>
      </div>
      <div class="preset-cell">
        <div class="label">BEKLENEN HATA</div>
        <div class="value col${id}">~${(p.step * p.step / p.r).toExponential(1)}</div>
      </div>
    `;

  // Buton renklerini güncelle
  document.querySelectorAll('.btn').forEach(b => {
    b.className = b.className.replace(/btn-\d/g, '') + ` btn-${id}`;
    if (b.classList.contains('go')) b.classList.add('go');
  });

  // Aşamaları sıfırla
  if (results[id]) {
    // Bu preset zaten hesaplanmış — sonuçları göster
    showComputedResult(id);
  } else {
    document.getElementById('phaseA').style.display = 'block';
    document.getElementById('phaseB').style.display = 'none';
    document.getElementById('phaseC').classList.remove('vis');
    document.getElementById('accumBox').classList.remove('vis');
    document.getElementById('zoomGrid').innerHTML = '';
    document.getElementById('compProg').style.width = '0%';
    document.getElementById('compLabel').textContent = 'Hazır. Ölç düğmesine bas.';
    document.getElementById('compBtn').disabled = false;
    styleProgBar(id);
  }
}

function styleProgBar(id) {
  const bar = document.getElementById('compProg');
  bar.className = 'prog-inner p' + id;
  document.getElementById('animProg').className = 'anim-prog-fill p' + id;
}

function showComputedResult(id) {
  const p = PRESETS[id];
  const r = results[id];
  document.getElementById('phaseA').style.display = 'none';
  document.getElementById('phaseB').style.display = 'block';
  styleProgBar(id);
  document.getElementById('animProg').style.width = '100%';
  document.getElementById('animStatus').textContent =
    `✓ Hesap tamam — cetvel ${r.ratio.toFixed(10)} değerini gösteriyor`;
  buildResultBox(id);
  animT = 1;
  initRollCanvas();
  drawRoll(1);
  showZoom(id);
}

// ═══════════════════════════════════════════════════════════
//  HESAPLAMA  —  Math.PI YOK
// ═══════════════════════════════════════════════════════════
window.startCompute = async function () {
  if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
  const p = PRESETS[currentP];
  const id = currentP;
  document.getElementById('compBtn').disabled = true;

  const CHUNK = 500_000;
  const TOTAL = Math.floor(2 * p.r / p.step);

  let halfCirc = 0;
  let prevX = p.r;
  let prevY = 0;

  for (let i = 0; i < TOTAL; i++) {
    // Yield occasionally to avoid freezing UI for standard calculation runs.
    if (i > 0 && i % (CHUNK * 2) === 0) await new Promise(r => setTimeout(r, 0));

    const x = p.r - (i + 1) * p.step;
    if (x < -p.r) break;
    // Çember denklemi: y = √(r² - x²)
    const y = Math.sqrt(p.r * p.r - x * x);
    // Pisagor: mesafe = √(dx² + dy²)
    const dx = x - prevX;
    const dy = y - prevY;
    halfCirc += Math.sqrt(dx * dx + dy * dy);
    prevX = x; prevY = y;

    if (i % CHUNK === 0) {
      const pct = (i / TOTAL * 100).toFixed(0);
      document.getElementById('compProg').style.width = pct + '%';
      document.getElementById('compLabel').textContent =
        `Yürünüyor… ${(i / 1000).toFixed(0)}k / ${(TOTAL / 1000).toFixed(0)}k adım (${pct}%)`;
    }
  }

  const circ = halfCirc * 2;
  const ratio = circ / (2 * p.r);
  results[id] = { circ, ratio, r: p.r, step: p.step };

  if (typeof GameUtils !== 'undefined') GameUtils.playSound('success');

  document.getElementById('compProg').style.width = '100%';
  document.getElementById('compLabel').textContent =
    `✓ Tamamlandı — çevre: ${circ.toFixed(4)} px → oran: ${ratio.toFixed(12)}`;

  // Aşama B
  document.getElementById('phaseA').style.display = 'none';
  document.getElementById('phaseB').style.display = 'block';
  buildResultBox(id);
  animT = 0;
  initRollCanvas();
  updateCompareBox();

  handleScoreAward(id);
}

function handleScoreAward(id) {
  if (!REWARD_GRANTED_FLAGS[id]) {
    if (typeof GameUtils !== 'undefined') {
      const currentScore = GameUtils.getScore("cember-olcumu");
      let awardInfo = id === 0 ? 10 : (id === 1 ? 50 : 200);
      GameUtils.saveScore("cember-olcumu", currentScore + awardInfo);
      initGameProfile();
    }
    REWARD_GRANTED_FLAGS[id] = true;
  }
}

function buildResultBox(id) {
  const p = PRESETS[id];
  const r = results[id];
  const c = p.color;
  document.getElementById('resultBox').innerHTML = `
      <span class="sy">Ölçülen yarı çevre:</span> <span class="big" style="color:${c}">${(r.circ / 2).toFixed(4)} px</span><br>
      <span class="sy">Çevre (2 × yarı):</span> <span class="big" style="color:${c}">${r.circ.toFixed(4)} px</span><br>
      <span class="sy">Çap (2r):</span> <span class="big" style="color:${c}">${(2 * p.r).toLocaleString()} px</span><br>
      <span class="sy">Çevre ÷ Çap =</span> <span class="big" style="color:${c}">${r.ratio.toFixed(12)}</span>
    `;
  document.getElementById('resultBox').classList.add('vis');
}

// ═══════════════════════════════════════════════════════════
//  ANİMASYON
// ═══════════════════════════════════════════════════════════
const rc = document.getElementById('rollCanvas');
const rctx = rc.getContext('2d');
const RULER_D = 4;
const PAD_R = 64;

function initRollCanvas() {
  // Give the canvas a bit more breathing room on the right side so the circle doesn't clip
  rc.width = Math.max(rc.parentElement.clientWidth - 50, 250);
  // Calculate PPU to determine the needed height so the circle top never clips
  const tempPPU = (rc.width - PAD_R * 2) / RULER_D;
  rc.height = Math.max(220, tempPPU + 100);
  styleProgBar(currentP);
  drawRoll(animT < 0.5 ? 2 * animT * animT : -1 + (4 - 2 * animT) * animT);
}
window.addEventListener('resize', () => {
  if (results[currentP]) { rc.width = Math.max(rc.parentElement.clientWidth - 50, 250); drawRoll(Math.min(animT, 1)); }
});

function drawRoll(te) {
  const p = PRESETS[currentP];
  const r = results[currentP];
  if (!r) return;

  const W = rc.width, H = rc.height;
  rctx.clearRect(0, 0, W, H);
  rctx.fillStyle = '#060810';
  rctx.fillRect(0, 0, W, H);

  const PPU = (W - PAD_R * 2) / RULER_D;
  const R_PX = 0.5 * PPU;
  const RY = H - 58;
  const X0 = PAD_R + R_PX;

  const trav_d = r.ratio * te;
  const trav_px = trav_d * PPU;

  // Kırmızı iz
  if (te > 0) {
    rctx.save();
    rctx.strokeStyle = p.color; rctx.lineWidth = 5; rctx.lineCap = 'round';
    rctx.shadowColor = p.color + '44'; rctx.shadowBlur = 14;
    rctx.beginPath(); rctx.moveTo(X0, RY); rctx.lineTo(X0 + trav_px, RY); rctx.stroke();
    rctx.restore();
    rctx.fillStyle = p.color;
    rctx.beginPath(); rctx.arc(X0, RY, 5, 0, 6.2832); rctx.fill();
  }

  // Cetvel
  drawRulerD(PPU, X0, RY + 3, W - PAD_R - X0 + R_PX, 40, p.color);

  // Çember
  const angle = 2 * Math.PI * te;  // SADECE GÖRSELİ döndürmek için
  const cx = X0 + trav_px, cy = RY - R_PX;

  rctx.save();
  rctx.shadowColor = '#00000050'; rctx.shadowBlur = 18; rctx.shadowOffsetY = 6;
  rctx.fillStyle = p.color + '18';
  rctx.strokeStyle = p.color; rctx.lineWidth = 2.5;
  rctx.beginPath(); rctx.arc(cx, cy, R_PX, 0, 6.2832);
  rctx.fill(); rctx.stroke();
  rctx.restore();

  rctx.strokeStyle = p.color + '40'; rctx.lineWidth = 1;
  rctx.beginPath();
  rctx.moveTo(cx - 8, cy); rctx.lineTo(cx + 8, cy);
  rctx.moveTo(cx, cy - 8); rctx.lineTo(cx, cy + 8);
  rctx.stroke();

  const kx = cx + R_PX * Math.cos(-1.5708 + angle);
  const ky = cy + R_PX * Math.sin(-1.5708 + angle);
  rctx.strokeStyle = p.color; rctx.lineWidth = 1.5; rctx.setLineDash([5, 4]);
  rctx.beginPath(); rctx.moveTo(cx, cy); rctx.lineTo(kx, ky); rctx.stroke();
  rctx.setLineDash([]);

  rctx.fillStyle = p.color; rctx.strokeStyle = '#060810'; rctx.lineWidth = 2;
  rctx.beginPath(); rctx.arc(kx, ky, 7, 0, 6.2832); rctx.fill(); rctx.stroke();

  rctx.fillStyle = p.color + '88'; rctx.font = '11px JetBrains Mono'; rctx.textAlign = 'center';
  rctx.fillText('r = 0.5d', cx, cy - R_PX - 10);

  rctx.strokeStyle = '#1a2540'; rctx.lineWidth = 1; rctx.setLineDash([3, 5]);
  rctx.beginPath(); rctx.moveTo(cx, cy + R_PX); rctx.lineTo(cx, RY); rctx.stroke();
  rctx.setLineDash([]);

  if (te > 0 && te < 1) {
    rctx.fillStyle = '#4a5878'; rctx.font = '11px JetBrains Mono'; rctx.textAlign = 'left';
    rctx.fillText(`tur %${(te * 100).toFixed(1)}  →  cetvel: ${trav_d.toFixed(6)} d`, PAD_R, 20);
  }
  if (te >= 1) {
    rctx.fillStyle = '#38b870'; rctx.font = 'bold 12px JetBrains Mono'; rctx.textAlign = 'left';
    rctx.fillText('✓ TAM TUR TAMAMLANDI', PAD_R, 20);
    // Ok
    rctx.save();
    rctx.strokeStyle = p.color; rctx.fillStyle = p.color; rctx.lineWidth = 2.5;
    rctx.shadowColor = p.color + '80'; rctx.shadowBlur = 10;
    rctx.beginPath(); rctx.moveTo(X0 + trav_px, RY - 6); rctx.lineTo(X0 + trav_px, RY - 36); rctx.stroke();
    rctx.beginPath();
    rctx.moveTo(X0 + trav_px, RY - 36);
    rctx.lineTo(X0 + trav_px - 7, RY - 24);
    rctx.lineTo(X0 + trav_px + 7, RY - 24);
    rctx.closePath(); rctx.fill();
    rctx.font = 'bold 12px JetBrains Mono'; rctx.textAlign = 'center';
    rctx.fillText(`${r.ratio.toFixed(5)} d`, X0 + trav_px, RY - 42);
    rctx.restore();
  }
}

function drawRulerD(ppu, x0, y0, rw, rh, color) {
  const g = rctx.createLinearGradient(x0, y0, x0, y0 + rh);
  g.addColorStop(0, '#181200'); g.addColorStop(0.5, '#221800'); g.addColorStop(1, '#0c0800');
  rctx.fillStyle = g; rctx.strokeStyle = color + 'aa'; rctx.lineWidth = 1;
  rctx.fillRect(x0, y0, rw, rh); rctx.strokeRect(x0, y0, rw, rh);
  const sub = 100, tpx = ppu / sub, tot = Math.ceil(rw / tpx) + sub + 1;
  for (let i = 0; i <= tot; i++) {
    const x = x0 + i * tpx;
    if (x > x0 + rw + 1) break;
    const isD = i % sub === 0, isT = i % 10 === 0 && !isD, isF = i % 5 === 0 && !isT && !isD;
    const th = isD ? rh * .65 : isT ? rh * .40 : isF ? rh * .24 : rh * .13;
    rctx.strokeStyle = isD ? color : isT ? color + '55' : color + '28'; rctx.lineWidth = isD ? 1.4 : 0.6;
    rctx.beginPath(); rctx.moveTo(x, y0); rctx.lineTo(x, y0 + th); rctx.stroke();
    if (isD) {
      rctx.fillStyle = color; rctx.font = '11px JetBrains Mono'; rctx.textAlign = 'center';
      rctx.fillText(i / sub, x, y0 + rh - 3);
    }
  }
  rctx.fillStyle = color + '55'; rctx.font = '9px JetBrains Mono'; rctx.textAlign = 'right';
  rctx.fillText('d (çap birimi)', x0 + rw - 2, y0 + rh - 3);
}

window.toggleAnim = function () {
  if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
  const id = currentP;
  if (animT >= 1) {
    animT = 0;
    document.getElementById('resultBox').classList.remove('vis');
    document.getElementById('phaseC').classList.remove('vis');
    document.getElementById('accumBox').classList.remove('vis');
    document.getElementById('zoomGrid').innerHTML = '';
    drawRoll(0);
    document.getElementById('animBtn').textContent = '▶ ANİMASYONU OYNAT';
    return;
  }
  if (playing) {
    cancelAnimationFrame(animId); playing = false;
    document.getElementById('animBtn').textContent = '▶ DEVAM'; return;
  }
  playing = true;
  document.getElementById('animBtn').textContent = '⏸ DURDUR';
  const t0 = performance.now();
  const startT = animT;
  function loop(now) {
    animT = Math.min(startT + (now - t0) / ANIM_MS, 1);
    const te = animT < 0.5 ? 2 * animT * animT : -1 + (4 - 2 * animT) * animT;
    drawRoll(te);
    document.getElementById('animProg').style.width = (animT * 100) + '%';
    if (animT < 1) {
      const r = results[id];
      document.getElementById('animStatus').textContent =
        `%${(te * 100).toFixed(0)} tur — cetvel ${(r.ratio * te).toFixed(6)} d gösteriyor`;
      animId = requestAnimationFrame(loop);
    } else {
      playing = false; drawRoll(1);
      document.getElementById('animBtn').textContent = '↺ YENİDEN';
      document.getElementById('animStatus').textContent =
        `✓ Tam tur bitti — cetvel ${results[id].ratio.toFixed(10)} gösteriyor. Yakınlaştır ↓`;
      setTimeout(() => showZoom(id), 400);
    }
  }
  animId = requestAnimationFrame(loop);
}

window.skipAnim = function () {
  if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
  cancelAnimationFrame(animId); playing = false; animT = 1;
  drawRoll(1);
  document.getElementById('animProg').style.width = '100%';
  document.getElementById('animBtn').textContent = '↺ YENİDEN';
  document.getElementById('animStatus').textContent =
    `✓ Tam tur bitti — cetvel ${results[currentP].ratio.toFixed(10)} gösteriyor. Yakınlaştır ↓`;
  setTimeout(() => showZoom(currentP), 200);
}

// ═══════════════════════════════════════════════════════════
//  ZOOM  —  DİNAMİK, sadece ratio değerinden
// ═══════════════════════════════════════════════════════════
const MAX_ZL = 10;

function getLevel(ratio, i) {
  const pow = Math.pow(10, i);
  const span = 1 / pow;
  const rMin = Math.floor(ratio * pow) / pow;
  const rMax = rMin + span;
  const digit = Math.floor(ratio * pow) % 10;
  return { i, pow, span, rMin, rMax, digit };
}

function showZoom(id) {
  document.getElementById('phaseC').classList.add('vis');
  document.getElementById('accumBox').classList.add('vis');
  document.getElementById('zoomGrid').innerHTML = '';
  buildZRow(id, 0);
}

function buildZRow(id, idx) {
  if (idx >= MAX_ZL) return;
  const p = PRESETS[id];
  const rat = results[id].ratio;
  const lv = getLevel(rat, idx);

  const row = document.createElement('div');
  row.className = 'zoom-row';

  const lbl = document.createElement('div');
  lbl.className = 'zlbl';
  lbl.innerHTML = `<span class="mag" style="color:${p.color}">×${lv.pow >= 1e6 ? (lv.pow / 1e6) + 'M' : lv.pow >= 1e3 ? (lv.pow / 1e3) + 'k' : lv.pow}</span><span class="sub">yakın</span>`;
  row.appendChild(lbl);

  const zc = document.createElement('canvas');
  zc.className = 'zr'; zc.height = 64;
  row.appendChild(zc);

  const dg = document.createElement('div');
  dg.className = 'zdig'; dg.style.color = p.color; dg.textContent = '?';
  row.appendChild(dg);

  document.getElementById('zoomGrid').appendChild(row);

  setTimeout(() => {
    zc.width = zc.offsetWidth || Math.min(680, zc.parentElement.clientWidth - 100);
    drawZRuler(zc, lv, p.color, rat);
    dg.textContent = lv.digit;
    updateAccum(id, idx);
    requestAnimationFrame(() => row.classList.add('show'));
    setTimeout(() => buildZRow(id, idx + 1), 650);
  }, 30);
}

function drawZRuler(canvas, lv, color, ratio) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const P = 26, rx0 = P, rw = W - P * 2;
  const ry = H - 22, rh = 30;
  const span = lv.span, mainT = 10, subT = 10;

  const g = ctx.createLinearGradient(rx0, ry, rx0, ry + rh);
  g.addColorStop(0, '#181000'); g.addColorStop(0.5, '#221600'); g.addColorStop(1, '#0c0800');
  ctx.fillStyle = g; ctx.strokeStyle = color + 'aa'; ctx.lineWidth = 1;
  ctx.fillRect(rx0, ry, rw, rh); ctx.strokeRect(rx0, ry, rw, rh);

  for (let i = 0; i <= mainT; i++) {
    const x = rx0 + rw * (i / mainT);
    for (let j = 1; j < subT; j++) {
      const xj = rx0 + rw * ((i + j / subT) / mainT);
      if (xj > rx0 + rw) break;
      ctx.strokeStyle = color + '25'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(xj, ry); ctx.lineTo(xj, ry + rh * (j === 5 ? .35 : .18)); ctx.stroke();
    }
    ctx.strokeStyle = color; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x, ry + rh * .62); ctx.stroke();
    const val = lv.rMin + span * (i / mainT);
    const dec = lv.i + 2;
    ctx.fillStyle = color; ctx.font = `${Math.max(7, 11 - lv.i)}px JetBrains Mono`;
    ctx.textAlign = 'center';
    ctx.fillText(val.toFixed(dec), x, ry + rh - 3);
  }

  // Kırmızı ok — ratio'nun bu penceredeki yeri
  const frac = (ratio - lv.rMin) / span;
  const piX = rx0 + rw * Math.max(0, Math.min(1, frac));
  ctx.save();
  ctx.strokeStyle = '#d93838'; ctx.lineWidth = 2.5;
  ctx.shadowColor = '#d9383890'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.moveTo(piX, ry - 2); ctx.lineTo(piX, ry + rh + 2); ctx.stroke();
  ctx.fillStyle = '#d93838';
  ctx.beginPath(); ctx.moveTo(piX, ry - 14); ctx.lineTo(piX - 6, ry - 2); ctx.lineTo(piX + 6, ry - 2); ctx.closePath(); ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#4a5878'; ctx.font = '9px JetBrains Mono'; ctx.textAlign = 'left';
  ctx.fillText(`[${lv.rMin.toFixed(lv.i + 1)} … ${lv.rMax.toFixed(lv.i + 1)}]`, rx0, 13);
}

function updateAccum(id, idx) {
  const p = PRESETS[id];
  const val = results[id].ratio.toFixed(15);
  const dotI = val.indexOf('.');
  let html = `<span class="sy">? = </span>`;
  for (let i = 0; i < val.length; i++) {
    const ch = val[i];
    if (ch === '.') { html += `<span class="sy">.</span>`; continue; }
    const dp = i > dotI ? i - dotI - 1 : -1;
    if (dp < 0) html += `<span class="lk">${ch}</span>`;
    else if (dp < idx) html += `<span class="lk">${ch}</span>`;
    else if (dp === idx) html += `<span class="fr" style="color:${p.color}">${ch}</span>`;
    else html += `<span class="bl">?</span>`;
  }
  document.getElementById('accumNum').innerHTML = html;
  document.getElementById('accumNote').textContent =
    `${p.name} çap (r=${p.r.toLocaleString()}) ile ${idx + 1} ondalık basamak okundu.`;
}

// ═══════════════════════════════════════════════════════════
//  KARŞILAŞTIRMA KUTUSU
// ═══════════════════════════════════════════════════════════
function updateCompareBox() {
  const computed = PRESETS.filter(p => results[p.id]);
  if (computed.length < 1) return;
  document.getElementById('compareBox').classList.add('vis');

  const rows = computed.map(p => {
    const rat = results[p.id].ratio.toFixed(12);
    // Kaç basamak doğru? (float64 limiti dahilinde)
    const ref = '3.141592653589';
    let correct = 0;
    for (let i = 0; i < Math.min(rat.length, ref.length); i++) {
      if (rat[i] === ref[i]) correct++;
      else break;
    }
    // Sayıyı renklendir: doğru/yanlış
    let dhtml = '';
    for (let i = 0; i < rat.length; i++) {
      if (i >= ref.length) { dhtml += `<span style="color:#4a5878">${rat[i]}</span>`; continue; }
      if (rat[i] === ref[i]) dhtml += `<span class="lk m">${rat[i]}</span>`;
      else { dhtml += `<span class="w m">${rat[i]}</span>`; break; }
    }
    return `
        <div class="cmp-row">
          <div class="cmp-label" style="color:${p.color}">${p.name}<br><span style="color:var(--dim);font-size:0.65rem">r=${p.r.toLocaleString()}</span></div>
          <div class="cmp-digits">${dhtml}</div>
        </div>`;
  }).join('');

  document.getElementById('cmpRows').innerHTML = rows;
}

// ═══════════════════════════════════════════════════════════
//  BAŞLANGIÇ
// ═══════════════════════════════════════════════════════════
window.onload = () => {
  renderPreset(0);
  styleProgBar(0);
}
