// lazer-optik/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('levelCounter');
const equationDisplay = document.getElementById('equationDisplay');
const gameMessage = document.getElementById('gameMessage');
const fireBtn = document.getElementById('fireBtn');
const clearBtn = document.getElementById('clearBtn');
const canvasWrapper = document.getElementById('canvasWrapper');

const GAME_ID = 'lazer-optik';
const MAX_LEVEL = 50;

let currentLevel = 1;
let gridSize = 10;
let cellSize = 50;

// Oyun Elemanları
let mirrors = []; // { col, row, type: 'forward' (/) or 'backward' (\) }
let laserStart = { col: 0, row: 0, dirX: 1, dirY: 0 };
let target = { col: 9, row: 9 };
let laserPath = [];
let isFiring = false;

// Sürükle-Bırak State
let draggedType = null;
let highlightCell = document.createElement('div');
highlightCell.className = 'grid-cell-highlight';
canvasWrapper.appendChild(highlightCell);

function initGame() {
    currentLevel = 1; // Başlangıç seviyesi
    setupDragAndDrop();
    setupButtons();
    loadLevel();
    draw();
}

function generateLevelConfig(level) {
    // Rastgele bir bulmaca oluştur
    // Lazer kenarda başlasın
    let startCol = 0;
    let startRow = Math.floor(Math.random() * 10);
    let dirX = 1;
    let dirY = 0;
    
    // Hedef farklı bir kenarda olsun
    let targetCol = Math.floor(Math.random() * 8) + 2;
    let targetRow = Math.floor(Math.random() * 10);
    while (startRow === targetRow) {
        targetRow = Math.floor(Math.random() * 10);
    }

    return {
        start: { col: startCol, row: startRow, dirX: dirX, dirY: dirY },
        target: { col: targetCol, row: targetRow }
    };
}

function loadLevel() {
    let config = generateLevelConfig(currentLevel);
    laserStart = config.start;
    target = config.target;
    mirrors = [];
    laserPath = [];
    isFiring = false;
    
    levelCounter.textContent = currentLevel;
    gameMessage.textContent = '';
    equationDisplay.textContent = 'Bekleniyor...';
    
    draw();
}

function setupButtons() {
    fireBtn.addEventListener('click', fireLaser);
    clearBtn.addEventListener('click', () => {
        if (!isFiring) {
            mirrors = [];
            laserPath = [];
            equationDisplay.textContent = 'Bekleniyor...';
            gameMessage.textContent = '';
            draw();
        }
    });
}

function setupDragAndDrop() {
    const mirrorItems = document.querySelectorAll('.mirror-item');
    
    mirrorItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedType = e.target.getAttribute('data-type');
            e.dataTransfer.setData('text/plain', draggedType);
        });
    });

    canvasWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        const rect = canvasWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        
        if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
            highlightCell.style.display = 'block';
            highlightCell.style.left = `${col * cellSize}px`;
            highlightCell.style.top = `${row * cellSize}px`;
        }
    });

    canvasWrapper.addEventListener('dragleave', () => {
        highlightCell.style.display = 'none';
    });

    canvasWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        highlightCell.style.display = 'none';
        if (isFiring) return; // Ateşlenmişse ayna eklenemez
        
        const type = e.dataTransfer.getData('text/plain');
        if (!type) return;

        const rect = canvasWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        
        // Başlangıç veya Hedef hücresine ayna konulamaz
        if ((col === laserStart.col && row === laserStart.row) || 
            (col === target.col && row === target.row)) {
            return;
        }

        // Varsa aynı hücredeki eski aynayı sil
        mirrors = mirrors.filter(m => !(m.col === col && m.row === row));
        
        // Yeni ayna ekle
        mirrors.push({ col, row, type });
        
        // Yolu sıfırla
        laserPath = [];
        equationDisplay.textContent = 'Bekleniyor...';
        gameMessage.textContent = '';
        draw();
    });
}

