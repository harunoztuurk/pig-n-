// SABİTLER (React kodundan aktarıldı)
const PI_DIGITS = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7];

const COLORS = {
    0: { name: "Beyaz", hex: "#FFFFFF", border: "#bbb", text: "#333" },
    1: { name: "Sarı", hex: "#FFD700", border: "#c8a800", text: "#333" },
    2: { name: "Kırmızı", hex: "#E63946", border: "#a8000d", text: "#fff" },
    3: { name: "Mavi", hex: "#2979FF", border: "#0d47a1", text: "#fff" },
    4: { name: "Yeşil", hex: "#43A047", border: "#1b5e20", text: "#fff" },
    5: { name: "Mor", hex: "#8E24AA", border: "#4a0072", text: "#fff" },
    6: { name: "Kahverengi", hex: "#6D4C41", border: "#3e2723", text: "#fff" },
    7: { name: "Bordo", hex: "#880E4F", border: "#49000b", text: "#fff" },
    8: { name: "Lacivert", hex: "#1A237E", border: "#000051", text: "#fff" },
    9: { name: "Fenerbahçe", hex: "fb", border: "#FFD700", text: "#FFD700" },
};

const MIXES = [
    { result: 4, type: "2color", a: 1, b: 3, c: null },  // Sarı + Mavi = Yeşil
    { result: 5, type: "2color", a: 2, b: 3, c: null },  // Kırmızı + Mavi = Mor
    { result: 6, type: "3color", a: 2, b: 3, c: 1 },  // Kırmızı + Mavi + Sarı = Kahverengi
    { result: 7, type: "2xcolor", a: 2, b: 3, c: null },  // 2×Kırmızı + Mavi = Bordo
    { result: 8, type: "2xcolor", a: 3, b: 2, c: null },  // 2×Mavi + Kırmızı = Lacivert
    { result: 9, type: "special", a: null, b: null, c: null },
];

const FB_SVG = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#003366" stroke="#FFD700" stroke-width="5" /><text x="50" y="61" text-anchor="middle" font-size="34" font-weight="bold" fill="#FFD700" font-family="serif">FB</text></svg>`;

let currentPhase = 0;
let discoveredColors = [];

// Zamanlayıcı Değişkenleri
let timerInterval = null;
let secondsElapsed = 0;

