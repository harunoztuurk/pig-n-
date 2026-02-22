// ── CEVAPLAR ─────────────────────────────────────────────
const answers = {
    '2-4': '3', '5-0': '.', '0-3': '1', '6-3': '4',
    '4-4': '5', '1-0': '9', '4-2': '2', '2-2': '6',
};

const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const rowLabels = ['1', '2', '3', '4', '5'];
const allInputs = {};
const slotEls = {};

// ── GRID ─────────────────────────────────────────────────
function buildGrid() {
    const tbody = document.getElementById('gridBody');
    for (let r = 0; r < 5; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < 7; c++) {
            const td = document.createElement('td');
            const key = `${c}-${r}`;
            if (c === 0 && r === 0) {
                td.className = 'start-cell';
                td.textContent = '(S)';
            } else {
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.maxLength = 1;
                inp.className = 'cell-input';
                inp.inputMode = 'numeric'; // Better mobile keyboard
                inp.addEventListener('input', function () {
                    this.classList.remove('correct', 'wrong');
                    document.getElementById('scoreMsg').textContent = '';
                    document.getElementById('scoreMsg').className = 'score-msg';
                    updateEntryBox();
                });
                inp.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswers(); });
                allInputs[key] = inp;
                td.appendChild(inp);
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    buildEntrySlots();
}

function buildEntrySlots() {
    const container = document.getElementById('entrySlots');
    container.innerHTML = '';
    for (const key of Object.keys(answers)) {
        const [c, r] = key.split('-').map(Number);
        const label = colLabels[c] + rowLabels[r];

        const slot = document.createElement('div');
        slot.className = 'entry-slot';
        slot.innerHTML = `<span class="slot-val">—</span><span class="entry-slot-key">${label}</span>`;
        slotEls[key] = slot;
        container.appendChild(slot);
    }
}

function updateEntryBox() {
    for (const [key, slot] of Object.entries(slotEls)) {
        const inp = allInputs[key];
        const val = inp ? inp.value.trim() : '';
        const valEl = slot.querySelector('.slot-val');
        if (val !== '') {
            valEl.textContent = val;
            slot.classList.add('filled');
            if (val === answers[key]) {
                slot.classList.add('correct-slot');
            } else {
                slot.classList.remove('correct-slot');
            }
        } else {
            valEl.textContent = '—';
            slot.classList.remove('filled', 'correct-slot');
        }
    }
}

function checkAnswers() {
    for (const inp of Object.values(allInputs)) inp.classList.remove('correct', 'wrong');
    let correct = 0, total = Object.keys(answers).length;
    for (const [key, expected] of Object.entries(answers)) {
        const inp = allInputs[key];
        if (!inp) continue;
        const val = inp.value.trim();
        if (val === expected) {
            inp.classList.add('correct');
            correct++;
        } else if (val !== '') {
            inp.classList.add('wrong');
        }
    }
    updateEntryBox();
    const msg = document.getElementById('scoreMsg');
    if (correct === total) {
        msg.textContent = `✓ MÜKEMMEL! ${total}/${total} DOĞRU! Şimdi çiz!`;
        msg.className = 'score-msg success';
    } else if (correct > 0) {
        msg.textContent = `${correct}/${total} DOĞRU — DEVAM ET!`;
        msg.className = 'score-msg partial';
    } else {
        msg.textContent = 'HENÜZ DOĞRU YOK — TEKRAR DENEYELİM!';
        msg.className = 'score-msg fail';
    }
}

function resetGrid() {
    for (const inp of Object.values(allInputs)) {
        inp.value = '';
        inp.classList.remove('correct', 'wrong');
    }
    document.getElementById('scoreMsg').textContent = '';
    document.getElementById('scoreMsg').className = 'score-msg';
    updateEntryBox();
}

// ── MOD ───────────────────────────────────────────────────
let currentMode = 'input';
function setMode(mode) {
    currentMode = mode;
    const canvas = document.getElementById('drawCanvas');
    const colorBox = document.getElementById('colorBox');
    const inputBtns = document.getElementById('inputBtns');
    const drawBtns = document.getElementById('drawBtns');
    const hint = document.getElementById('hintMsg');
    const entryBox = document.getElementById('entryBox');

    if (mode === 'input') {
        canvas.classList.remove('active');
        colorBox.classList.remove('visible');
        inputBtns.style.display = 'flex';
        drawBtns.style.display = 'none';
        document.getElementById('tabInput').classList.add('active');
        document.getElementById('tabDraw').classList.remove('active');
        hint.textContent = 'Hücreye tıkla ve sayıyı yaz.';
        entryBox.style.display = 'block';
        for (const inp of Object.values(allInputs)) inp.style.pointerEvents = 'auto';
    } else {
        canvas.classList.add('active');
        colorBox.classList.add('visible');
        inputBtns.style.display = 'none';
        drawBtns.style.display = 'flex';
        document.getElementById('tabInput').classList.remove('active');
        document.getElementById('tabDraw').classList.add('active');
        hint.textContent = 'Sayıların üzerine tıklayıp sürükle — yaklaşınca otomatik yapışır.';
        entryBox.style.display = 'none';
        for (const inp of Object.values(allInputs)) inp.style.pointerEvents = 'none';
        redraw();
    }
}

