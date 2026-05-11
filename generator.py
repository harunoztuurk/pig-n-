import os
import json

base_dir = r"c:\Users\harun\Desktop\pig-n--main\games"

chapters = [
    {"id": "yoshi-introductory", "name": "INTRODUCTORY PUZZLES", "desc": "Temel mantık ve sayısal bulmacalarla Yoshigahara'nın dünyasına giriş yapın."},
    {"id": "yoshi-matchstick", "name": "MATCHSTICK PUZZLES", "desc": "Kibrit çöpleriyle görsel uzamsal yeteneğinizi zorlayın."},
    {"id": "yoshi-maze", "name": "MAZE PUZZLES", "desc": "Karmaşık yollardan çıkış noktasını bulun."},
    {"id": "yoshi-algorithmic", "name": "ALGORITHMIC PUZZLES", "desc": "Mantık kapıları ve algoritmik düşünce testleri."},
    {"id": "yoshi-combinatorial", "name": "COMBINATORIAL PUZZLES", "desc": "Olasılıklar ve kombinasyonlarla uğraşın."},
    {"id": "yoshi-digital", "name": "DIGITAL PUZZLES", "desc": "Rakamların dans ettiği elektronik paneller."},
    {"id": "yoshi-number", "name": "NUMBER PUZZLES", "desc": "Matematik temelli sayı dizileri ve ilişkileri."},
    {"id": "yoshi-geometric", "name": "GEOMETRIC PUZZLES", "desc": "Şekillerin arasındaki gizli formülleri hesaplayın."},
    {"id": "yoshi-dissection", "name": "DISSECTION PUZZLES", "desc": "Şekilleri parçalama ve birleştirme üzerine zeka soruları."},
    {"id": "yoshi-other", "name": "OTHER PUZZLES", "desc": "Nobuyuki Yoshigahara'dan ilginç tasarımlar."}
]

html_template = """<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/global.css">
    <link rel="stylesheet" href="style.css">
    <script> window.si = window.si || function () {{ (window.siq = window.siq || []).push(arguments); }}; </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>
</head>
<body>
    <div class="scanline"></div>
    <div class="wrapper">
        <nav class="back-nav">
            <a href="../../index.html" class="btn back-btn" id="nav-back-btn">◂ ANA MENÜYE DÖN</a>
        </nav>
        <header class="header">
            <h1 class="title" id="main-title">{title}</h1>
            <div class="subtitle" id="level-indicator">// SEVİYE 1 //</div>
        </header>
        <div class="divider"></div>
        <main class="game-container">
            <div id="puzzle-view-screen" style="width: 100%;">
                <div class="section-label">[ BULMACA GÖSTERGESİ ]</div>
                <div class="game-content glass-panel" id="game-panel">
                    <h2 id="puzzle-title" class="puzzle-title">Yükleniyor...</h2>
                    <div class="progress-bar-container">
                        <div id="puzzle-progress-bar" class="progress-bar" style="width: 0%;"></div>
                    </div>
                    <div id="puzzle-question" class="puzzle-text">Lütfen bekleyin...</div>
                    <div id="puzzle-image-container" class="image-container" style="display: none;">
                        <img id="puzzle-image" src="" alt="Bulmaca Görseli">
                    </div>
                    <div class="input-container">
                        <input type="text" id="answer-input" placeholder="Cevabınızı girin..." autocomplete="off">
                    </div>
                    <div id="hint-text" class="hint-text" style="display: none;"></div>
                </div>
                <div class="message-area" id="message-area"></div>
                <div class="btn-row" style="margin-top:20px; gap: 15px;" id="action-btns">
                    <button class="btn check-btn" onclick="checkAnswer()">▸ CEVABI KONTROL ET</button>
                    <button class="btn hint-btn" onclick="showHint()">? İPUCU</button>
                </div>
                <div class="btn-row" style="margin-top:15px; display: none;" id="next-btn-container">
                    <button class="btn next-btn" onclick="nextPuzzle()">▸ SONRAKİ BULMACA</button>
                </div>
            </div>
        </main>
        <div class="divider"></div>
        <footer class="footer">
            <div class="copyright-wrap" style="flex-direction: column; align-items: center; gap: 8px;">
                <div class="copyright"><span class="tm">TM</span> <a href="#" target="_blank" class="author-link">Müfit ŞAN</a></div>
            </div>
        </footer>
    </div>
    <audio id="success-sound" src="https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"></audio>
    <audio id="error-sound" src="https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3"></audio>
    <script src="../../js/utils.js"></script>
    <script src="levels.js"></script>
    <script src="app.js"></script>
</body>
</html>"""

