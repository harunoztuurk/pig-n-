const PI_DIGITS = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7, 1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4, 4, 5, 9, 2, 3, 0, 7, 8, 1, 6, 4, 0, 6, 2, 8, 6, 2, 0, 8, 9, 9, 8, 6, 2, 8, 0, 3, 4, 8, 2, 5, 3, 4, 2, 1, 1, 7, 0, 6, 7, 9, 8, 2, 1, 4, 8, 0, 8, 6, 5, 1, 3, 2, 8, 2, 3, 0, 6, 6, 4, 7, 0, 9, 3, 8, 4, 4, 6, 0, 9, 5, 5, 0, 5, 8, 2, 2, 3, 1, 7];

const NOTE_MAP = {
    0: { note: "C4", sol: "Do", freq: 261.63, color: "#FF6B6B" },
    1: { note: "D4", sol: "Re", freq: 293.66, color: "#FF9F43" },
    2: { note: "E4", sol: "Mi", freq: 329.63, color: "#F9CA24" },
    3: { note: "F4", sol: "Fa", freq: 349.23, color: "#6AB04C" },
    4: { note: "G4", sol: "Sol", freq: 392.00, color: "#22A6B3" },
    5: { note: "A4", sol: "La", freq: 440.00, color: "#4834D4" },
    6: { note: "B4", sol: "Si", freq: 493.88, color: "#BE2EDD" },
    7: { note: "C5", sol: "Do₂", freq: 523.25, color: "#E55039" },
    8: { note: "D5", sol: "Re₂", freq: 587.33, color: "#00B894" },
    9: { note: "E5", sol: "Mi₂", freq: 659.25, color: "#6C5CE7" },
};

const NOTE_OPTIONS = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si", "Do₂", "Re₂", "Mi₂"];

const SPEECH_MAP = {
    "do": "Do", "dö": "Do", "doo": "Do",
    "re": "Re", "rey": "Re",
    "mi": "Mi", "mı": "Mi",
    "fa": "Fa",
    "sol": "Sol", "soul": "Sol",
    "la": "La",
    "si": "Si", "sı": "Si",
    "do iki": "Do₂", "do2": "Do₂", "do ikinci": "Do₂",
    "re iki": "Re₂", "re2": "Re₂", "re ikinci": "Re₂",
    "mi iki": "Mi₂", "mi2": "Mi₂", "mi ikinci": "Mi₂",
};

// Vanilla State
let state = {
    groupIndex: 0,
    currentDigits: [],

    // Step Mode
    stepMode: false,
    currentStep: -1,
    waitingInput: false,

    // Play All
    isPlaying: false,
    activeIdx: null,

    // Answers
    noteAnswers: Array(14).fill(""),
    digitAnswers: Array(14).fill(""),
    checked: false,
    noteResults: Array(14).fill(null),
    digitResults: Array(14).fill(null),

    // Voice/Mic
    inputMode: "select", // "select" | "voice"
    micPermission: null,
    listeningIdx: null,
    voiceStatus: "",

    timeouts: [],
    rec: null
};

// --- Utils ---
function matchSpeech(transcript) {
    const t = transcript.toLowerCase().trim();
    if (SPEECH_MAP[t]) return SPEECH_MAP[t];
    const keys = Object.keys(SPEECH_MAP).sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (t.includes(key)) return SPEECH_MAP[key];
    }
    return null;
}

function playTone(freq, duration = 0.5) {
    return new Promise(resolve => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
        setTimeout(resolve, duration * 1000 + 100);
    });
}

function clearTimeouts() {
    state.timeouts.forEach(clearTimeout);
    state.timeouts = [];
}

function stopListening() {
    if (state.rec) {
        try { state.rec.abort(); } catch (e) { }
        state.rec = null;
    }
    state.listeningIdx = null;
    state.voiceStatus = "";
    renderMicState();
}

async function requestMicPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        return true;
    } catch (e) {
        return false;
    }
}

