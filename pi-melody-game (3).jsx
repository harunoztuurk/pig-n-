import { useState, useRef, useCallback, useEffect } from "react";

const PI_DIGITS = [3,1,4,1,5,9,2,6,5,3,5,8,9,7,9,3,2,3,8,4,6,2,6,4,3,3,8,3,2,7,9,5,0,2,8,8,4,1,9,7,1,6,9,3,9,9,3,7,5,1,0,5,8,2,0,9,7,4,9,4,4,5,9,2,3,0,7,8,1,6,4,0,6,2,8,6,2,0,8,9,9,8,6,2,8,0,3,4,8,2,5,3,4,2,1,1,7,0,6,7,9,8,2,1,4,8,0,8,6,5,1,3,2,8,2,3,0,6,6,4,7,0,9,3,8,4,4,6,0,9,5,5,0,5,8,2,2,3,1,7];

const NOTE_MAP = {
  0: { note: "C4", sol: "Do",  freq: 261.63, color: "#FF6B6B" },
  1: { note: "D4", sol: "Re",  freq: 293.66, color: "#FF9F43" },
  2: { note: "E4", sol: "Mi",  freq: 329.63, color: "#F9CA24" },
  3: { note: "F4", sol: "Fa",  freq: 349.23, color: "#6AB04C" },
  4: { note: "G4", sol: "Sol", freq: 392.00, color: "#22A6B3" },
  5: { note: "A4", sol: "La",  freq: 440.00, color: "#4834D4" },
  6: { note: "B4", sol: "Si",  freq: 493.88, color: "#BE2EDD" },
  7: { note: "C5", sol: "Do₂", freq: 523.25, color: "#E55039" },
  8: { note: "D5", sol: "Re₂", freq: 587.33, color: "#00B894" },
  9: { note: "E5", sol: "Mi₂", freq: 659.25, color: "#6C5CE7" },
};

const NOTE_OPTIONS = ["Do","Re","Mi","Fa","Sol","La","Si","Do₂","Re₂","Mi₂"];

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

// Mikrofon izni al
async function requestMicPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop()); // sadece izin için açtık, kapat
    return true;
  } catch (e) {
    return false;
  }
}

