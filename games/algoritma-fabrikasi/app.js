const gameId = 'algoritma-fabrikasi';

let draggedItem = null;

const levels = [
    { input: 5, target: 13, funcs: [{op:'*', val:2, display:'× 2'}, {op:'+', val:3, display:'+ 3'}, {op:'-', val:1, display:'- 1'}] }, // (5 * 2) + 3 = 13 (veya -1 kullanmayabilir vs, ama tam 3 slot var, (5+3)*2 -1 != 13, 5*2+3=13)
    // Sadece hepsini doğru sıra ile kullanmalı.
    // L1: Kural (5 * 2) = 10, 10 + 3 = 13
    { 
        input: 10, target: 9, 
        slots: 3,
        funcs: [
            {op:'/', val:2, display:'÷ 2'}, 
            {op:'+', val:4, display:'+ 4'},
            {op:'*', val:1, display:'× 1'} // (10 / 2) + 4 = 9, 9 * 1 = 9
        ]
    },
    { 
        input: 3, target: 14, 
        slots: 3,
        funcs: [
            {op:'+', val:4, display:'+ 4'}, 
            {op:'*', val:2, display:'× 2'},
            {op:'-', val:0, display:'- 0'} 
        ] // (3 + 4)*2 = 14
    }
];

let currentLevelIndex = 0;
let currentPuzzle = null;

function initGame() {
    loadLevel(currentLevelIndex);
}

function loadLevel(index) {
    if (index >= levels.length) {
        index = Math.floor(Math.random() * levels.length);
    }
    currentPuzzle = levels[index];
    
    document.getElementById('inputVal').textContent = currentPuzzle.input;
    document.getElementById('targetVal').textContent = currentPuzzle.target;
    document.getElementById('gameMessage').textContent = '';
    
    renderLine();
    renderPool();
    setupDragAndDrop();
}

function renderLine() {
    const line = document.getElementById('machineLine');
    line.innerHTML = '';
    // Genelde 3 slot üzerinden gidiyoruz.
    const slots = currentPuzzle.slots || 3;
    for(let i=0; i<slots; i++) {
        const div = document.createElement('div');
        div.className = 'machine-slot drop-zone';
        div.dataset.index = i;
        line.appendChild(div);
    }
}

function renderPool() {
    const pool = document.getElementById('functionPool');
    pool.innerHTML = '';
    
    let funcs = [...currentPuzzle.funcs].sort(() => Math.random() - 0.5);
    
    funcs.forEach((f, i) => {
        const div = document.createElement('div');
        div.className = 'drag-item';
        div.draggable = true;
        div.dataset.id = i;
        div.dataset.op = f.op;
        div.dataset.val = f.val;
        div.textContent = f.display;
        pool.appendChild(div);
    });
}

function setupDragAndDrop() {
    const items = document.querySelectorAll('.drag-item');
    const zones = document.querySelectorAll('.drop-zone');
    const pool = document.getElementById('functionPool');

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
            if(element.classList.contains('drop-zone') || element.id === 'functionPool') {
                element.classList.add('drag-over');
            }
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('drag-over');
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('drag-over');
            
            if (!draggedItem) return;

            if (element.id === 'functionPool') {
                element.appendChild(draggedItem);
            } else if (element.classList.contains('drop-zone')) {
                // Eğer doluysa eskisini havuza yolla
                if (element.children.length > 0) {
                    pool.appendChild(element.children[0]);
                }
                element.appendChild(draggedItem);
            }
        });
    };

    zones.forEach(addDropEvents);
    addDropEvents(pool);
}

window.checkGame = function() {
    const slots = document.querySelectorAll('.machine-slot');
    const msg = document.getElementById('gameMessage');
    
    let currentVal = currentPuzzle.input;
    let isComplete = true;

    slots.forEach(slot => {
        if (slot.children.length === 0) {
            isComplete = false;
        }
    });

    if (!isComplete) {
        msg.textContent = 'Lütfen tüm makine slotlarını doldurun!';
        msg.className = 'game-message error';
        return;
    }

    // Sırayla uygula
    slots.forEach(slot => {
        const item = slot.children[0];
        const op = item.dataset.op;
        const val = parseFloat(item.dataset.val);
        
        if (op === '+') currentVal += val;
        if (op === '-') currentVal -= val;
        if (op === '*') currentVal *= val;
        if (op === '/') currentVal /= val;
    });

    if (currentVal === currentPuzzle.target) {
        msg.textContent = 'ALGORİTMA DOĞRU! ÇIKTI ELDE EDİLDİ.';
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
        msg.textContent = `Hata! Üretilen çıktı: ${currentVal}. Hedefilen: ${currentPuzzle.target}`;
        msg.className = 'game-message error';
    }
};

window.onload = initGame;