// --- Setup ---
document.addEventListener("DOMContentLoaded", () => {
    updateDigits();
    renderGroups();
    renderReferenceTable();
    initGameProfile(); // utils.js wrapper
    renderBoard();
});

function initGameProfile() {
    if (typeof GameUtils !== 'undefined') {
        const p = document.getElementById("userProfile");
        p.innerHTML = `
            <span class="hub-user-icon">👤</span>
            <span class="hub-username">${GameUtils.getUserName() || 'Misafir'}</span>
            <span style="color:var(--text);margin-left:10px;">🏆 Puan: ${GameUtils.getScore("pi-melody")}</span>
        `;
    }
}

function updateDigits() {
    const s = state.groupIndex * 14;
    state.currentDigits = PI_DIGITS.slice(s, s + 14);
}

// --- Renderers ---
function renderGroups() {
    const c = document.getElementById("groupBtns");
    c.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        const b = document.createElement("button");
        b.className = `grp-btn ${state.groupIndex === i ? 'active' : ''}`;
        b.textContent = i + 1;
        b.onclick = () => {
            if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
            changeGroup(i);
        };
        c.appendChild(b);
    }
}

function renderReferenceTable() {
    const c = document.getElementById("refItems");
    let html = "";
    Object.entries(NOTE_MAP).forEach(([d, v]) => {
        html += `<div class="ref-item">
            <span style="color: ${v.color}; font-weight: 700;">${d}</span>
            <span style="color: rgba(255,255,255,0.2);">→</span>
            <span style="color: rgba(255,255,255,0.75);">${v.sol}</span>
            <span style="color: rgba(255,255,255,0.18); font-size: 0.54rem;">(${v.note})</span>
        </div>`;
    });
    c.innerHTML = html;

    const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!speechSupported) {
        document.getElementById("micControls").classList.add("hidden");
    }
}

function renderBoard() {
    renderControls();
    renderVisualizer();
    renderStepInfo();
    renderInputs();
    renderResult();
}

function renderControls() {
    const btnPlay = document.getElementById("btnPlayAll");
    const btnStep = document.getElementById("btnStep");
    const btnReset = document.getElementById("btnReset");

    // Play Button
    btnPlay.disabled = state.isPlaying || state.stepMode;
    btnPlay.textContent = state.isPlaying ? "⏳ Çalıyor..." : "▶ Tümünü Çal";

    // Step Button
    btnStep.disabled = state.isPlaying;
    btnStep.className = `btn-accent ${state.stepMode && state.waitingInput ? 'waiting' : ''}`;
    btnStep.innerHTML = !state.stepMode ? "🎯 Adım Adım Çal" : (state.waitingInput ? "▶ Devam Et" : "🔁 Tekrar Çal");

    // Reset
    if (state.stepMode) btnReset.classList.remove("hidden");
    else btnReset.classList.add("hidden");

    // Listeners (only attach once via HTML is bad pattern for dynamic, using explicit assignments)
    btnPlay.onclick = playAll;
    btnStep.onclick = state.stepMode ? (state.waitingInput ? continueStep : replayStep) : startStepMode;
    btnReset.onclick = resetAll;

    const btnCheck = document.getElementById("btnCheck");
    btnCheck.onclick = checkAnswers;

    // Modes
    document.getElementById("btnModeSelect").onclick = () => { setInputMode("select"); };
    document.getElementById("btnModeVoice").onclick = () => { handleMicMode(); };
}

function renderStepInfo() {
    const el = document.getElementById("stepInfo");
    if (state.stepMode) {
        el.classList.remove("hidden");
        if (state.waitingInput) {
            el.innerHTML = `<strong style="color: #E55039">🎤 ${state.currentStep + 1}. nota çaldı.</strong> Nota adını gir, sonra <strong>"▶ Devam Et"</strong> butonuna bas.`;
        } else {
            el.innerHTML = `<span style="color: rgba(255,255,255,0.4)">Nota çalınıyor...</span>`;
        }
    } else {
        el.classList.add("hidden");
    }
}