export default function App() {
  const [groupIndex, setGroupIndex] = useState(0);

  // Adım adım mod state
  const [stepMode, setStepMode] = useState(false);       // true = nota başına dur-bekle
  const [currentStep, setCurrentStep] = useState(-1);    // hangi nota çalındı (-1 = henüz başlamadı)
  const [waitingInput, setWaitingInput] = useState(false); // kullanıcıdan giriş bekleniyor mu

  // Normal toplu çalma
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  const [noteAnswers, setNoteAnswers] = useState(Array(14).fill(""));
  const [digitAnswers, setDigitAnswers] = useState(Array(14).fill(""));
  const [checked, setChecked] = useState(false);
  const [noteResults, setNoteResults] = useState(Array(14).fill(null));
  const [digitResults, setDigitResults] = useState(Array(14).fill(null));

  const [inputMode, setInputMode] = useState("select"); // "select" | "voice"
  const [micPermission, setMicPermission] = useState(null); // null | true | false
  const [listeningIdx, setListeningIdx] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState("");

  const timeoutsRef = useRef([]);
  const recRef = useRef(null);
  const listeningIdxRef = useRef(null);
  const noteAnswersRef = useRef(noteAnswers);
  const stepPlayingRef = useRef(false); // adım adım çalma aktif mi

  useEffect(() => { noteAnswersRef.current = noteAnswers; }, [noteAnswers]);
  useEffect(() => { listeningIdxRef.current = listeningIdx; }, [listeningIdx]);

  const currentDigits = PI_DIGITS.slice(groupIndex * 14, groupIndex * 14 + 14);

  const clearTimeouts = () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };

  const stopListening = useCallback(() => {
    if (recRef.current) { try { recRef.current.abort(); } catch(e){} recRef.current = null; }
    setListeningIdx(null); listeningIdxRef.current = null; setVoiceStatus("");
  }, []);

  const resetAll = useCallback(() => {
    clearTimeouts();
    setIsPlaying(false);
    setStepMode(false);
    setCurrentStep(-1);
    setWaitingInput(false);
    stepPlayingRef.current = false;
    setActiveIdx(null);
    setNoteAnswers(Array(14).fill(""));
    setDigitAnswers(Array(14).fill(""));
    setChecked(false);
    setNoteResults(Array(14).fill(null));
    setDigitResults(Array(14).fill(null));
    stopListening();
  }, [stopListening]);

  const changeGroup = (idx) => { setGroupIndex(idx); resetAll(); };

  // --- Normal toplu çalma ---
  const playAll = useCallback(() => {
    if (isPlaying || stepMode) return;
    clearTimeouts(); setIsPlaying(true); setActiveIdx(null);
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime; const step = 0.6;
    currentDigits.forEach((d, i) => {
      const t1 = setTimeout(() => setActiveIdx(i), i * step * 1000);
      const t2 = setTimeout(() => { setActiveIdx(null); if (i === 13) setIsPlaying(false); }, (i * step + 0.5) * 1000);
      timeoutsRef.current.push(t1, t2);
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.setValueAtTime(NOTE_MAP[d].freq, now + i * step);
      gain.gain.setValueAtTime(0, now + i * step);
      gain.gain.linearRampToValueAtTime(0.5, now + i * step + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * step + 0.5);
      osc.start(now + i * step); osc.stop(now + i * step + 0.5);
    });
  }, [isPlaying, stepMode, currentDigits]);

  // --- Adım adım çalma ---
  const startStepMode = useCallback(async () => {
    if (isPlaying) return;
    resetAll();
    setStepMode(true);
    stepPlayingRef.current = true;
    await playStepAt(0);
  }, [isPlaying, currentDigits]);

  const playStepAt = async (idx) => {
    if (idx >= 14) return;
    setCurrentStep(idx);
    setActiveIdx(idx);
    await playTone(NOTE_MAP[currentDigits[idx]].freq, 0.6);
    setActiveIdx(null);
    setWaitingInput(true);
    // Ses modundaysa otomatik dinlemeye başla
  };

  // Adım adım: giriş yapıldıktan sonra "Devam Et" butonuyla ya da sesle otomatik ilerleme
  const continueStep = useCallback(async () => {
    const next = currentStep + 1;
    setWaitingInput(false);
    if (next >= 14) {
      // Bitti
      setStepMode(false);
      setCurrentStep(-1);
      stepPlayingRef.current = false;
      return;
    }
    await playStepAt(next);
  }, [currentStep, currentDigits]);

  // Notu tekrar çal (aynı adım)
  const replayStep = useCallback(async () => {
    if (currentStep < 0) return;
    setActiveIdx(currentStep);
    await playTone(NOTE_MAP[currentDigits[currentStep]].freq, 0.6);
    setActiveIdx(null);
  }, [currentStep, currentDigits]);

  // --- Mikrofon izni ---
  const handleMicMode = async () => {
    if (inputMode === "voice") { setInputMode("select"); stopListening(); return; }
    if (micPermission === false) {
      setVoiceStatus("⚠ Mikrofon izni reddedildi. Tarayıcı ayarlarından izin ver.");
      setInputMode("voice");
      return;
    }
    setVoiceStatus("Mikrofon izni isteniyor...");
    const granted = await requestMicPermission();
    setMicPermission(granted);
    if (granted) { setInputMode("voice"); setVoiceStatus(""); }
    else { setVoiceStatus("⚠ Mikrofon izni reddedildi. Tarayıcı adres çubuğundaki 🔒 simgesinden izin ver."); }
  };

  // --- Ses tanıma ---
  const startListening = useCallback((cellIdx) => {
    if (listeningIdxRef.current === cellIdx) { stopListening(); return; }
    stopListening();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "tr-TR"; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
    recRef.current = rec;
    setListeningIdx(cellIdx); listeningIdxRef.current = cellIdx;
    setVoiceStatus("🎙 Dinleniyor...");

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
      if (lastT) setVoiceStatus(`"${lastT}"`);
      const isFinal = e.results[e.results.length - 1].isFinal;
      if (matched && isFinal) {
        const ci = listeningIdxRef.current;
        const arr = [...noteAnswersRef.current]; arr[ci] = matched; setNoteAnswers(arr);
        setChecked(false); setNoteResults(Array(14).fill(null)); setDigitResults(Array(14).fill(null));
        setVoiceStatus(`✅ "${matched}" kaydedildi`);
        recRef.current = null;
        setTimeout(() => {
          setListeningIdx(null); listeningIdxRef.current = null; setVoiceStatus("");
          // Adım modunda → otomatik devam et
          if (stepPlayingRef.current) {
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
        setMicPermission(false);
        setVoiceStatus("⚠ Mikrofon izni yok. Tarayıcı adres çubuğundaki 🔒 simgesinden izin ver.");
        setInputMode("select");
        stopListening();
        return;
      }
      if (e.error === "no-speech") { setVoiceStatus("🎙 Dinleniyor..."); return; }
      setVoiceStatus(`⚠ Hata: ${e.error}`);
    };
    rec.onend = () => {
      if (recRef.current === rec && listeningIdxRef.current !== null) {
        try { rec.start(); } catch(e) {}
      }
    };
    try { rec.start(); } catch(e) { setVoiceStatus("⚠ Mikrofon açılamadı"); }
  }, [stopListening, continueStep]);

  // Adım modunda not girildikten sonra seste otomatik dinle
  useEffect(() => {
    if (stepMode && waitingInput && inputMode === "voice" && currentStep >= 0 && listeningIdx === null) {
      setTimeout(() => startListening(currentStep), 200);
    }
  }, [waitingInput, stepMode, inputMode, currentStep]);

  useEffect(() => () => { clearTimeouts(); stopListening(); }, []);

  const setNote = (i, val) => {
    const arr = [...noteAnswers]; arr[i] = val; setNoteAnswers(arr);
    if (checked) { setChecked(false); setNoteResults(Array(14).fill(null)); setDigitResults(Array(14).fill(null)); }
  };
  const setDigit = (i, val) => {
    const arr = [...digitAnswers]; arr[i] = val; setDigitAnswers(arr);
    if (checked) { setChecked(false); setNoteResults(Array(14).fill(null)); setDigitResults(Array(14).fill(null)); }
  };

  const checkAnswers = () => {
    stopListening();
    const nRes = currentDigits.map((d, i) => noteAnswers[i]?.trim() === NOTE_MAP[d].sol);
    const dRes = currentDigits.map((d, i) => digitAnswers[i]?.trim() === String(d));
    setNoteResults(nRes); setDigitResults(dRes); setChecked(true);
  };

  const totalCorrect = checked ? noteResults.filter(Boolean).length + digitResults.filter(Boolean).length : 0;
  const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#fff", fontFamily: "'Courier New', monospace", padding: "26px 14px 60px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(229,80,57,0.7)} 60%{box-shadow:0 0 0 10px rgba(229,80,57,0)} }
        .mic-pulse { animation: micPulse 1.2s infinite; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "clamp(1.5rem,5vw,2.5rem)", fontWeight: 700, fontFamily: "Georgia, serif" }}>
          π <span style={{ color: "#6C5CE7" }}>×</span> Müzik
        </div>
        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.28)", marginTop: "5px", letterSpacing: "0.15em" }}>
          Pi'nin rakamlarını nota olarak dinle ve doğru bil
        </div>
      </div>

      {/* Group Selector */}
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "0.56rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.2em", textAlign: "center", marginBottom: "7px" }}>BÖLÜM SEÇ</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <button key={i} onClick={() => changeGroup(i)} style={{
              width: "34px", height: "34px", borderRadius: "7px",
              border: groupIndex === i ? "2px solid #6C5CE7" : "1px solid rgba(255,255,255,0.1)",
              background: groupIndex === i ? "#6C5CE7" : "rgba(255,255,255,0.04)",
              color: "#fff", fontFamily: "inherit", fontSize: "0.8rem", cursor: "pointer",
              fontWeight: groupIndex === i ? 700 : 400,
            }}>{i + 1}</button>
          ))}
        </div>
      </div>

      {/* Reference Table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 15px", marginBottom: "16px", maxWidth: "620px", width: "100%" }}>
        <div style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.22)", marginBottom: "7px" }}>EŞLEŞME TABLOSU</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {Object.entries(NOTE_MAP).map(([d, v]) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 7px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", fontSize: "0.66rem" }}>
              <span style={{ color: v.color, fontWeight: 700 }}>{d}</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>{v.sol}</span>
              <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.54rem" }}>({v.note})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Play Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={playAll} disabled={isPlaying || stepMode} style={{
          padding: "11px 28px", borderRadius: "50px", border: "none",
          background: (isPlaying || stepMode) ? "rgba(255,255,255,0.07)" : "linear-gradient(135deg,#6C5CE7,#a29bfe)",
          color: "#fff", fontSize: "0.88rem", fontFamily: "inherit", letterSpacing: "0.08em",
          cursor: (isPlaying || stepMode) ? "not-allowed" : "pointer",
          opacity: (isPlaying || stepMode) ? 0.5 : 1,
          boxShadow: (isPlaying || stepMode) ? "none" : "0 0 24px rgba(108,92,231,0.4)",
        }}>
          {isPlaying ? "⏳ Çalıyor..." : "▶ Tümünü Çal"}
        </button>

        <button onClick={stepMode ? (waitingInput ? continueStep : replayStep) : startStepMode}
          disabled={isPlaying}
          style={{
            padding: "11px 22px", borderRadius: "50px", border: "none",
            background: stepMode
              ? (waitingInput ? "linear-gradient(135deg,#00B894,#00CEC9)" : "linear-gradient(135deg,#E55039,#ff7675)")
              : "linear-gradient(135deg,#E55039,#ff7675)",
            color: "#fff", fontSize: "0.88rem", fontFamily: "inherit", letterSpacing: "0.08em",
            cursor: isPlaying ? "not-allowed" : "pointer",
            opacity: isPlaying ? 0.5 : 1,
            boxShadow: stepMode && waitingInput ? "0 0 24px rgba(0,184,148,0.4)" : "0 0 24px rgba(229,80,57,0.4)",
          }}>
          {!stepMode ? "🎯 Adım Adım Çal" : waitingInput ? "▶ Devam Et" : "🔁 Tekrar Çal"}
        </button>

        {stepMode && (
          <button onClick={resetAll} style={{
            padding: "11px 18px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem",
            fontFamily: "inherit", cursor: "pointer",
          }}>✕ Sıfırla</button>
        )}
      </div>

      {/* Adım modu bilgisi */}
      {stepMode && (
        <div style={{
          marginBottom: "16px", padding: "10px 18px",
          background: "rgba(229,80,57,0.1)", border: "1px solid rgba(229,80,57,0.3)",
          borderRadius: "10px", fontSize: "0.7rem", color: "rgba(255,255,255,0.65)",
          maxWidth: "620px", width: "100%", textAlign: "center",
        }}>
          {waitingInput
            ? <><strong style={{ color: "#E55039" }}>🎤 {currentStep + 1}. nota çaldı.</strong> Nota adını gir, sonra <strong>"▶ Devam Et"</strong> butonuna bas.</>
            : <span style={{ color: "rgba(255,255,255,0.4)" }}>Nota çalınıyor...</span>
          }
        </div>
      )}

      {/* Visualizer */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center", maxWidth: "620px" }}>
        {currentDigits.map((d, i) => {
          const v = NOTE_MAP[d];
          const isActive = activeIdx === i;
          const isDone = stepMode && i < currentStep;
          const isCurrent = stepMode && i === currentStep;
          return (
            <div key={i} style={{
              width: "34px", height: "34px", borderRadius: "8px",
              background: isActive ? v.color : isDone ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isActive ? v.color : isCurrent && !isActive ? "rgba(229,80,57,0.6)" : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.72rem", color: isDone ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
              transition: "all 0.12s", transform: isActive ? "scale(1.22)" : "scale(1)",
              boxShadow: isActive ? `0 0 18px ${v.color}88` : "none",
            }}>{isActive ? "♪" : isDone ? "✓" : "·"}</div>
          );
        })}
      </div>

      <div style={{ maxWidth: "620px", width: "100%" }}>

        {/* STEP 1 — Nota isimleri */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "15px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)" }}>ADIM 1 — Nota solfej adlarını gir</div>
            {speechSupported && (
              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => { setInputMode("select"); stopListening(); }} style={{
                  padding: "4px 10px", borderRadius: "16px", border: "none", fontSize: "0.6rem", fontFamily: "inherit", cursor: "pointer",
                  background: inputMode === "select" ? "#6C5CE7" : "rgba(255,255,255,0.07)", color: "#fff",
                }}>☰ Seç</button>
                <button onClick={handleMicMode} style={{
                  padding: "4px 10px", borderRadius: "16px", border: "none", fontSize: "0.6rem", fontFamily: "inherit", cursor: "pointer",
                  background: inputMode === "voice" ? "#E55039" : "rgba(255,255,255,0.07)", color: "#fff",
                }}>🎙 Sesle</button>
              </div>
            )}
          </div>

          {inputMode === "voice" && (
            <div style={{ marginBottom: "10px", padding: "9px 12px", background: "rgba(229,80,57,0.08)", border: "1px solid rgba(229,80,57,0.25)", borderRadius: "9px", fontSize: "0.64rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Kutuya tıkla → söyle: <strong style={{ color: "rgba(255,255,255,0.85)" }}>Do · Re · Mi · Fa · Sol · La · Si · Do iki · Re iki · Mi iki</strong>
              {voiceStatus && <div style={{ marginTop: "6px", fontWeight: 700, color: listeningIdx !== null ? "#F9CA24" : "#aaa" }}>{voiceStatus}</div>}
            </div>
          )}

          {/* Ses izin hatası */}
          {micPermission === false && (
            <div style={{ marginBottom: "10px", padding: "9px 12px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: "9px", fontSize: "0.62rem", color: "#FF6B6B" }}>
              🔒 Mikrofon izni reddedildi. Tarayıcı adres çubuğundaki <strong>🔒 kilit simgesine</strong> tıklayıp mikrofon iznini aç, sayfayı yenile.
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {Array.from({ length: 14 }, (_, i) => {
              const res = noteResults[i];
              const isListen = listeningIdx === i;
              const isCurrentStep = stepMode && i === currentStep;
              const isPastStep = stepMode && i < currentStep;
              const isFutureStep = stepMode && i > currentStep;

              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <span style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.18)" }}>{i + 1}</span>

                  {inputMode === "select" ? (
                    <select
                      value={noteAnswers[i]}
                      disabled={stepMode && (i > currentStep || (!waitingInput && i === currentStep))}
                      onChange={e => setNote(i, e.target.value)}
                      style={{
                        width: "54px", padding: "7px 1px", borderRadius: "8px",
                        border: isCurrentStep && waitingInput ? "2px solid #E55039"
                          : res === null ? "1px solid rgba(255,255,255,0.12)"
                          : res ? "2px solid #00B894" : "2px solid #FF6B6B",
                        background: isFutureStep ? "rgba(255,255,255,0.02)"
                          : res === null ? "rgba(255,255,255,0.05)"
                          : res ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)",
                        color: isFutureStep ? "rgba(255,255,255,0.15)" : "#fff",
                        fontSize: "0.58rem", textAlign: "center", cursor: isFutureStep ? "not-allowed" : "pointer",
                        outline: "none", fontFamily: "inherit", opacity: isFutureStep ? 0.4 : 1,
                      }}>
                      <option value="">—</option>
                      {NOTE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  ) : (
                    <button
                      onClick={() => { if (!isFutureStep) startListening(i); }}
                      className={isListen ? "mic-pulse" : ""}
                      disabled={isFutureStep}
                      style={{
                        width: "54px", height: "40px", borderRadius: "8px", outline: "none",
                        border: isListen ? "2px solid #E55039"
                          : isCurrentStep && waitingInput ? "2px solid #E55039"
                          : res === null ? "1px solid rgba(255,255,255,0.12)"
                          : res ? "2px solid #00B894" : "2px solid #FF6B6B",
                        background: isListen ? "rgba(229,80,57,0.2)"
                          : isFutureStep ? "rgba(255,255,255,0.02)"
                          : res === null ? "rgba(255,255,255,0.05)"
                          : res ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)",
                        color: "#fff", fontFamily: "inherit", cursor: isFutureStep ? "not-allowed" : "pointer",
                        fontSize: noteAnswers[i] && !isListen ? "0.56rem" : "1rem",
                        fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: isFutureStep ? 0.3 : 1,
                      }}>
                      {isListen ? "🎙" : noteAnswers[i] ? noteAnswers[i] : "🎤"}
                    </button>
                  )}

                  {checked && res !== null && (
                    <span style={{ fontSize: "0.52rem", color: res ? "#00B894" : "#FF6B6B" }}>
                      {res ? "✓" : NOTE_MAP[currentDigits[i]].sol}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2 — Rakamlar */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "15px", marginBottom: "14px" }}>
          <div style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)", marginBottom: "12px" }}>ADIM 2 — Karşılık gelen rakamı yaz (0–9)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {Array.from({ length: 14 }, (_, i) => {
              const res = digitResults[i];
              const isFutureStep = stepMode && i > currentStep;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                  <span style={{ fontSize: "0.48rem", color: "rgba(255,255,255,0.18)" }}>{i + 1}</span>
                  <input type="text" maxLength={1} value={digitAnswers[i]}
                    disabled={isFutureStep}
                    onChange={e => setDigit(i, e.target.value.replace(/[^0-9]/g, ""))}
                    style={{
                      width: "38px", height: "40px", textAlign: "center", borderRadius: "8px",
                      border: res === null ? "1px solid rgba(255,255,255,0.12)" : res ? "2px solid #00B894" : "2px solid #FF6B6B",
                      background: isFutureStep ? "rgba(255,255,255,0.02)" : res === null ? "rgba(255,255,255,0.05)" : res ? "rgba(0,184,148,0.15)" : "rgba(255,107,107,0.15)",
                      color: "#fff", fontSize: "1.1rem", fontWeight: 700, outline: "none", fontFamily: "inherit",
                      opacity: isFutureStep ? 0.3 : 1, cursor: isFutureStep ? "not-allowed" : "text",
                    }} />
                  {checked && res !== null && (
                    <span style={{ fontSize: "0.52rem", color: res ? "#00B894" : "#FF6B6B" }}>
                      {res ? "✓" : currentDigits[i]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Check Button */}
        <button onClick={checkAnswers} style={{
          width: "100%", padding: "13px", borderRadius: "12px", border: "none",
          background: "linear-gradient(135deg,#00B894,#00CEC9)", color: "#fff",
          fontSize: "0.92rem", fontFamily: "inherit", fontWeight: 700,
          letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 24px rgba(0,184,148,0.25)",
        }}>✅ CEVAPLARI KONTROL ET</button>

        {/* Result */}
        {checked && (
          <div style={{
            marginTop: "14px", padding: "18px", borderRadius: "14px", textAlign: "center",
            background: totalCorrect === 28 ? "rgba(0,184,148,0.15)" : totalCorrect >= 20 ? "rgba(249,202,36,0.08)" : "rgba(255,107,107,0.1)",
            border: `1px solid ${totalCorrect === 28 ? "#00B894" : totalCorrect >= 20 ? "#F9CA24" : "#FF6B6B"}`,
          }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{totalCorrect === 28 ? "🎉" : totalCorrect >= 20 ? "👏" : "🎵"}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "5px" }}>{totalCorrect} / 28</div>
            <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.55)" }}>
              {totalCorrect === 28 ? "Mükemmel! Tüm cevaplar doğru!" : totalCorrect >= 20 ? "Çok iyi! Tekrar dene." : "Melodiyi tekrar dinle ve dene."}
            </div>
            <div style={{ marginTop: "8px", fontSize: "0.64rem", color: "rgba(255,255,255,0.3)" }}>
              Nota: {noteResults.filter(Boolean).length}/14 &nbsp;|&nbsp; Rakam: {digitResults.filter(Boolean).length}/14
            </div>
            <div style={{ marginTop: "11px", fontSize: "0.64rem", color: "rgba(255,255,255,0.4)" }}>
              π bölüm {groupIndex + 1}:{" "}
              {currentDigits.map((d, i) => <span key={i} style={{ color: NOTE_MAP[d].color, marginRight: "2px" }}>{d}</span>)}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "30px", fontSize: "0.55rem", color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em", textAlign: "center" }}>
        10 bölüm × 14 rakam = π'nin ilk 140 hanesi
      </div>
    </div>
  );
}
