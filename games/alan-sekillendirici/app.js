const gameId = 'alan-sekillendirici';

const levels = [
    { targetArea: 16, desc: "Alanı 16 birimkare olan bir şekil çiz." },
    { targetArea: 25, desc: "Alanı 25 birimkare olan büyük bir kare veya dikdörtgen çiz." },
    { targetArea: 10, desc: "Tam olarak 10 birimkare büyüklüğünde bir alan seç." },
    { targetArea: 36, desc: "Alanı 36 birimkare olan bir şekil işaretle." }
];

let currentLevelIndex = 0;
let currentTarget = 0;
let paintedCount = 0;
let isDrawingPhase = false;

function initGame() {
    createGrid();
    loadLevel(currentLevelIndex);
}

function createGrid() {
    const grid = document.getElementById('drawingGrid');
    grid.innerHTML = '';
    
    // 10x10
    for(let i=0; i<100; i++) {
        const cell = document.createElement('div');
        cell.className = 'draw-cell';
        
        // Tıklama ile boyama / silme
        cell.addEventListener('mousedown', () => {
            isDrawingPhase = true;
            toggleCell(cell);
        });
        
        // Sürükleyerek boyama desteği
        cell.addEventListener('mouseenter', () => {
            if(isDrawingPhase) toggleCell(cell);
        });

        grid.appendChild(cell);
    }
    
    // Fareyi bırakınca çizmeyi / silmeyi durdur
    document.addEventListener('mouseup', () => {
        isDrawingPhase = false;
    });
}

function toggleCell(cell) {
    if (cell.classList.contains('active')) {
        cell.classList.remove('active');
        paintedCount--;
    } else {
        cell.classList.add('active');
        paintedCount++;
    }
    document.getElementById('currentArea').textContent = paintedCount;
}

window.clearCanvas = function() {
    const cells = document.querySelectorAll('.draw-cell');
    cells.forEach(c => c.classList.remove('active'));
    paintedCount = 0;
    document.getElementById('currentArea').textContent = paintedCount;
    document.getElementById('gameMessage').textContent = '';
};

function loadLevel(index) {
    if(index >= levels.length) {
        index = Math.floor(Math.random() * levels.length);
    }
    
    currentTarget = levels[index].targetArea;
    document.getElementById('areaTask').textContent = levels[index].desc;
    clearCanvas();
}

window.checkGame = function() {
    const msg = document.getElementById('gameMessage');
    
    if (paintedCount === 0) {
        msg.textContent = 'Henüz hiçbir alanı boyamadın!';
        msg.className = 'game-message error';
        return;
    }

    if (paintedCount === currentTarget) {
        msg.textContent = 'HESAPLAMA DOĞRU! ALAN ONAYLANDI.';
        msg.className = 'game-message success';
        
        if (typeof GameUtils !== 'undefined') {
            let currentScore = GameUtils.getScore(gameId);
            GameUtils.saveScore(gameId, currentScore + 100);
        }

        setTimeout(() => {
            currentLevelIndex++;
            loadLevel(currentLevelIndex);
        }, 2000);
    } else {
        msg.textContent = `Hata! Şeklin alanı ${paintedCount} birimkare. Hedef ${currentTarget} birimkareydi.`;
        msg.className = 'game-message error';
    }
};

window.onload = initGame;