css_template = """/* Premium Glassmorphism Look (For Puzzle View) */
.glass-panel {
    background: rgba(20, 25, 35, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    border-radius: 12px;
    padding: 30px;
    margin: 20px 0;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
}

.puzzle-title {
    font-family: 'Orbitron', sans-serif;
    color: var(--cyan);
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.progress-bar-container {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
    margin-bottom: 25px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: var(--yellow, #ffeb3b);
    width: 0%;
    transition: width 0.4s ease;
}

.puzzle-text {
    font-family: 'Inter', sans-serif;
    color: #e0e0e0;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 25px;
}

.input-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

#answer-input {
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid var(--cyan);
    color: white;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.5rem;
    padding: 15px 20px;
    border-radius: 8px;
    width: 60%;
    text-align: center;
    transition: all 0.3s ease;
    outline: none;
}

#answer-input:focus {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    transform: scale(1.02);
}

.image-container img {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.hint-btn {
    background: transparent;
    border: 1px solid var(--orange, #ff9800);
    color: var(--orange, #ff9800);
}
.next-btn {
    background: var(--green, #4caf50);
    border: 1px solid #fff;
    color: white;
    width: 100%;
    animation: pulse 2s infinite;
}
.check-btn {
    width: 100%;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

.shake { animation: shake 0.5s; }
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
}

.success-glow {
    box-shadow: 0 0 30px rgba(76, 175, 80, 0.8) !important;
    border-color: #4caf50 !important;
}
.message-area {
    margin-top: 15px;
    height: 30px;
    text-align: center;
    font-family: 'Share Tech Mono', monospace;
    font-size: 1.2rem;
    font-weight: bold;
}
.hint-text {
    margin-top: 15px;
    color: var(--orange, #ff9800);
    font-size: 0.95rem;
    padding: 10px;
    border-left: 3px solid var(--orange, #ff9800);
    background: rgba(255, 152, 0, 0.1);
}
"""

