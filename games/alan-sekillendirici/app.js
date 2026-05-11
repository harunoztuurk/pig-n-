const gameId = 'alan-sekillendirici';

let currentLevelIndex = 0;
const MAX_LEVELS = 50;
let currentLevel = null;

// Gelişmiş mod için kurallar
// 1. area: kaç birimkare çizilecek
// 2. reqConnected: şekil tek parça mı olmak zorunda
// 3. reqRect: tam bir dikdörtgen/kare mi olmak zorunda

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
        cell.dataset.index = i; // BFS vb formüller için
        
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

function generateLevel(index) {
    // index 0 ile 49 arası (Level 1 - 50)
    const levelNumber = index + 1;
    
    let targetArea = 0;
    let reqConnected = false;
    let reqRect = false;
    
    if (levelNumber <= 10) {
        // Seviye 1-10: Basit, 3 ile 20 arası alan. Bütünlük şartı yok.
        targetArea = Math.floor(Math.random() * 18) + 3; 
    } 
    else if (levelNumber <= 25) {
        // Seviye 11-25: 10 ile 30 arası alan, Tek parça olmak ZORUNDA.
        targetArea = Math.floor(Math.random() * 21) + 10;
        reqConnected = true;
    }
    else if (levelNumber <= 40) {
        // Seviye 26-40: Dikdörtgen/Kare kuralı. Çarpımı target veren alanlar (örn: 12, 15, 16, 20...)
        const rectAreas = [4, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 42, 50, 60, 64];
        targetArea = rectAreas[Math.floor(Math.random() * rectAreas.length)];
        reqConnected = true;
        reqRect = true;
    }
    else {
        // Seviye 41-50: Çok büyük dikdörtgenler veya çok spesifik tek parça hedefler
        const isRectLevel = Math.random() > 0.5;
        if (isRectLevel) {
            const hardRects = [48, 54, 60, 64, 70, 72, 80, 81, 90];
            targetArea = hardRects[Math.floor(Math.random() * hardRects.length)];
            reqConnected = true;
            reqRect = true;
        } else {
            // Sadece bağlantılı dev alanlar
            targetArea = Math.floor(Math.random() * 40) + 40; // 40-80 arası
            reqConnected = true;
        }
    }
    
    // Açıklama Metni Oluştur
    let desc = `Alanı ${targetArea} birimkare olan bir şekil çiz.`;
    if (reqRect) {
        desc = `Alanı ${targetArea} birimkare olan kusursuz bir DİKDÖRTGEN veya KARE çiz.`;
    } else if (reqConnected) {
        desc = `Alanı ${targetArea} birimkare olan, blokların birbirine temas ettiği TEK PARÇA bir şekil çiz.`;
    }

    return {
        targetArea: targetArea,
        reqConnected: reqConnected,
        reqRect: reqRect,
        desc: desc
    };
}

function loadLevel(index) {
    if(index >= MAX_LEVELS) {
        document.getElementById('areaTask').textContent = "TEBRİKLER! TÜM GÖREVLERİ TAMAMLADIN!";
        document.getElementById('levelCounter').textContent = "MAX";
        return;
    }
    
    currentLevel = generateLevel(index);
    document.getElementById('areaTask').textContent = currentLevel.desc;
    
    const counterEl = document.getElementById('levelCounter');
    if(counterEl) {
        counterEl.textContent = (index + 1);
    }
    
    clearCanvas();
}

function checkConnected(activeCells) {
    if (activeCells.length === 0) return false;
    
    const visited = new Set();
    const queue = [activeCells[0]];
    visited.add(activeCells[0]);
    
    const activeSet = new Set(activeCells);
    
    while(queue.length > 0) {
        const curr = queue.shift();
        
        // Komşuları bul (Sağ, Sol, Üst, Alt) % ve / operatörleri 10x10 için
        const row = Math.floor(curr / 10);
        const col = curr % 10;
        
        const neighbors = [];
        if (col > 0) neighbors.push(curr - 1); // Sol
        if (col < 9) neighbors.push(curr + 1); // Sağ
        if (row > 0) neighbors.push(curr - 10); // Üst
        if (row < 9) neighbors.push(curr + 10); // Alt
        
        neighbors.forEach(n => {
            if (activeSet.has(n) && !visited.has(n)) {
                visited.add(n);
                queue.push(n);
            }
        });
    }
    
    return visited.size === activeCells.length;
}

function checkRectangular(activeCells) {
    if (activeCells.length === 0) return false;
    
    let minR = 10, maxR = -1;
    let minC = 10, maxC = -1;
    
    activeCells.forEach(curr => {
        const row = Math.floor(curr / 10);
        const col = curr % 10;
        
        if (row < minR) minR = row;
        if (row > maxR) maxR = row;
        if (col < minC) minC = col;
        if (col > maxC) maxC = col;
    });
    
    const width = (maxC - minC) + 1;
    const height = (maxR - minR) + 1;
    
    // Dikdörtgen içindeki tüm alanın activeCells sayısına eşit olması gerekir
    if ((width * height) === activeCells.length) {
        return true;
    }
    
    return false;
}

window.checkGame = function() {
    const msg = document.getElementById('gameMessage');
    
    if (paintedCount === 0) {
        msg.textContent = 'Henüz hiçbir alanı boyamadın!';
        msg.className = 'game-message error';
        return;
    }

    if (paintedCount !== currentLevel.targetArea) {
        msg.textContent = `Hata! Şeklin alanı ${paintedCount} br². Hedef ${currentLevel.targetArea} br² olmalıydı.`;
        msg.className = 'game-message error';
        return;
    }
    
    // Aktif hücreleri al
    const cells = document.querySelectorAll('.draw-cell');
    const activeIndices = [];
    cells.forEach(c => {
        if(c.classList.contains('active')) {
            activeIndices.push(parseInt(c.dataset.index));
        }
    });

    // 1. Ek Kural Kontrolü: TEK PARÇA (Connected)
    if (currentLevel.reqConnected) {
        const isConnected = checkConnected(activeIndices);
        if (!isConnected) {
            msg.textContent = 'Hata! Şeklin tek parça (bütünleşik) olmak zorunda.';
            msg.className = 'game-message error';
            return;
        }
    }
    
    // 2. Ek Kural Kontrolü: DİKDÖRTGEN (Rectangular)
    if (currentLevel.reqRect) {
        const isRect = checkRectangular(activeIndices);
        if (!isRect) {
            msg.textContent = 'Hata! Çizdiğin şekil kusursuz bir dikdörtgen veya kare değil.';
            msg.className = 'game-message error';
            return;
        }
    }

    // Her şey doğru
    msg.textContent = 'MÜKEMMEL! ALAN VE ŞEKİL ONAYLANDI.';
    msg.className = 'game-message success';
    
    if (typeof GameUtils !== 'undefined') {
        let currentScore = GameUtils.getScore(gameId);
        GameUtils.saveScore(gameId, currentScore + 100);
    }

    setTimeout(() => {
        currentLevelIndex++;
        loadLevel(currentLevelIndex);
    }, 2000);
};

window.onload = initGame;