function renderVisualizer() {
    const c = document.getElementById("visualizer");
    c.innerHTML = "";
    state.currentDigits.forEach((d, i) => {
        const v = NOTE_MAP[d];
        const isActive = state.activeIdx === i;
        const isDone = state.stepMode && i < state.currentStep;
        const isCurrent = state.stepMode && i === state.currentStep;

        const node = document.createElement("div");
        node.className = "vis-node";

        let bg = "rgba(255,255,255,0.05)";
        let border = "1px solid rgba(255,255,255,0.08)";
        let color = "rgba(255,255,255,0.15)";
        let transform = "scale(1)";
        let shadow = "none";
        let text = "·";

        if (isActive) {
            bg = v.color;
            border = `1px solid ${v.color}`;
            transform = "scale(1.22)";
            shadow = `0 0 18px ${v.color}88`;
            color = "#fff";
            text = "♪";
        } else if (isDone) {
            bg = "rgba(255,255,255,0.12)";
            color = "rgba(255,255,255,0.4)";
            text = "✓";
        } else if (isCurrent) {
            border = "1px solid rgba(229,80,57,0.6)";
        }

        node.style.background = bg;
        node.style.border = border;
        node.style.color = color;
        node.style.transform = transform;
        node.style.boxShadow = shadow;
        node.textContent = text;
        c.appendChild(node);
    });
}

function renderMicState() {
    document.getElementById("btnModeSelect").className = `mode-btn ${state.inputMode === "select" ? 'active' : ''}`;
    document.getElementById("btnModeVoice").className = `mode-btn ${state.inputMode === "voice" ? 'active' : ''}`;

    const vh = document.getElementById("voiceHelp");
    const err = document.getElementById("micError");

    if (state.inputMode === "voice") {
        vh.classList.remove("hidden");
        document.getElementById("voiceStatus").textContent = state.voiceStatus;
        err.classList.add("hidden");
    } else {
        vh.classList.add("hidden");
        if (state.micPermission === false) err.classList.remove("hidden");
        else err.classList.add("hidden");
    }

    // Re-render notes grid because button states change
    renderInputs(false); // don't redraw everything, just inputs
}

