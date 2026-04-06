const gameId = 'koordinat-kurtarma';

let currentTarget = { x: 0, y: 0 };
let currentSelected = null;
let currentLevelIndex = 0;

function initGame() {
    createGrid();
    loadLevel();
}

function createGrid() {
    const container = document.getElementById('gridContainer');
    // Temizle (eksenleri tutmak için sadece cell'leri sil)
    const existingCells = container.querySelectorAll('.grid-cell');
    existingCells.forEach(cell => cell.remove());

    // 11x11 Grid (-5 to +5)
    for (let y = 5; y >= -5; y--) { // Üst taraf pozitif Y, alt taraf negatif Y
        for (let x = -5; x <= 5; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'cell-info';
            tooltip.textContent = `[${x},${y}]`;
            cell.appendChild(tooltip);

            cell.addEventListener('click', () => selectCell(cell, x, y));
            container.appendChild(cell);
        }
    }
}

function loadLevel() {
    // Rastgele hedefler oluştur
    let randX = Math.floor(Math.random() * 11) - 5; // -5 to 5
    let randY = Math.floor(Math.random() * 11) - 5; // -5 to 5
    
    // Aynı yeri tekrar sormasın (0,0 vb)
    if (randX === 0 && randY === 0) randX = 2; 

    currentTarget = { x: randX, y: randY };
    document.getElementById('targetCoordinate').textContent = `[ X: ${randX} , Y: ${randY} ]`;
    document.getElementById('selectedDisplay').textContent = "Seçtiğin: [ -- , -- ]";
    document.getElementById('gameMessage').textContent = '';
    
    // Önceki seçimleri temizle
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(c => c.classList.remove('selected', 'correct', 'wrong'));
    currentSelected = null;
}

function selectCell(cellElement, x, y) {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(c => c.classList.remove('selected', 'correct', 'wrong'));
    
    cellElement.classList.add('selected');
    currentSelected = { x, y, element: cellElement };
    document.getElementById('selectedDisplay').textContent = `Seçtiğin: [ X:${x} , Y:${y} ]`;
}

window.checkGame = function() {
    if (!currentSelected) {
        let msg = document.getElementById('gameMessage');
        msg.textContent = 'Bir koordinat noktası seçmelisin!';
        msg.className = 'game-message error';
        return;
    }

    const isCorrect = (currentSelected.x === currentTarget.x && currentSelected.y === currentTarget.y);
    const msg = document.getElementById('gameMessage');

    if (isCorrect) {
        msg.textContent = 'KOORDİNAT DOĞRULANDI! ROTA HESAPLANDI.';
        msg.className = 'game-message success';
        currentSelected.element.classList.replace('selected', 'correct');
        
        if (typeof GameUtils !== 'undefined') {
            let currentScore = GameUtils.getScore(gameId);
            GameUtils.saveScore(gameId, currentScore + 100);
        }

        setTimeout(() => {
            currentLevelIndex++;
            loadLevel();
        }, 2000);
    } else {
        msg.textContent = `Hatalı! Gemi [${currentTarget.x}, ${currentTarget.y}] noktasındaydı.`;
        msg.className = 'game-message error';
        currentSelected.element.classList.replace('selected', 'wrong');
        
        // Doğru yeri bulup gösterelim (Kırmızı-yanıp sönme yapılırdı ama animasyon uzamasın) 
        setTimeout(() => loadLevel(), 2500);
    }
};

window.onload = initGame;