// YARDIMCI VE RENDER FONKSİYONLARI
function normalize(s) {
    if (!s) return "";
    return s.toLowerCase().trim()
        .replace(/ı/g, "i").replace(/i̇/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
        .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c");
}

function colorMatch(input, num) {
    return normalize(input) === normalize(COLORS[num].name);
}

function getColorBoxStyle(num, size) {
    const c = COLORS[num];
    const isFb = c.hex === "fb";
    const bg = isFb ? "linear-gradient(135deg, #FFD700 50%, #003366 50%)" : c.hex;
    const shadow = isFb ? "#FFD70055" : c.hex + "66";
    return `width:${size}px; height:${size}px; background:${bg}; border:3px solid ${c.border}; box-shadow:0 3px 12px ${shadow};`;
}

function getFilledBox(num, size = 46) {
    const c = COLORS[num];
    const isFb = c.hex === "fb";
    const bg = isFb ? "linear-gradient(135deg, #FFD700 50%, #003366 50%)" : c.hex;
    const content = isFb ? FB_SVG(size * 0.6) : num;
    return `<div class="color-box" style="width:${size}px; height:${size}px; background:${bg}; border:3px solid ${c.border}; color:${c.text}; font-size:${size * 0.38}px; font-weight:900;">${content}</div>`;
}

function getFilledStringBox(num) {
    const c = COLORS[num];
    const isFb = c.hex === "fb";
    const bg = isFb ? "linear-gradient(135deg, #FFD700 50%, #003366 50%)" : c.hex;
    return `<div class="color-box" style="width:100px; height:46px; background:${bg}; border:3px solid ${c.border}; color:${c.text}; font-size:12px; font-weight:700;">${c.name}</div>`;
}

// -----------------------------
// AŞAMA 1: TEMEL RENKLER (RENDER)
// -----------------------------
function renderPhase1() {
    const grid = document.getElementById("phase1-grid");
    let html = "";
    [0, 1, 2, 3].forEach(n => {
        const c = COLORS[n];
        html += `
            <div class="color-card" style="border: 2px solid ${c.border}; box-shadow: 0 0 24px ${c.hex}44;">
                <div class="color-box" style="${getColorBoxStyle(n, 90)}">${c.hex === 'fb' ? FB_SVG(60) : ''}</div>
                <div style="font-size: 42px; font-weight: 900; color: ${c.hex === "fb" ? "#FFD700" : c.hex}; line-height: 1;">${n}</div>
                <div style="font-size: 17px; color: #ddd; font-weight: 600;">${c.name}</div>
            </div>`;
    });
    grid.innerHTML = html;
}

// -----------------------------
// AŞAMA 2: KARIŞIMLAR (RENDER & LOGIC)
// -----------------------------
let mixState = MIXES.map(m => ({
    c1: "", c2: "", c3: "", n1: "", n2: "", n3: "", nr: "", status: "idle"
}));

function renderPhase2() {
    const list = document.getElementById("phase2-list");
    let html = "";

    MIXES.forEach((mix, i) => {
        const row = mixState[i];
        const done = row.status === "correct";
        const stCls = row.status === "wrong" ? "input-wrong" : "input-idle";
        const borderCol = done ? COLORS[mix.result].border : (row.status === "wrong" ? "#f44336aa" : "#2a2a4a");
        const shadow = done ? `0 0 16px ${COLORS[mix.result].hex === "fb" ? "#FFD70033" : COLORS[mix.result].hex + "33"}` : "none";

        let contentObj = "";

        // Sonuç Kutusu
        contentObj += `<div class="color-box" style="${getColorBoxStyle(mix.result, 46)}">${COLORS[mix.result].hex === 'fb' ? FB_SVG(30) : ''}</div> <div class="sym">=</div>`;

        // Tiplere göre template literals
        if (mix.type === "special") {
            contentObj += `
                <span style="color:#666; font-size:12px; font-style:italic;">Özel Fenerbahçe</span> <div class="sym">=</div>
                ${done ? getFilledBox(9) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="nr" value="${row.nr}" placeholder="?">`}
            `;
        } else if (mix.type === "2color") {
            contentObj += `
                ${done ? getFilledStringBox(mix.a) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c1" value="${row.c1}" placeholder="renk adı...">`} <div class="sym">+</div>
                ${done ? getFilledStringBox(mix.b) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c2" value="${row.c2}" placeholder="renk adı...">`} <div class="sym">=</div>
                ${done ? getFilledBox(mix.a) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n1" value="${row.n1}" placeholder="?">`} <div class="sym">+</div>
                ${done ? getFilledBox(mix.b) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n2" value="${row.n2}" placeholder="?">`} <div class="sym">=</div>
                ${done ? getFilledBox(mix.result) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="nr" value="${row.nr}" placeholder="?">`}
            `;
        } else if (mix.type === "3color") {
            contentObj += `
                ${done ? getFilledStringBox(mix.a) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c1" value="${row.c1}" placeholder="renk...">`} <div class="sym">+</div>
                ${done ? getFilledStringBox(mix.b) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c2" value="${row.c2}" placeholder="renk...">`} <div class="sym">+</div>
                ${done ? getFilledStringBox(mix.c) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c3" value="${row.c3}" placeholder="renk...">`} <div class="sym">=</div>
                ${done ? getFilledBox(mix.a) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n1" value="${row.n1}" placeholder="?">`} <div class="sym">+</div>
                ${done ? getFilledBox(mix.b) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n2" value="${row.n2}" placeholder="?">`} <div class="sym">+</div>
                ${done ? getFilledBox(mix.c) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n3" value="${row.n3}" placeholder="?">`} <div class="sym">=</div>
                ${done ? getFilledBox(mix.result) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="nr" value="${row.nr}" placeholder="?">`}
            `;
        } else if (mix.type === "2xcolor") {
            contentObj += `
                <div class="sym">2×</div> ${done ? getFilledStringBox(mix.a) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c1" value="${row.c1}" placeholder="renk...">`} <div class="sym">+</div>
                ${done ? getFilledStringBox(mix.b) : `<input type="text" class="name-input ${stCls}" data-idx="${i}" data-f="c2" value="${row.c2}" placeholder="renk...">`} <div class="sym">=</div>
                <div class="sym">2×</div> ${done ? getFilledBox(mix.a) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n1" value="${row.n1}" placeholder="?">`} <div class="sym">+</div>
                ${done ? getFilledBox(mix.b) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="n2" value="${row.n2}" placeholder="?">`} <div class="sym">=</div>
                ${done ? getFilledBox(mix.result) : `<input type="text" class="num-input ${stCls}" maxlength="1" data-idx="${i}" data-f="nr" value="${row.nr}" placeholder="?">`}
            `;
        }

        contentObj += done ? `<span style="font-size:22px; margin-left:4px;">✅</span>` : `<button class="btn-check-row" onclick="checkRow(${i})">✓</button>`;
        const errObj = row.status === "wrong" ? `<div style="color:#f44336; font-size:12px; margin-top:8px; text-align:center;">❌ Yanlış! Tekrar dene.</div>` : "";

        // Row build
        html += `<div class="mix-row" style="border-color:${borderCol}; box-shadow:${shadow};"><div class="mix-content">${contentObj}</div>${errObj}</div>`;
    });

    list.innerHTML = html;

    // Add Event Listeners for new DOM items
    document.querySelectorAll('#phase2-list input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const val = e.target.value;
            const field = e.target.dataset.f;
            if (field.startsWith("n") && val !== "" && !/^\d$/.test(val)) {
                e.target.value = e.target.value.replace(/[^\d]/g, ''); // Sadece sayı
                return;
            }
            const idx = parseInt(e.target.dataset.idx);
            mixState[idx][field] = e.target.value;
            mixState[idx].status = "idle";
            e.target.className = e.target.className.replace("input-wrong", "input-idle"); // Anında temizle görseli
        });
    });

    // Check if ALL are correct
    if (mixState.every(r => r.status === "correct")) {
        document.getElementById('phase2-success').style.display = "inline-block";
    }
}

window.checkRow = function (i) {
    const mix = MIXES[i];
    const row = mixState[i];
    let ok = false;

    if (mix.type === "special") {
        ok = row.nr === "9";
    } else if (mix.type === "2color" || mix.type === "3color") {
        ok = parseInt(row.nr) === mix.result;
    } else if (mix.type === "2xcolor") {
        ok = colorMatch(row.c1, mix.a) && colorMatch(row.c2, mix.b) &&
            parseInt(row.n1) === mix.a && parseInt(row.n2) === mix.b && parseInt(row.nr) === mix.result;
    }

    mixState[i].status = ok ? "correct" : "wrong";

    // Ses Efektleri
    if (typeof GameUtils !== 'undefined') {
        GameUtils.playSound(ok ? 'click' : 'error');
    }

    if (ok && !discoveredColors.includes(mix.result)) {
        discoveredColors.push(mix.result);
        renderColorRef();
    }
    renderPhase2();
};


// -----------------------------
// AŞAMA 3: PI ŞİFRESİ
// -----------------------------
let piAnswers = Array(14).fill("");

function renderPhase3() {
    const grid = document.getElementById("phase3-grid");
    let html = "";
    PI_DIGITS.forEach((digit, i) => {
        const c = COLORS[digit];
        html += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <div class="color-box" style="${getColorBoxStyle(digit, 50)} transition: border-color 0.3s;" id="pi-box-${i}">
                    ${c.hex === 'fb' ? FB_SVG(32) : ''}
                </div>
                <input type="text" maxlength="1" class="num-input input-idle" style="width:36px; height:36px; font-size:19px;" data-piidx="${i}" value="${piAnswers[i]}">
                <span style="color:#777; font-size:10px;">${i + 1}</span>
            </div>
        `;
    });
    grid.innerHTML = html;

    // Events
    document.querySelectorAll('#phase3-grid input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val !== "" && !/^\d$/.test(val)) { e.target.value = val.replace(/[^\d]/g, ''); return; }

            const idx = parseInt(e.target.dataset.piidx);
            piAnswers[idx] = val;

            // Re-eval Buton
            const allFilled = piAnswers.every(a => a !== "");
            const btn = document.getElementById("checkPiBtn");
            if (allFilled) {
                btn.removeAttribute("disabled");
                btn.classList.add("ready");
            } else {
                btn.setAttribute("disabled", "true");
                btn.classList.remove("ready");
            }

            // Durumları temizle (Eğer yanlış uyarı varsa gitsin)
            document.getElementById("phase3-result").style.display = "none";
            e.target.className = "num-input input-idle";
            document.getElementById(`pi-box-${idx}`).style.borderColor = COLORS[PI_DIGITS[idx]].border;
        });
    });
}

document.getElementById('checkPiBtn').addEventListener("click", () => {
    const correctArr = piAnswers.map((a, i) => parseInt(a) === PI_DIGITS[i]);
    const allCorrect = correctArr.every(Boolean);
    const resultBox = document.getElementById("phase3-result");

    // UI Güncelle (Doğrular Yeşil, Yanlışlar Kırmızı)
    document.querySelectorAll('#phase3-grid input').forEach((inp, i) => {
        const ok = correctArr[i];
        inp.className = `num-input ${ok ? "input-correct" : "input-wrong"}`;
        const box = document.getElementById(`pi-box-${i}`);
        box.style.borderColor = ok ? "#4CAF50" : "#f44336";
    });

    resultBox.style.display = "inline-block";

    if (allCorrect) {
        if (typeof GameUtils !== 'undefined') GameUtils.playSound('success');
        clearInterval(timerInterval); // Süreyi durdur

        resultBox.style.background = "#0d3b23";
        resultBox.style.borderColor = "#4CAF50";
        resultBox.innerHTML = `
            <div style="font-size: 20px; font-weight: 900; color: #4CAF50; margin-bottom: 10px;">
                🏆 Tebrikler! Pi'nin ilk 14 hanesini buldun!
            </div>
            <div style="font-size: 30px; font-weight: 900; letter-spacing: 4px; background: linear-gradient(90deg,#FFD700,#43A047,#2979FF,#8E24AA,#FFD700); background-clip: text; -webkit-background-clip: text; color: transparent;">
                π ≈ 3.1415926535897
            </div>
        `;

        // BAŞARILI OLUNCA SKORU KAYDET:
        if (typeof GameUtils !== 'undefined' && GameUtils.saveScore) {
            GameUtils.saveScore('pi-renk-kodlama', 100);
            renderLocalLeaderboard(); // Güncel tabloyu çek
            setTimeout(() => { GameUtils.triggerSuccessEffect(); }, 500);
        }
    } else {
        if (typeof GameUtils !== 'undefined') GameUtils.playSound('error');
        resultBox.style.background = "#1e0d0d";
        resultBox.style.borderColor = "#f44336";
        resultBox.innerHTML = `
            <div style="font-size: 17px; color: #f44336; font-weight: 700;">
                ❌ Bazı yanıtlar yanlış. Kırmızı kutulara bak ve tekrar dene!
            </div>
        `;
    }
});

// -----------------------------
// TAB RENDER VE AŞAMA YÖNETİMİ
// -----------------------------
function updatePhase() {
    // Tabları renklendir
    document.querySelectorAll('.pi-tab').forEach((tab, index) => {
        if (index === currentPhase) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    // Panelleri göster gizle
    document.querySelectorAll('.phase-panel').forEach((panel, index) => {
        if (index === currentPhase) panel.classList.add('active');
        else panel.classList.remove('active');
    });

    // Butonları gizle çıkar
    document.getElementById('btnPrev').style.display = currentPhase > 0 ? "inline-block" : "none";
    document.getElementById('btnNext').style.display = currentPhase < 2 ? "inline-block" : "none";
}

document.querySelectorAll('.pi-tab').forEach(t => {
    t.addEventListener('click', (e) => {
        if (typeof GameUtils !== 'undefined') GameUtils.playSound('hover');
        currentPhase = parseInt(e.target.dataset.phase);
        updatePhase();
    });
});

document.getElementById('btnPrev').addEventListener('click', () => {
    if (typeof GameUtils !== 'undefined') GameUtils.playSound('hover');
    if (currentPhase > 0) { currentPhase--; updatePhase(); }
});
document.getElementById('btnNext').addEventListener('click', () => {
    if (typeof GameUtils !== 'undefined') GameUtils.playSound('hover');
    if (currentPhase < 2) { currentPhase++; updatePhase(); }
});


// -----------------------------
// COLOR REF TABLE
// -----------------------------
function renderColorRef() {
    const list = document.getElementById("colorRefList");
    let visible = [0, 1, 2, 3, ...discoveredColors];
    let html = "";
    visible.forEach(n => {
        const c = COLORS[n];
        html += `
            <div class="ref-item">
                <div class="ref-color" style="background:${c.hex === 'fb' ? 'linear-gradient(135deg, #FFD700 50%, #003366 50%)' : c.hex}; border:2px solid ${c.border};">
                    ${c.hex === 'fb' ? FB_SVG(14) : ''}
                </div>
                <span style="color:#ddd; font-size:13px; font-weight:800;">${n}</span>
            </div>
        `;
    });
    list.innerHTML = html;
}

// -----------------------------
// TIMER & LEADERBOARD ALTYAPISI
// -----------------------------
function initTimerAndLeaderboard() {
    secondsElapsed = 0;
    const timerDisplay = document.getElementById('gameTimerDisplay');

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        if (timerDisplay) {
            const m = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
            const s = String(secondsElapsed % 60).padStart(2, '0');
            timerDisplay.innerText = `${m}:${s}`;
        }
    }, 1000);

    renderLocalLeaderboard();
}

function renderLocalLeaderboard() {
    const listEl = document.getElementById('leaderboardList');
    if (!listEl) return;

    if (typeof GameUtils !== 'undefined' && GameUtils.getLeaderboard) {
        const board = GameUtils.getLeaderboard('pi-renk-kodlama');
        listEl.innerHTML = '';

        if (board.length === 0) {
            listEl.innerHTML = '<div style="color: rgba(0, 245, 255, 0.5); font-size: 0.85rem; padding: 10px; text-align: center;">Kayıt bulunamadı.</div>';
            return;
        }

        board.forEach((user, index) => {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid rgba(0, 245, 255, 0.1); font-size: 0.9rem;';
            row.innerHTML = `<span style="color: ${index === 0 ? 'var(--yellow)' : 'var(--cyan)'};">${index + 1}. ${user.name}</span> <span style="font-weight: bold; color: var(--pink);">${user.score} P</span>`;
            listEl.appendChild(row);
        });
    }
}

// -----------------------------
// BAŞLATICILAR
// -----------------------------
window.addEventListener('load', async () => {
    if (typeof GameUtils !== 'undefined' && GameUtils.syncWithDatabase) {
        await GameUtils.syncWithDatabase();
    }
    renderPhase1();
    renderPhase2();
    renderPhase3();
    renderColorRef();
    updatePhase();
    initTimerAndLeaderboard();
});