function renderInputs(full = true) {
    const ng = document.getElementById("notesGrid");
    const dg = document.getElementById("digitsGrid");

    if (full) {
        ng.innerHTML = "";
        dg.innerHTML = "";
    }

    for (let i = 0; i < 14; i++) {
        // Evaluate states
        const resN = state.noteResults[i];
        const resD = state.digitResults[i];
        const isListen = state.listeningIdx === i;
        const isCurrentStep = state.stepMode && i === state.currentStep;
        const isFutureStep = state.stepMode && i > state.currentStep;

        // NOTE CELL
        if (full) {
            const cw = document.createElement("div");
            cw.className = "cell-wrapper";
            cw.id = `cell-note-${i}`;
            ng.appendChild(cw);
        }

        const cwN = document.getElementById(`cell-note-${i}`);
        let nHtml = `<span class="cell-idx">${i + 1}</span>`;
        if (state.inputMode === "select") {
            const disabled = state.stepMode && (i > state.currentStep || (!state.waitingInput && i === state.currentStep));
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.05)";
            if (isCurrentStep && state.waitingInput) border = "2px solid #E55039";
            else if (resN !== null) {
                border = resN ? "2px solid #00B894" : "2px solid #FF6B6B";
                bg = resN ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)";
            }
            if (isFutureStep) { bg = "rgba(255,255,255,0.02)"; border = "1px solid rgba(255,255,255,0.05)"; }

            let op = `<option value="">—</option>`;
            NOTE_OPTIONS.forEach(opt => {
                op += `<option value="${opt}" ${state.noteAnswers[i] === opt ? 'selected' : ''}>${opt}</option>`;
            });

            nHtml += `<select class="note-select" style="border:${border};background:${bg};opacity:${isFutureStep ? 0.4 : 1};" ${disabled ? 'disabled' : ''} onchange="setNote(${i}, this.value)">${op}</select>`;
        } else {
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.05)";
            let txt = state.noteAnswers[i] ? state.noteAnswers[i] : "🎤";
            let cls = "note-mic";

            if (isListen) {
                border = "2px solid #E55039";
                bg = "rgba(229,80,57,0.2)";
                txt = "🎙";
                cls += " mic-pulse";
            } else if (isCurrentStep && state.waitingInput) {
                border = "2px solid #E55039";
            } else if (resN !== null) {
                border = resN ? "2px solid #00B894" : "2px solid #FF6B6B";
                bg = resN ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)";
            }

            nHtml += `<button class="${cls}" style="border:${border};background:${bg};opacity:${isFutureStep ? 0.3 : 1};font-size:${state.noteAnswers[i] && !isListen ? '0.56rem' : '1rem'}" ${isFutureStep ? 'disabled' : ''} onclick="!${isFutureStep} && startListening(${i})">${txt}</button>`;
        }

        if (state.checked && resN !== null) {
            nHtml += `<span class="cell-result" style="color: ${resN ? '#00B894' : '#FF6B6B'}">${resN ? '✓' : NOTE_MAP[state.currentDigits[i]].sol}</span>`;
        }
        cwN.innerHTML = nHtml;


        // DIGIT CELL
        if (full) {
            const cwD = document.createElement("div");
            cwD.className = "cell-wrapper";
            cwD.id = `cell-dig-${i}`;
            dg.appendChild(cwD);
        }
        const cwD = document.getElementById(`cell-dig-${i}`);
        let dHtml = `<span class="cell-idx">${i + 1}</span>`;
        let dBorder = resD === null ? "1px solid rgba(255,255,255,0.12)" : (resD ? "2px solid #00B894" : "2px solid #FF6B6B");
        let dBg = resD === null ? "rgba(255,255,255,0.05)" : (resD ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)");
        if (isFutureStep) dBg = "rgba(255,255,255,0.02)";

        dHtml += `<input type="text" maxlength="1" class="digit-input" value="${state.digitAnswers[i]}" ${isFutureStep ? 'disabled' : ''} style="border:${dBorder};background:${dBg};opacity:${isFutureStep ? 0.3 : 1}" oninput="setDigit(${i}, this.value)" />`;

        if (state.checked && resD !== null) {
            dHtml += `<span class="cell-result" style="color: ${resD ? '#00B894' : '#FF6B6B'}">${resD ? '✓' : state.currentDigits[i]}</span>`;
        }
        cwD.innerHTML = dHtml;
    }
}

function renderResult() {
    const rb = document.getElementById("resultBox");
    if (!state.checked) {
        rb.classList.add("hidden");
        return;
    }

    const nC = state.noteResults.filter(Boolean).length;
    const dC = state.digitResults.filter(Boolean).length;
    const totalCorrect = nC + dC;

    rb.style.background = totalCorrect === 28 ? "rgba(0,184,148,0.15)" : (totalCorrect >= 20 ? "rgba(249,202,36,0.08)" : "rgba(255,107,107,0.1)");
    rb.style.border = `1px solid ${totalCorrect === 28 ? "#00B894" : (totalCorrect >= 20 ? "#F9CA24" : "#FF6B6B")}`;

    document.getElementById("resIcon").textContent = totalCorrect === 28 ? "🎉" : (totalCorrect >= 20 ? "👏" : "🎵");
    document.getElementById("resScore").textContent = `${totalCorrect} / 28`;
    document.getElementById("resMsg").textContent = totalCorrect === 28 ? "Mükemmel! Tüm cevaplar doğru!" : (totalCorrect >= 20 ? "Çok iyi! Tekrar dene." : "Melodiyi tekrar dinle ve dene.");
    document.getElementById("resDetail").textContent = `Nota: ${nC}/14 | Rakam: ${dC}/14`;

    let gHtml = `π bölüm ${state.groupIndex + 1}: `;
    state.currentDigits.forEach(d => {
        gHtml += `<span style="color:${NOTE_MAP[d].color}; margin-right:2px">${d}</span>`;
    });
    document.getElementById("resGroup").innerHTML = gHtml;

    rb.classList.remove("hidden");
}