function fireLaser() {
    if (isFiring) return;
    isFiring = true;
    gameMessage.textContent = '';
    
    laserPath = [];
    let current = { 
        col: laserStart.col, 
        row: laserStart.row, 
        dirX: laserStart.dirX, 
        dirY: laserStart.dirY 
    };
    
    laserPath.push({ ...current });
    
    let maxSteps = 100;
    let step = 0;
    
    let simInterval = setInterval(() => {
        let nextCol = current.col + current.dirX;
        let nextRow = current.row + current.dirY;
        
        // Sınır dışına çıktı mı?
        if (nextCol < 0 || nextCol >= gridSize || nextRow < 0 || nextRow >= gridSize) {
            clearInterval(simInterval);
            finishFire(false);
            return;
        }
        
        current.col = nextCol;
        current.row = nextRow;
        
        // Hedefe ulaştı mı?
        if (current.col === target.col && current.row === target.row) {
            laserPath.push({ ...current });
            clearInterval(simInterval);
            finishFire(true);
            return;
        }
        
        // Aynaya çarptı mı?
        let mirror = mirrors.find(m => m.col === current.col && m.row === current.row);
        if (mirror) {
            let oldDirX = current.dirX;
            let oldDirY = current.dirY;
            
            // Dönüşüm Matrisleri
            if (mirror.type === 'forward') {
                // '/' aynası: (v_x, v_y) -> (-v_y, -v_x)
                current.dirX = -oldDirY;
                current.dirY = -oldDirX;
                equationDisplay.textContent = `(v'x, v'y) = (-vy, -vx)`;
            } else if (mirror.type === 'backward') {
                // '\' aynası: (v_x, v_y) -> (v_y, v_x)
                current.dirX = oldDirY;
                current.dirY = oldDirX;
                equationDisplay.textContent = `(v'x, v'y) = (vy, vx)`;
            }
            GameUtils.playSound('click');
        }
        
        laserPath.push({ ...current });
        draw();
        
        step++;
        if (step > maxSteps) { // Sonsuz döngü koruması
            clearInterval(simInterval);
            finishFire(false);
        }
    }, 100); // 100ms gecikmeli animasyon
}

function finishFire(isWin) {
    draw(); // Son durumu çiz
    if (isWin) {
        GameUtils.playSound('success');
        gameMessage.innerHTML = `<span style="color:var(--cyan);">HEDEF VURULDU!</span>`;
        if (typeof GameUtils !== 'undefined') {
            let currentScore = GameUtils.getScore(GAME_ID);
            GameUtils.saveScore(GAME_ID, currentScore + 100);
        }
        setTimeout(() => {
            if (currentLevel < MAX_LEVEL) {
                currentLevel++;
                loadLevel();
            } else {
                gameMessage.innerHTML = `<span style="color:var(--yellow);">TÜM SEVİYELER TAMAMLANDI!</span>`;
            }
        }, 2000);
    } else {
        GameUtils.playSound('error');
        gameMessage.innerHTML = `<span style="color:var(--pink);">BAŞARISIZ!</span> Işın kayboldu.`;
        isFiring = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Coordinate Axes (Merkezde)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(250, 0); ctx.lineTo(250, 500); // Y axis
    ctx.moveTo(0, 250); ctx.lineTo(500, 250); // X axis
    ctx.stroke();

    // Draw Target
    let tx = target.col * cellSize + cellSize/2;
    let ty = target.row * cellSize + cellSize/2;
    ctx.fillStyle = 'var(--cyan)';
    ctx.beginPath();
    ctx.arc(tx, ty, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw Laser Start Source
    let sx = laserStart.col * cellSize + cellSize/2;
    let sy = laserStart.row * cellSize + cellSize/2;
    ctx.fillStyle = 'var(--yellow)';
    ctx.fillRect(sx - 15, sy - 15, 30, 30);
    // Yön oku
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + laserStart.dirX * 20, sy + laserStart.dirY * 20);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Mirrors
    mirrors.forEach(m => {
        let mx = m.col * cellSize;
        let my = m.row * cellSize;
        ctx.strokeStyle = 'var(--pink)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (m.type === 'forward') {
            // '/' bottom-left to top-right
            ctx.moveTo(mx + 10, my + 40);
            ctx.lineTo(mx + 40, my + 10);
        } else {
            // '\' top-left to bottom-right
            ctx.moveTo(mx + 10, my + 10);
            ctx.lineTo(mx + 40, my + 40);
        }
        ctx.stroke();
    });

    // Draw Laser Path
    if (laserPath.length > 0) {
        ctx.strokeStyle = 'var(--yellow)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'var(--yellow)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        
        let first = laserPath[0];
        ctx.moveTo(first.col * cellSize + cellSize/2, first.row * cellSize + cellSize/2);
        
        for (let i = 1; i < laserPath.length; i++) {
            let p = laserPath[i];
            ctx.lineTo(p.col * cellSize + cellSize/2, p.row * cellSize + cellSize/2);
        }
        ctx.stroke();
        
        ctx.shadowBlur = 0; // Reset shadow
    }
}

window.onload = initGame;
