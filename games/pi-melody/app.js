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
document.addEventListener("DOMContentLoaded", async () => {
    updateDigits();
    renderGroups();
    renderReferenceTable();
    if (typeof GameUtils !== 'undefined' && GameUtils.syncWithDatabase) {
        await GameUtils.syncWithDatabase();
    }
    initGameProfile(); // utils.js wrapper
    renderBoard();
});

function initGameProfile() {
    if (typeof GameUtils !== 'undefined') {
        const p = document.getElementById("userProfile");
        p.innerHTML = `
            <span style="margin-right:8px;">👤 ${GameUtils.getUserName() || 'Misafir'}</span>
            <span style="color:var(--gold, #F9CA24);">🏆 ${GameUtils.getScore("pi-melody")}</span>
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
        const isAct = state.groupIndex === i;
        const border = isAct ? "2px solid #6C5CE7" : "1px solid rgba(255,255,255,0.1)";
        const bg = isAct ? "#6C5CE7" : "rgba(255,255,255,0.04)";
        const weight = isAct ? 700 : 400;

        const b = document.createElement("button");
        b.className = `grp-btn`;
        b.style = `border:${border}; background:${bg}; font-weight:${weight};`;
        b.textContent = i + 1;
        b.onclick = () => {
            // Ses kapalı: if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
            changeGroup(i);
        };
        c.appendChild(b);
    }
}

function renderReferenceTable() {
    const c = document.getElementById("refItems");
    let html = "";
    Object.entries(NOTE_MAP).forEach(([d, v]) => {
        html += `<div style="display: flex; align-items: center; gap: 4px; padding: 4px 7px; background: rgba(255,255,255,0.04); border-radius: 6px; font-size: 0.85rem;">
            <span style="color: ${v.color}; font-weight: 700;">${d}</span>
            <span style="color: rgba(255,255,255,0.2);">→</span>
            <span style="color: rgba(255,255,255,0.75);">${v.sol}</span>
            <span style="color: rgba(255,255,255,0.18); font-size: 0.7rem;">(${v.note})</span>
        </div>`;
    });
    c.innerHTML = html;

    const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!speechSupported) {
        document.getElementById("micControls").style.display = "none";
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
    const playDis = state.isPlaying || state.stepMode;
    btnPlay.disabled = playDis;
    btnPlay.textContent = state.isPlaying ? "⏳ Çalıyor..." : "▶ Tümünü Çal";
    btnPlay.style.background = playDis ? "rgba(255,255,255,0.07)" : "linear-gradient(135deg,#6C5CE7,#a29bfe)";
    btnPlay.style.cursor = playDis ? "not-allowed" : "pointer";
    btnPlay.style.opacity = playDis ? 0.5 : 1;
    btnPlay.style.boxShadow = playDis ? "none" : "0 0 24px rgba(108,92,231,0.4)";

    // Step Button
    const stepDis = state.isPlaying;
    btnStep.disabled = stepDis;
    btnStep.innerHTML = !state.stepMode ? "🎯 Adım Adım Çal" : (state.waitingInput ? "▶ Devam Et" : "🔁 Tekrar Çal");
    btnStep.style.background = state.stepMode ? (state.waitingInput ? "linear-gradient(135deg,#00B894,#00CEC9)" : "linear-gradient(135deg,#E55039,#ff7675)") : "linear-gradient(135deg,#E55039,#ff7675)";
    btnStep.style.cursor = stepDis ? "not-allowed" : "pointer";
    btnStep.style.opacity = stepDis ? 0.5 : 1;
    btnStep.style.boxShadow = state.stepMode && state.waitingInput ? "0 0 24px rgba(0,184,148,0.4)" : "0 0 24px rgba(229,80,57,0.4)";

    // Reset
    btnReset.style.display = state.stepMode ? "inline-block" : "none";
}

window.handleStepBtn = function () {
    if (state.stepMode) {
        if (state.waitingInput) continueStep();
        else replayStep();
    } else {
        startStepMode();
    }
}

window.setInputMode = function (m) {
    state.inputMode = m;
    stopListening();
    renderMicState();
}

function renderStepInfo() {
    const el = document.getElementById("stepInfo");
    if (state.stepMode) {
        el.style.display = "block";
        if (state.waitingInput) {
            el.innerHTML = `<strong style="color: #E55039">🎤 ${state.currentStep + 1}. nota çaldı.</strong> Nota adını gir, sonra <strong>"▶ Devam Et"</strong> butonuna bas.`;
        } else {
            el.innerHTML = `<span style="color: rgba(255,255,255,0.4)">Nota çalınıyor...</span>`;
        }
    } else {
        el.style.display = "none";
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

        let bg = isActive ? v.color : (isDone ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)");
        let border = `1px solid ${isActive ? v.color : (isCurrent && !isActive ? "rgba(229,80,57,0.6)" : "rgba(255,255,255,0.08)")}`;
        let col = isDone ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)";
        if (isActive) col = "#fff";
        let transform = isActive ? "scale(1.22)" : "scale(1)";
        let shadow = isActive ? `0 0 18px ${v.color}88` : "none";

        node.style = `width: 34px; height: 34px; border-radius: 8px; background: ${bg}; border: ${border}; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: ${col}; transition: all 0.12s; transform: ${transform}; box-shadow: ${shadow};`;

        node.textContent = isActive ? "♪" : (isDone ? "✓" : "·");
        c.appendChild(node);
    });
}

function renderMicState() {
    document.getElementById("btnModeSelect").style.background = state.inputMode === "select" ? "#6C5CE7" : "rgba(255,255,255,0.07)";
    document.getElementById("btnModeVoice").style.background = state.inputMode === "voice" ? "#E55039" : "rgba(255,255,255,0.07)";

    const vh = document.getElementById("voiceHelp");
    const err = document.getElementById("micError");

    if (state.inputMode === "voice") {
        vh.style.display = "block";
        const vS = document.getElementById("voiceStatus");
        vS.textContent = state.voiceStatus;
        vS.style.color = state.listeningIdx !== null ? "#F9CA24" : "#aaa";
        err.style.display = "none";
    } else {
        vh.style.display = "none";
        if (state.micPermission === false) err.style.display = "block";
        else err.style.display = "none";
    }

    renderInputs(false);
}

function renderInputs(full = true) {
    const ng = document.getElementById("notesGrid");
    const dg = document.getElementById("digitsGrid");

    if (full) {
        ng.innerHTML = "";
        dg.innerHTML = "";
    }

    for (let i = 0; i < 14; i++) {
        const resN = state.noteResults[i];
        const resD = state.digitResults[i];
        const isListen = state.listeningIdx === i;
        const isCurrentStep = state.stepMode && i === state.currentStep;
        const isFutureStep = state.stepMode && i > state.currentStep;

        // NOTE CELL
        if (full) {
            const cw = document.createElement("div");
            cw.style = "display: flex; flex-direction: column; align-items: center; gap: 3px;";
            cw.id = `cell-note-${i}`;
            ng.appendChild(cw);
        }

        const cwN = document.getElementById(`cell-note-${i}`);
        let nHtml = `<span style="font-size: 0.85rem; color: rgba(255,255,255,0.18);">${i + 1}</span>`;
        if (state.inputMode === "select") {
            const disabled = state.stepMode && (i > state.currentStep || (!state.waitingInput && i === state.currentStep));
            let border = (isCurrentStep && state.waitingInput) ? "2px solid #E55039" : (resN === null ? "1px solid rgba(255,255,255,0.12)" : (resN ? "2px solid #00B894" : "2px solid #FF6B6B"));
            let bg = isFutureStep ? "rgba(255,255,255,0.02)" : (resN === null ? "rgba(255,255,255,0.05)" : (resN ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)"));
            let col = isFutureStep ? "rgba(255,255,255,0.15)" : "#fff";
            let cur = isFutureStep ? "not-allowed" : "pointer";
            let opc = isFutureStep ? 0.4 : 1;

            let op = `<option value="">—</option>`;
            NOTE_OPTIONS.forEach(opt => {
                op += `<option value="${opt}" ${state.noteAnswers[i] === opt ? 'selected' : ''}>${opt}</option>`;
            });

            nHtml += `<select class="note-select" style="border:${border};background:${bg};opacity:${opc};color:${col};cursor:${cur}" ${disabled ? 'disabled' : ''} onchange="setNote(${i}, this.value)">${op}</select>`;
        } else {
            let border = isListen ? "2px solid #E55039" : ((isCurrentStep && state.waitingInput) ? "2px solid #E55039" : (resN === null ? "1px solid rgba(255,255,255,0.12)" : (resN ? "2px solid #00B894" : "2px solid #FF6B6B")));
            let bg = isListen ? "rgba(229,80,57,0.2)" : (isFutureStep ? "rgba(255,255,255,0.02)" : (resN === null ? "rgba(255,255,255,0.05)" : (resN ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)")));
            let txt = isListen ? "🎙" : (state.noteAnswers[i] ? state.noteAnswers[i] : "🎤");
            let fz = (state.noteAnswers[i] && !isListen) ? "0.85rem" : "1.3rem";
            let cur = isFutureStep ? "not-allowed" : "pointer";
            let opc = isFutureStep ? 0.3 : 1;
            let cls = `note-mic ${isListen ? 'mic-pulse' : ''}`;

            nHtml += `<button class="${cls}" style="border:${border};background:${bg};opacity:${opc};cursor:${cur};font-size:${fz}" ${isFutureStep ? 'disabled' : ''} onclick="!${isFutureStep} && startListening(${i})">${txt}</button>`;
        }

        if (state.checked && resN !== null) {
            nHtml += `<span style="font-size: 0.85rem; color: ${resN ? '#00B894' : '#FF6B6B'}">${resN ? '✓' : NOTE_MAP[state.currentDigits[i]].sol}</span>`;
        }
        cwN.innerHTML = nHtml;


        // DIGIT CELL
        if (full) {
            const cwD = document.createElement("div");
            cwD.style = "display: flex; flex-direction: column; align-items: center; gap: 3px;";
            cwD.id = `cell-dig-${i}`;
            dg.appendChild(cwD);
        }
        const cwD = document.getElementById(`cell-dig-${i}`);
        let dHtml = `<span style="font-size: 0.85rem; color: rgba(255,255,255,0.18);">${i + 1}</span>`;
        let dBorder = resD === null ? "1px solid rgba(255,255,255,0.12)" : (resD ? "2px solid #00B894" : "2px solid #FF6B6B");
        let dBg = isFutureStep ? "rgba(255,255,255,0.02)" : (resD === null ? "rgba(255,255,255,0.05)" : (resD ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)"));
        let cur = isFutureStep ? "not-allowed" : "text";
        let dOpc = isFutureStep ? 0.3 : 1;

        dHtml += `<input type="text" maxlength="1" class="digit-input" value="${state.digitAnswers[i]}" ${isFutureStep ? 'disabled' : ''} style="border:${dBorder};background:${dBg};opacity:${dOpc};cursor:${cur}" oninput="setDigit(${i}, this.value)" />`;

        if (state.checked && resD !== null) {
            dHtml += `<span style="font-size: 0.85rem; color: ${resD ? '#00B894' : '#FF6B6B'}">${resD ? '✓' : state.currentDigits[i]}</span>`;
        }
        cwD.innerHTML = dHtml;
    }
}

function renderResult() {
    const rb = document.getElementById("resultBox");
    if (!state.checked) {
        rb.style.display = "none";
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

    rb.style.display = "block";
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
    // Ses kapalı: if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
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
    // Ses kapalı: if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
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
    // Ses kapalı: if (typeof GameUtils !== 'undefined' && !state.inputMode.startsWith('voice')) GameUtils.playSound('click'); // Let voice handle own sound
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
    // Ses kapalı: if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
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
    // Ses kapalı: if (typeof GameUtils !== 'undefined') GameUtils.playSound('click');
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
            // GameUtils.playSound('success');
        } else if (totalCorrect === 28) {
            // GameUtils.playSound('success');
        } else {
            // GameUtils.playSound('error');
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

// --- Keyboard Event Listeners ---
window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    if (e.key >= '0' && e.key <= '9') {
        const num = parseInt(e.key, 10);
        if (NOTE_MAP[num]) {
            playTone(NOTE_MAP[num].freq, 0.4);
        }
    }
});