app_js_template = """const STORAGE_KEY = '{game_id}_progress';
let activeLevelIndex = 0;

document.addEventListener('DOMContentLoaded', () => {{
    loadProgress();
    renderPuzzleMode();
    document.getElementById('answer-input').addEventListener('keypress', function(e) {{
        if (e.key === 'Enter') checkAnswer();
    }});
}});

function loadProgress() {{
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {{
        activeLevelIndex = parseInt(saved, 10);
    }}
}}

function saveProgress() {{
    localStorage.setItem(STORAGE_KEY, activeLevelIndex);
}}

function renderPuzzleMode() {{
    const totalLevels = levelsData.length;
    if (activeLevelIndex >= totalLevels) {{
        showGameCompleted();
        return;
    }}

    const puzzle = levelsData[activeLevelIndex];
    document.getElementById('level-indicator').textContent = `// SEVİYE ${{activeLevelIndex + 1}} / ${{totalLevels}} //`;
    const ratio = (activeLevelIndex / totalLevels) * 100;
    document.getElementById('puzzle-progress-bar').style.width = ratio + '%';

    document.getElementById('puzzle-title').textContent = puzzle.title;
    document.getElementById('puzzle-question').innerHTML = puzzle.questionText;
    
    const imgContainer = document.getElementById('puzzle-image-container');
    const imgElement = document.getElementById('puzzle-image');
    if (puzzle.image) {{
        imgElement.src = puzzle.image;
        imgContainer.style.display = 'block';
    }} else {{
        imgContainer.style.display = 'none';
    }}

    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').disabled = false;
    document.querySelector('.input-container').style.display = 'flex';
    document.getElementById('answer-input').focus();
    
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('message-area').textContent = '';
    document.getElementById('next-btn-container').style.display = 'none';
    document.getElementById('action-btns').style.display = 'flex';
    
    document.getElementById('game-panel').classList.remove('success-glow');
}}

function showHint() {{
    const puzzle = levelsData[activeLevelIndex];
    const hintText = document.getElementById('hint-text');
    hintText.textContent = puzzle.hint || "İpucu bulunmuyor.";
    hintText.style.display = 'block';
}}

function checkAnswer() {{
    if (activeLevelIndex >= levelsData.length) return;
    const puzzle = levelsData[activeLevelIndex];
    const inputElement = document.getElementById('answer-input');
    const userAnswer = inputElement.value.trim().toLowerCase();
    const correctAnswer = puzzle.answer.toString().toLowerCase();
    const gamePanel = document.getElementById('game-panel');
    const messageArea = document.getElementById('message-area');

    if (userAnswer === correctAnswer) {{
        playSound('success-sound');
        gamePanel.classList.add('success-glow');
        inputElement.disabled = true;
        messageArea.textContent = '>> DOĞRU CEVAP! KİLİT AÇILDI.';
        messageArea.style.color = '#4caf50';
        document.getElementById('next-btn-container').style.display = 'flex';
    }} else {{
        playSound('error-sound');
        gamePanel.classList.add('shake');
        setTimeout(() => gamePanel.classList.remove('shake'), 500);
        messageArea.textContent = '>> YANLIŞ CEVAP!';
        messageArea.style.color = '#f44336';
        inputElement.value = '';
        inputElement.focus();
    }}
}}

function nextPuzzle() {{
    activeLevelIndex++;
    saveProgress();
    renderPuzzleMode();
}}

function showGameCompleted() {{
    document.getElementById('level-indicator').textContent = `// OYUN BİTTİ //`;
    document.getElementById('puzzle-progress-bar').style.width = '100%';
    document.getElementById('puzzle-title').textContent = "TÜM BULMACALARI ÇÖZDÜNÜZ!";
    document.getElementById('puzzle-question').innerHTML = 'Harika! Ödülünüzü veya skora etkinizi Oyun Merkezi üzerinden görebilirsiniz.';
    
    document.getElementById('puzzle-image-container').style.display = 'none';
    document.querySelector('.input-container').style.display = 'none';
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('message-area').textContent = '';
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('next-btn-container').style.display = 'none';
}}

function playSound(id) {{
    const sound = document.getElementById(id);
    if (sound) {{
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio error', e));
    }}
}}
"""

levels_js_template = """const levelsData = [
    {{
        id: 1,
        title: "Test Bulmacası ({title})",
        questionText: "Bu {title} oyunu için bir örnektir. Cevap kutusuna '1' yazıp geçiniz.",
        image: null,
        answer: "1",
        type: "number",
        hint: "Gizli cevap her zaman 1'dir."
    }}
];
"""

for chap in chapters:
    chap_dir = os.path.join(base_dir, chap['id'])
    os.makedirs(chap_dir, exist_ok=True)
    
    # index.html
    with open(os.path.join(chap_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_template.format(title=chap['name']))
        
    # style.css
    with open(os.path.join(chap_dir, "style.css"), "w", encoding="utf-8") as f:
        f.write(css_template)
        
    # app.js
    with open(os.path.join(chap_dir, "app.js"), "w", encoding="utf-8") as f:
        f.write(app_js_template.format(game_id=chap['id']))
        
    # levels.js
    with open(os.path.join(chap_dir, "levels.js"), "w", encoding="utf-8") as f:
        f.write(levels_js_template.format(title=chap['name']))

print("10 Games Created Successfully.")