// --- Logic ---
window.changeGroup = function (i) {
    state.groupIndex = i;
    resetAll();
    updateDigits();
    renderGroups();
    renderBoard();
};

window.playAll = function () {
    if (state.isPlaying || state.stepMode) return;
    if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
    clearTimeouts();
    state.isPlaying = true;
    state.activeIdx = null;
    renderBoard();

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const step = 0.6;
    state.currentDigits.forEach((d, i) => {
        const t1 = setTimeout(() => { state.activeIdx = i; renderVisualizer(); }, i * step * 1000);
        const t2 = setTimeout(() => {
            state.activeIdx = null;
            renderVisualizer();
            if (i === 13) { state.isPlaying = false; renderBoard(); }
        }, (i * step + 0.5) * 1000);
        state.timeouts.push(t1, t2);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(NOTE_MAP[d].freq, now + i * step);
        gain.gain.setValueAtTime(0, now + i * step);
        gain.gain.linearRampToValueAtTime(0.5, now + i * step + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * step + 0.5);
        osc.start(now + i * step);
        osc.stop(now + i * step + 0.5);
    });
};

window.startStepMode = async function () {
    if (state.isPlaying) return;
    if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
    resetAll(false);
    state.stepMode = true;
    renderBoard();
    await playStepAt(0);
};

window.playStepAt = async function (idx) {
    if (idx >= 14) return;
    state.currentStep = idx;
    state.activeIdx = idx;
    renderBoard();
    await playTone(NOTE_MAP[state.currentDigits[idx]].freq, 0.6);
    state.activeIdx = null;
    state.waitingInput = true;
    renderBoard();

    if (state.inputMode === "voice" && state.listeningIdx === null) {
        setTimeout(() => startListening(idx), 200);
    }
};

window.continueStep = async function () {
    if (typeof GameUtils !== 'undefined' && !state.inputMode.startsWith('voice')) GameUtils.playSound('click'); // Let voice handle own sound
    const next = state.currentStep + 1;
    state.waitingInput = false;
    if (next >= 14) {
        state.stepMode = false;
        state.currentStep = -1;
        renderBoard();
        return;
    }
    await playStepAt(next);
};

window.replayStep = async function () {
    if (state.currentStep < 0) return;
    if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
    state.activeIdx = state.currentStep;
    renderBoard();
    await playTone(NOTE_MAP[state.currentDigits[state.currentStep]].freq, 0.6);
    state.activeIdx = null;
    renderBoard();
};

window.setNote = function (i, val) {
    state.noteAnswers[i] = val;
    if (state.checked) {
        state.checked = false;
        state.noteResults = Array(14).fill(null);
        state.digitResults = Array(14).fill(null);
        renderResult();
    }
    renderInputs(false);
};

window.setDigit = function (i, val) {
    state.digitAnswers[i] = val.replace(/[^0-9]/g, "");
    if (state.checked) {
        state.checked = false;
        state.noteResults = Array(14).fill(null);
        state.digitResults = Array(14).fill(null);
        renderResult();
    }
    renderInputs(false);
};

window.checkAnswers = function () {
    if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
    stopListening();
    state.noteResults = state.currentDigits.map((d, i) => state.noteAnswers[i]?.trim() === NOTE_MAP[d].sol);
    state.digitResults = state.currentDigits.map((d, i) => state.digitAnswers[i]?.trim() === String(d));
    state.checked = true;
    renderBoard();

    // Scoring logic (custom addition based on standard)
    const totalCorrect = state.noteResults.filter(Boolean).length + state.digitResults.filter(Boolean).length;
    if (totalCorrect > 0 && typeof GameUtils !== 'undefined') {
        let currentScore = GameUtils.getScore("pi-melody");
        let addedScore = 0;
        if (totalCorrect === 28) addedScore = 50;
        else addedScore = Math.floor(totalCorrect / 2); // max 14 pts

        if (addedScore > 0 && (currentScore + addedScore <= 500)) { // rough cap
            GameUtils.saveScore("pi-melody", currentScore + addedScore);
            initGameProfile();
            GameUtils.playSound('success');
        } else if (totalCorrect === 28) {
            GameUtils.playSound('success');
        } else {
            GameUtils.playSound('error');
        }
    }
};

