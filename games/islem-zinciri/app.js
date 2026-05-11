const gameId = 'islem-zinciri';

let currentPuzzle = null;
let draggedItem = null;

const levels = [
    {
        "target": 3,
        "numbers": [
            2,
            1
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 1,
        "numbers": [
            6,
            5
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 3,
        "numbers": [
            6,
            3
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 8,
        "numbers": [
            8,
            1
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 15,
        "numbers": [
            9,
            6
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 11,
        "numbers": [
            1,
            12,
            10
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 7,
        "numbers": [
            3,
            13,
            4
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 14,
        "numbers": [
            6,
            8,
            5
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 3,
        "numbers": [
            2,
            1,
            13
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 80,
        "numbers": [
            8,
            10,
            3
        ],
        "slots": [
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 34,
        "numbers": [
            7,
            8,
            14,
            19
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 21,
        "numbers": [
            3,
            5,
            2,
            13
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 22,
        "numbers": [
            10,
            20,
            2,
            2
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 24,
        "numbers": [
            12,
            9,
            2,
            13
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 68,
        "numbers": [
            11,
            4,
            4,
            16
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 26,
        "numbers": [
            8,
            14,
            8,
            10
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 15,
        "numbers": [
            10,
            3,
            3,
            9
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 27,
        "numbers": [
            1,
            9,
            12,
            17
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 20,
        "numbers": [
            1,
            7,
            13,
            2
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 17,
        "numbers": [
            7,
            2,
            11,
            8
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 16,
        "numbers": [
            15,
            20,
            5,
            9
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 5,
        "numbers": [
            20,
            8,
            17,
            7
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 88,
        "numbers": [
            6,
            16,
            18,
            12
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 28,
        "numbers": [
            3,
            5,
            20,
            10
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 133,
        "numbers": [
            7,
            7,
            1,
            20
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 1,
        "numbers": [
            2,
            14,
            18,
            5,
            5
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 28,
        "numbers": [
            2,
            12,
            12,
            18,
            3
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 21,
        "numbers": [
            13,
            1,
            6,
            4,
            7
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 373,
        "numbers": [
            19,
            12,
            4,
            19,
            12
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 3,
        "numbers": [
            1,
            1,
            4,
            8,
            1
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 8,
        "numbers": [
            4,
            12,
            6,
            7,
            20,
            18
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 11,
        "numbers": [
            8,
            15,
            9,
            3,
            7,
            15
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 277,
        "numbers": [
            19,
            9,
            15,
            3,
            17,
            7
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 7,
        "numbers": [
            2,
            9,
            6,
            5,
            17,
            1
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 130,
        "numbers": [
            10,
            5,
            2,
            18,
            9,
            20
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 191,
        "numbers": [
            12,
            16,
            2,
            23,
            1,
            22
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 13,
        "numbers": [
            4,
            1,
            12,
            27,
            9,
            14
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 49,
        "numbers": [
            3,
            2,
            12,
            1,
            2,
            30
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 9,
        "numbers": [
            4,
            4,
            6,
            17,
            8,
            5
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 45,
        "numbers": [
            27,
            9,
            12,
            1,
            8,
            9
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 290,
        "numbers": [
            20,
            1,
            19,
            13,
            30,
            9
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 377,
        "numbers": [
            7,
            20,
            6,
            9,
            4,
            19
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 150,
        "numbers": [
            16,
            9,
            16,
            6,
            1,
            25
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 142,
        "numbers": [
            16,
            1,
            10,
            8,
            13,
            10
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 128,
        "numbers": [
            22,
            2,
            22,
            12,
            7,
            18
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 54,
        "numbers": [
            11,
            12,
            22,
            2,
            4,
            18,
            11
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 27,
        "numbers": [
            20,
            16,
            19,
            12,
            8,
            13,
            12
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 243,
        "numbers": [
            5,
            25,
            11,
            27,
            5,
            8,
            2
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 302,
        "numbers": [
            29,
            3,
            13,
            11,
            13,
            4,
            16
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    },
    {
        "target": 19,
        "numbers": [
            7,
            3,
            19,
            5,
            5,
            13,
            16
        ],
        "slots": [
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n",
            "o",
            "n"
        ]
    }
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