// ── ÇİZİM ─────────────────────────────────────────────────
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let currentColor = '#ffe600';
let strokes = [], drawing = false, currentStroke = null;
const CELL = 60, SNAP = 26;

const nodePositions = {
    '2-4': { x: 2 * CELL + CELL / 2, y: 4 * CELL + CELL / 2 },
    '5-0': { x: 5 * CELL + CELL / 2, y: 0 * CELL + CELL / 2 },
    '0-3': { x: 0 * CELL + CELL / 2, y: 3 * CELL + CELL / 2 },
    '6-3': { x: 6 * CELL + CELL / 2, y: 3 * CELL + CELL / 2 },
    '4-4': { x: 4 * CELL + CELL / 2, y: 4 * CELL + CELL / 2 },
    '1-0': { x: 1 * CELL + CELL / 2, y: 0 * CELL + CELL / 2 },
    '4-2': { x: 4 * CELL + CELL / 2, y: 2 * CELL + CELL / 2 },
    '2-2': { x: 2 * CELL + CELL / 2, y: 2 * CELL + CELL / 2 },
    'S': { x: 0 * CELL + CELL / 2, y: 0 * CELL + CELL / 2 },
};

function selectColor(el) {
    document.querySelectorAll('.color-opt').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    currentColor = el.dataset.color;
}

function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width, sy = canvas.height / r.height;
    if (e.touches && e.touches.length > 0) {
        return { x: (e.touches[0].clientX - r.left) * sx, y: (e.touches[0].clientY - r.top) * sy };
    }
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
}

function snapNearest(x, y) {
    let best = null, bestD = Infinity;
    for (const pos of Object.values(nodePositions)) {
        const d = Math.hypot(pos.x - x, pos.y - y);
        if (d < bestD) {
            bestD = d;
            best = pos;
        }
    }
    return bestD < SNAP ? best : null;
}

canvas.addEventListener('mousedown', e => { if (currentMode !== 'draw') return; e.preventDefault(); startDraw(e); });
canvas.addEventListener('mousemove', e => { if (currentMode !== 'draw') return; moveDraw(e); });
canvas.addEventListener('mouseup', e => { if (currentMode !== 'draw') return; endDraw(e); });
canvas.addEventListener('mouseleave', e => { if (currentMode !== 'draw') return; endDraw(e); });

canvas.addEventListener('touchstart', e => { if (currentMode !== 'draw') return; e.preventDefault(); startDraw(e); }, { passive: false });
canvas.addEventListener('touchmove', e => { if (currentMode !== 'draw') return; e.preventDefault(); moveDraw(e); }, { passive: false });
canvas.addEventListener('touchend', e => { if (currentMode !== 'draw') return; e.preventDefault(); endDraw(e); }, { passive: false });

function startDraw(e) {
    drawing = true;
    const pos = getPos(e);
    const sn = snapNearest(pos.x, pos.y);
    currentStroke = { color: currentColor, points: [{ ...(sn || pos) }] };
}

function moveDraw(e) {
    if (!drawing || !currentStroke) return;
    const pos = getPos(e);
    const sn = snapNearest(pos.x, pos.y);
    currentStroke.points.push(sn || pos);
    redraw();
    drawS(currentStroke, true);
}

function endDraw(e) {
    if (!drawing || !currentStroke) return;
    drawing = false;
    if (currentStroke.points.length > 1) strokes.push(currentStroke);
    currentStroke = null;
    redraw();
}

function drawS(stroke, live) {
    if (stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = stroke.color;
    ctx.shadowBlur = live ? 15 : 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(s => drawS(s, false));
}

function undoLast() {
    strokes.pop();
    redraw();
}

function resetCanvas() {
    strokes = [];
    redraw();
}

// ── SIZING BUG FIX & RESPONSIVE SCALING ──────────────────
function handleResize() {
    const container = document.querySelector('.grid-container');
    const outer = document.querySelector('.grid-outer');
    if (!container || !outer) return;

    const containerWidth = container.clientWidth;
    const gridWidthFull = 460; // outer width including labels

    if (containerWidth < gridWidthFull) {
        const scale = containerWidth / gridWidthFull;
        outer.style.transform = `scale(${scale})`;
        // Adjust container height to match scaled grid
        container.style.height = `${330 * scale}px`;
    } else {
        outer.style.transform = 'scale(1)';
        container.style.height = '330px';
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', () => {
    buildGrid();
    handleResize();
});