window.resetAll = function (rerunBoard = true) {
    clearTimeouts();
    state.isPlaying = false;
    state.stepMode = false;
    state.currentStep = -1;
    state.waitingInput = false;
    state.activeIdx = null;
    state.noteAnswers = Array(14).fill("");
    state.digitAnswers = Array(14).fill("");
    state.checked = false;
    state.noteResults = Array(14).fill(null);
    state.digitResults = Array(14).fill(null);
    stopListening();
    if (rerunBoard) renderBoard();
};

window.handleMicMode = async function () {
    if (state.inputMode === "voice") {
        state.inputMode = "select";
        stopListening();
        return;
    }
    if (state.micPermission === false) {
        state.voiceStatus = "⚠ Mikrofon izni reddedildi. Tarayıcı ayarlarından izin ver.";
        state.inputMode = "voice";
        renderMicState();
        return;
    }
    state.voiceStatus = "Mikrofon izni isteniyor...";
    renderMicState();
    const granted = await requestMicPermission();
    state.micPermission = granted;
    if (granted) {
        state.inputMode = "voice";
        state.voiceStatus = "";
    } else {
        state.voiceStatus = "⚠ Mikrofon izni reddedildi. Tarayıcı adres çubuğundaki 🔒 simgesinden izin ver.";
    }
    renderMicState();
};

window.startListening = function (cellIdx) {
    if (state.listeningIdx === cellIdx) { stopListening(); return; }
    stopListening();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "tr-TR"; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
    state.rec = rec;
    state.listeningIdx = cellIdx;
    state.voiceStatus = "🎙 Dinleniyor...";
    renderMicState();

    rec.onresult = (e) => {
        let matched = null; let lastT = "";
        for (let r = e.results.length - 1; r >= 0; r--) {
            for (let a = 0; a < e.results[r].length; a++) {
                const t = e.results[r][a].transcript;
                if (!lastT) lastT = t;
                const m = matchSpeech(t); if (m) { matched = m; break; }
            }
            if (matched) break;
        }
        if (lastT) {
            state.voiceStatus = `"${lastT}"`;
            renderMicState();
        }
        const isFinal = e.results[e.results.length - 1].isFinal;
        if (matched && isFinal) {
            const ci = state.listeningIdx;
            state.noteAnswers[ci] = matched;
            state.checked = false;
            state.noteResults = Array(14).fill(null);
            state.digitResults = Array(14).fill(null);
            state.voiceStatus = `✅ "${matched}" kaydedildi`;
            renderMicState();
            state.rec = null;
            setTimeout(() => {
                state.listeningIdx = null;
                state.voiceStatus = "";
                renderMicState();

                if (state.stepMode) {
                    setTimeout(() => continueStep(), 300);
                } else {
                    const next = ci + 1;
                    if (next < 14) startListening(next);
                }
            }, 600);
        }
    };

    rec.onerror = (e) => {
        if (e.error === "not-allowed") {
            state.micPermission = false;
            state.voiceStatus = "⚠ Mikrofon izni yok. Tarayıcı adres çubuğundaki 🔒 simgesinden izin ver.";
            state.inputMode = "select";
            stopListening();
            return;
        }
        if (e.error === "no-speech") { state.voiceStatus = "🎙 Dinleniyor..."; renderMicState(); return; }
        state.voiceStatus = `⚠ Hata: ${e.error}`;
        renderMicState();
    };

    rec.onend = () => {
        if (state.rec === rec && state.listeningIdx !== null) {
            try { rec.start(); } catch (e) { }
        }
    };
    try { rec.start(); } catch (e) { state.voiceStatus = "⚠ Mikrofon açılamadı"; renderMicState(); }
};
