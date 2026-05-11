const STORAGE_KEY = 'yoshi-introductory_progress';
let activeLevelIndex = 0;
let userSelection = ""; // For multiple choice

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    renderPuzzleMode();
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAnswer();
    });
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
    const ratio = (activeLevelIndex / totalLevels) * 100;
    document.getElementById('puzzle-progress-bar').style.width = ratio + '%';

    document.getElementById('puzzle-title').textContent = puzzle.title;
    
    // Typewriter effect handling
    const questionDiv = document.getElementById('puzzle-question');
    questionDiv.innerHTML = ''; // Clear
    let p = document.createElement('div');
    p.innerHTML = puzzle.questionText;
    questionDiv.appendChild(p);
    
    // Custom Animation Injects (e.g., chocolate)
    if(puzzle.id === 4) {
        const choc = document.createElement('div');
        choc.className = 'chocolate-break';
        questionDiv.appendChild(choc);
    }
    
    // Setup Interaction logic
    const inputContainer = document.querySelector('.input-container');
    const interactiveZone = document.getElementById('interactive-zone');
    
    // Reset values
    userSelection = "";
    interactiveZone.innerHTML = '';
    
    if (puzzle.type === 'choice') {
        // Multiple choice
        inputContainer.style.display = 'none';
        interactiveZone.style.display = 'flex';
        
        puzzle.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt;
            btn.onclick = () => {
                document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                userSelection = opt;
            };
            interactiveZone.appendChild(btn);
        });
        
    } else {
        // Text/Number input
        inputContainer.style.display = 'flex';
        interactiveZone.style.display = 'none';
        
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').disabled = false;
        document.getElementById('answer-input').focus();
    }
    
    document.getElementById('hint-text').style.display = 'none';
    document.getElementById('message-area').textContent = '';
    document.getElementById('next-btn-container').style.display = 'none';
    document.getElementById('action-btns').style.display = 'flex';
    
    document.getElementById('game-panel').classList.remove('success-glow');
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
    
    let userAnswer = "";
    if (puzzle.type === 'choice') {
        userAnswer = userSelection.toLowerCase();
        if (!userAnswer) {
            messageArea.textContent = '>> LÜTFEN BİR SEÇİM YAPIN!';
            messageArea.style.color = '#ff9800';
            return;
        }
    } else {
        userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    }
    
    const correctAnswer = puzzle.answer.toString().toLowerCase();

    if (userAnswer === correctAnswer) {
        playSound('success-sound');
        gamePanel.classList.add('success-glow');
        if(document.getElementById('answer-input')) document.getElementById('answer-input').disabled = true;
        
        // Lock choice buttons
        document.querySelectorAll('.choice-btn').forEach(b => {
             b.onclick = null;
             b.style.cursor = 'default';
        });

        messageArea.textContent = '>> DOĞRU CEVAP! KİLİT AÇILDI.';
        messageArea.style.color = '#4caf50';
        document.getElementById('next-btn-container').style.display = 'flex';
        document.getElementById('action-btns').style.display = 'none';
    } else {
        playSound('error-sound');
        gamePanel.classList.add('shake');
        setTimeout(() => gamePanel.classList.remove('shake'), 500);
        messageArea.textContent = '>> YANLIŞ CEVAP!';
        messageArea.style.color = '#f44336';
        
        if (puzzle.type !== 'choice') {
            document.getElementById('answer-input').value = '';
            document.getElementById('answer-input').focus();
        } else {
            userSelection = "";
            document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        }
    }
}

function nextPuzzle() {
    activeLevelIndex++;
    saveProgress();
    renderPuzzleMode();
}

function showGameCompleted() {
    document.getElementById('level-indicator').textContent = `// BÖLÜM BİTTİ //`;
    document.getElementById('puzzle-progress-bar').style.width = '100%';
    document.getElementById('puzzle-title').textContent = "TÜM BULMACALARI ÇÖZDÜNÜZ!";
    document.getElementById('puzzle-question').innerHTML = 'Harika! 1. Bölüm olan Introductory Puzzles serisini başarıyla tamamladınız. Oyun Merkezi sayfasına gidip diğer bölümlere başlayabilirsiniz.';
    
    document.querySelector('.input-container').style.display = 'none';
    document.getElementById('interactive-zone').style.display = 'none';
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
