const gameId = 'denge-terazisi';

let draggedItem = null;
let leftTotal = 0;
let rightTotal = 0;

// Levels with target side (left) and available pieces (right pool)
const levels = [
    { 
        task: "Sol kefedeki 1.5 birimini dengele",
        targetVal: 1.5, 
        targetDisplay: "1.5", 
        pool: [
            { display: "0.5", val: 0.5, type: 'decimal' },
            { display: "1", val: 1.0, type: 'decimal' },
            { display: "1/2", val: 0.5, type: 'fraction' },
            { display: "1/4", val: 0.25, type: 'fraction' },
            { display: "1/4", val: 0.25, type: 'fraction' }
        ]
    },
    { 
        task: "Sol kefede 3/4 bulunuyor, dengeyi sağla",
        targetVal: 0.75, 
        targetDisplay: "3/4", 
        pool: [
            { display: "1/2", val: 0.5, type: 'fraction' },
            { display: "1/4", val: 0.25, type: 'fraction' },
            { display: "0.25", val: 0.25, type: 'decimal' },
            { display: "0.1", val: 0.1, type: 'decimal' }
        ]
    },
    {
        task: "Pi'nin yaklaşımı olan ~3'ü oluştur",
        targetVal: 3.0,
        targetDisplay: "π ≈ 3",
        pool: [
            { display: "1", val: 1.0, type: 'decimal'},
            { display: "1", val: 1.0, type: 'decimal'},
            { display: "0.5", val: 0.5, type: 'decimal'},
            { display: "1/2", val: 0.5, type: 'fraction'},
            { display: "1/4", val: 0.25, type: 'fraction'}
        ]
    }
];

let currentLevelIndex = 0;

function initGame() {
    loadLevel(currentLevelIndex);
}

function loadLevel(index) {
    if (index >= levels.length) {
        index = Math.floor(Math.random() * levels.length);
    }
    
    const level = levels[index];
    document.getElementById('gameTask').textContent = level.task;
    document.getElementById('gameMessage').textContent = '';
    
    leftTotal = level.targetVal;
    rightTotal = 0;
    
    // Sol kefeyi oluştur
    const leftTray = document.getElementById('leftTray');
    leftTray.innerHTML = `<div class="weight-item" style="cursor:default; background:var(--pink);">${level.targetDisplay}</div>`;
    
    // Sağ kefeyi temizle
    document.getElementById('rightTray').innerHTML = '';
    
    // Ağırlık havuzunu diz
    const pool = document.getElementById('weightPool');
    pool.innerHTML = '';
    
    level.pool.forEach(w => {
        const div = document.createElement('div');
        div.className = `weight-item drag-item ${w.type}`;
        div.draggable = true;
        div.dataset.val = w.val;
        div.textContent = w.display;
        pool.appendChild(div);
    });

    updateScale();
    setupDragAndDrop();
}

function updateScale() {
    // Toplam ağırlıkları kefelerden oku (sağ kefe interaktif)
    const rightTray = document.getElementById('rightTray');
    rightTotal = 0;
    
    Array.from(rightTray.children).forEach(child => {
        rightTotal += parseFloat(child.dataset.val);
    });

    const diff = leftTotal - rightTotal;
    
    // Maksimum rotasyon açısı
    const maxAngle = 20;
    let angle = diff * 15; // Çarpan
    
    // Sınırlandırma
    if (angle > maxAngle) angle = maxAngle;
    if (angle < -maxAngle) angle = -maxAngle;
    
    const beam = document.getElementById('scaleBeam');
    
    // Açı: pozitifse sol ağır bastı (saat yönünün tersi = -deg mantıken, ama CSS'te rotate+ saat yönüdür)
    // Left heavy -> left side drops -> rotate counter-clockwise (-)
    // Diff > 0 means left is heavier.
    
    beam.style.transform = `rotate(${-angle}deg)`;
    
    // Kefelerin dik durması için ters açı
    const pans = document.querySelectorAll('.scale-pan');
    pans.forEach(pan => {
        // Sepetin yere dik durması için beam'in açısının tersini alır
        pan.style.transform = `rotate(${angle}deg)`;
    });
}

function setupDragAndDrop() {
    const items = document.querySelectorAll('.drag-item');
    const rightTray = document.getElementById('rightTray');
    const pool = document.getElementById('weightPool');

    items.forEach(item => {
        item.addEventListener('dragstart', () => {
            draggedItem = item;
            setTimeout(() => item.classList.add('dragging'), 0);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
            updateScale();
        });
    });

    [rightTray, pool].forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            if(zone.id === 'rightTray') zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            if(draggedItem) {
                zone.appendChild(draggedItem);
                updateScale();
            }
        });
    });
}

window.checkGame = function() {
    // updateScale() zaten değerleri hesaplar ancak son bir kontrol yapalım
    updateScale();
    const msg = document.getElementById('gameMessage');
    
    // Float sayıların toplanmasındaki küsurat hataları için yuvarlayarak karşılaştırma
    if (Math.abs(leftTotal - rightTotal) < 0.001) {
        msg.textContent = 'MÜKEMMEL DENGE! SİSTEM DOĞRULANDI.';
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
        msg.textContent = 'Terazi henüz dengede değil!';
        msg.className = 'game-message error';
    }
};

window.onload = initGame;
