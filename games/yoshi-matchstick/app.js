const STORAGE_KEY = 'yoshi-matchstick_progress';
let activeLevelIndex = 0;

let currentMatches = new Set();
let selectedMatchId = null;
let movesMade = 0;
let initialMatchBackup = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderPuzzleMode();
});

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
        activeLevelIndex = parseInt(saved, 10);
    }
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, activeLevelIndex);
}

function renderPuzzleMode() {
    const totalLevels = levelsData.length;
    if (activeLevelIndex >= totalLevels) {
        showGameCompleted();
        return;
    }

    const puzzle = levelsData[activeLevelIndex];
    document.getElementById('level-indicator').textContent = `// BÖLÜM ${activeLevelIndex + 1} / ${totalLevels} //`;
    document.getElementById('puzzle-title').textContent = puzzle.title;
    document.getElementById('puzzle-question').innerHTML = puzzle.questionText;
    
    // Load board
    resetBoardData(puzzle);
    buildBoardView(puzzle);
    updateGameUI();
    
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('message-area').textContent = '';
    document.getElementById('next-btn-container').style.display = 'none';
    document.getElementById('action-btns').style.display = 'flex';
    document.getElementById('game-panel').classList.remove('success-glow');
}

function resetBoardData(puzzle) {
    currentMatches = new Set(puzzle.initialMatches);
    initialMatchBackup = [...puzzle.initialMatches];
    selectedMatchId = null;
    movesMade = 0;
}

function resetBoardView() {
    const puzzle = levelsData[activeLevelIndex];
    resetBoardData(puzzle);
    buildBoardView(puzzle);
    updateGameUI();
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = '>> TAHTA SIFIRLANDI.';
    messageArea.style.color = '#ffeb3b';
}

function buildBoardView(puzzle) {
    const board = document.getElementById('matchstick-board');
    board.style.width = puzzle.boardWidth + 'px';
    board.style.height = puzzle.boardHeight + 'px';
    board.innerHTML = '';
    
    puzzle.slots.forEach(slot => {
        const el = document.createElement('div');
        el.className = `slot type-${slot.type}`;
        
        // Positioning
        el.style.left = slot.x + 'px';
        el.style.top = slot.y + 'px';
        
        // State
        if (currentMatches.has(slot.id)) {
            el.classList.add('filled');
            if (selectedMatchId === slot.id) el.classList.add('selected');
        } else {
            el.classList.add('empty');
        }
        
        // Interaction
        el.onclick = () => handleSlotClick(slot.id, el);
        
        board.appendChild(el);
    });
}

function handleSlotClick(slotId, el) {
    const puzzle = levelsData[activeLevelIndex];
    
    // Zaten başarıldıysa tıklanmasın
    if (document.getElementById('next-btn-container').style.display === 'flex') return;

    if (currentMatches.has(slotId)) {
        // Tıklanan yer DOLU KİBRİT ise -> Seçimi değiştir
        if (selectedMatchId === slotId) {
            // Seçimi iptal et
            selectedMatchId = null;
            buildBoardView(puzzle);
        } else {
            // Seç
            selectedMatchId = slotId;
            buildBoardView(puzzle);
            playSound('success-sound'); // just a click sound
        }
    } else {
        // Tıklanan yer BOŞ ise -> Eğer elimizde seçili kibrit varsa oraya taşı
        if (selectedMatchId !== null) {
            if (movesMade < puzzle.maxMoves) {
                // Taşıma işlemi
                currentMatches.delete(selectedMatchId);
                currentMatches.add(slotId);
                selectedMatchId = null;
                movesMade++;
                
                buildBoardView(puzzle);
                updateGameUI();
                playSound('success-sound');
            } else {
                // Hamle yetersiz
                const messageArea = document.getElementById('message-area');
                messageArea.textContent = `HATA: Sadece ${puzzle.maxMoves} hareket yapabilirsiniz! Sıfırlayın.`;
                messageArea.style.color = '#f44336';
                playSound('error-sound');
            }
        }
    }
}

function updateGameUI() {
    const puzzle = levelsData[activeLevelIndex];
    const ind = document.getElementById('moves-indicator');
    ind.textContent = `KALAN HAMLE: ${puzzle.maxMoves - movesMade}`;
}

function showHint() {
    const puzzle = levelsData[activeLevelIndex];
    const hintText = document.getElementById('hint-text');
    hintText.textContent = puzzle.hint || "İpucu bulunmuyor.";
    hintText.style.display = 'block';
}

function checkAnswer() {
    if (activeLevelIndex >= levelsData.length) return;
    const puzzle = levelsData[activeLevelIndex];
    const gamePanel = document.getElementById('game-panel');
    const messageArea = document.getElementById('message-area');
    
    // Çözüm kontrolü:
    // Öğrenci tam olarak targetMatches'teki slotlarda mı kibritlere sahip?
    // Not: Bu engine için exact positions kullandık, dolayısıyla diziyi sıralayıp kontrol edeceğiz.
    
    const currentArr = Array.from(currentMatches).sort();
    const targetArr = [...puzzle.targetMatches].sort();
    
    let isCorrect = (currentArr.length === targetArr.length) && currentArr.every((val, index) => val === targetArr[index]);

    if (isCorrect) {
        playSound('success-sound');
        gamePanel.classList.add('success-glow');
        
        messageArea.textContent = '>> DOĞRU CEVAP! KİLİT AÇILDI.';
        messageArea.style.color = '#4caf50';
        document.getElementById('next-btn-container').style.display = 'flex';
        document.getElementById('action-btns').style.display = 'none';
        
        // Remove selection highlights
        selectedMatchId = null;
        buildBoardView(puzzle);
    } else {
        playSound('error-sound');
        setTimeout(() => gamePanel.classList.remove('shake'), 500);
        gamePanel.classList.add('shake');
        
        messageArea.textContent = '>> ŞEKİL EŞLEŞMİYOR VEYA HAMLE BİTMEDİ!';
        messageArea.style.color = '#f44336';
    }
}

function nextPuzzle() {
    activeLevelIndex++;
    saveProgress();
    renderPuzzleMode();
}

function showGameCompleted() {
    document.getElementById('level-indicator').textContent = `// BÖLÜM BİTTİ //`;
    document.getElementById('puzzle-title').textContent = "MATCHSTICK TÜM BULMACALAR ÇÖZÜLDÜ!";
    document.getElementById('puzzle-question').innerHTML = 'Kibrit çöplerine harika asıldınız! Diğer oyunlara geçebilirsiniz.';
    
    document.getElementById('matchstick-board-container').style.display = 'none';
    document.getElementById('moves-indicator').style.display = 'none';
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('message-area').textContent = '';
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('next-btn-container').style.display = 'none';
}

function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio error', e));
    }
}
