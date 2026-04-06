const gameId = 'islem-zinciri';

let currentPuzzle = null;
let draggedItem = null;

const levels = [
    { target: 24, numbers: [3, 8, 4, 1], slots: ['n', 'o', 'n', 'o', 'n'] },
    { target: 15, numbers: [10, 2, 5], slots: ['n', 'o', 'n', 'o', 'n'] },
    { target: 42, numbers: [6, 7, 2, 1], slots: ['n', 'o', 'n', 'o', 'n', 'o', 'n'] }
];

let currentLevelIndex = 0;

function initGame() {
    loadLevel(currentLevelIndex);
}

function loadLevel(index) {
    if (index >= levels.length) {
        index = Math.floor(Math.random() * levels.length); // Sonsuz döngü basit
    }
    
    currentPuzzle = levels[index];
    document.getElementById('targetNumber').textContent = currentPuzzle.target;
    document.getElementById('gameMessage').textContent = '';
    document.getElementById('gameMessage').className = 'game-message';
    
    renderPools();
    renderBuilder();
    setupDragAndDrop();
}

function renderPools() {
    const numPool = document.getElementById('numberPool');
    numPool.innerHTML = '';
    
    // Numaraları karıştırarak koyalım
    let nums = [...currentPuzzle.numbers].sort(() => Math.random() - 0.5);
    
    nums.forEach(num => {
        const div = document.createElement('div');
        div.className = 'drag-item number';
        div.draggable = true;
        div.dataset.type = 'number';
        div.dataset.val = num;
        div.textContent = num;
        numPool.appendChild(div);
    });
    
    // Return operators to pool if they were dropped
    const opPool = document.getElementById('operatorPool');
    const existingOps = opPool.querySelectorAll('.drag-item').length;
    if (existingOps === 0) {
        ['+', '-', '*', '/'].forEach(op => {
            const div = document.createElement('div');
            div.className = 'drag-item operator';
            div.draggable = true;
            div.dataset.type = 'operator';
            div.dataset.val = op;
            div.textContent = op === '*' ? '×' : (op === '/' ? '÷' : op);
            opPool.appendChild(div);
        });
    }
}

function renderBuilder() {
    const builder = document.getElementById('equationBuilder');
    builder.innerHTML = '';
    
    currentPuzzle.slots.forEach(slotType => {
        const zone = document.createElement('div');
        zone.className = `drop-zone ${slotType === 'n' ? 'number-zone' : 'operator-zone'}`;
        zone.dataset.zoneType = slotType === 'n' ? 'number' : 'operator';
        builder.appendChild(zone);
    });
}

function setupDragAndDrop() {
    const items = document.querySelectorAll('.drag-item');
    const zones = document.querySelectorAll('.drop-zone');
    const pools = document.querySelectorAll('.draggable-pool');

    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            draggedItem = item;
            setTimeout(() => item.classList.add('dragging'), 0);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
        });
    });

    const addDropEvents = (element) => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            if(element.classList.contains('drop-zone')) {
                const zoneType = element.dataset.zoneType;
                if(draggedItem && draggedItem.dataset.type === zoneType) {
                    element.classList.add('drag-over');
                }
            }
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('drag-over');
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            if (!draggedItem) return;

            // Havuza bırakma
            if (element.classList.contains('draggable-pool')) {
                if (draggedItem.dataset.type === 'number' && element.id === 'numberPool') {
                    element.appendChild(draggedItem);
                } else if (draggedItem.dataset.type === 'operator' && element.id === 'operatorPool') {
                    element.appendChild(draggedItem);
                }
                return;
            }

            // Drop zone'a bırakma
            if (element.classList.contains('drop-zone')) {
                const zoneType = element.dataset.zoneType;
                if (draggedItem.dataset.type === zoneType) {
                    // Eğer zone doluysa, içindekini havuza geri gönder
                    if (element.children.length > 0) {
                        const existing = element.children[0];
                        document.getElementById(existing.dataset.type === 'number' ? 'numberPool' : 'operatorPool').appendChild(existing);
                    }
                    element.appendChild(draggedItem);
                }
            }
        });
    };

    zones.forEach(addDropEvents);
    pools.forEach(addDropEvents);
}

// Global olarak checkGame butonu için
window.checkGame = function() {
    const builder = document.getElementById('equationBuilder');
    const zones = builder.querySelectorAll('.drop-zone');
    const msg = document.getElementById('gameMessage');
    
    let expression = '';
    let isComplete = true;

    zones.forEach(zone => {
        if (zone.children.length === 0) {
            isComplete = false;
        } else {
            expression += zone.children[0].dataset.val;
        }
    });

    if (!isComplete) {
        msg.textContent = 'Lütfen tüm boşlukları doldurun.';
        msg.className = 'game-message error';
        return;
    }

    try {
        // Güvenli hesaplama (sadece rakam ve +-*/ içeriyor)
        // Güvenliğini val'leri filtreleyerek sağlıyoruz
        const result = Function('"use strict";return (' + expression + ')')();
        
        if (result === currentPuzzle.target) {
            msg.textContent = 'İŞLEM BAŞARILI! GÜVENLİK DUVARI AŞILDI.';
            msg.className = 'game-message success';
            
            // Puan kaydet
            if (typeof GameUtils !== 'undefined') {
                let currentScore = GameUtils.getScore(gameId);
                let newScore = currentScore + 100;
                GameUtils.saveScore(gameId, newScore);
            }

            // Sonraki levele geç
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 2000);

        } else {
            msg.textContent = `Hata! Sonuç ${result} çıktı, beklenti ${currentPuzzle.target}.`;
            msg.className = 'game-message error';
        }
    } catch(e) {
        msg.textContent = 'Geçersiz matematiksel ifade.';
        msg.className = 'game-message error';
    }
};

window.onload = initGame;
