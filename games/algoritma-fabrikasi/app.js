const gameId = 'algoritma-fabrikasi';

let draggedItem = null;

const levels = [
    {
        "input": 1,
        "target": 39,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 7,
                "display": "+ 7"
            },
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            },
            {
                "op": "+",
                "val": 17,
                "display": "+ 17"
            }
        ]
    },
    {
        "input": 2,
        "target": 422,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            },
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            },
            {
                "op": "*",
                "val": 6,
                "display": "× 6"
            }
        ]
    },
    {
        "input": 18,
        "target": 24,
        "slots": 3,
        "funcs": [
            {
                "op": "/",
                "val": 9,
                "display": "÷ 9"
            },
            {
                "op": "*",
                "val": 5,
                "display": "× 5"
            },
            {
                "op": "+",
                "val": 14,
                "display": "+ 14"
            }
        ]
    },
    {
        "input": 11,
        "target": 331,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 10,
                "display": "× 10"
            },
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            },
            {
                "op": "+",
                "val": 1,
                "display": "+ 1"
            }
        ]
    },
    {
        "input": 2,
        "target": -50,
        "slots": 4,
        "funcs": [
            {
                "op": "-",
                "val": 16,
                "display": "- 16"
            },
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            },
            {
                "op": "-",
                "val": 18,
                "display": "- 18"
            },
            {
                "op": "+",
                "val": 14,
                "display": "+ 14"
            }
        ]
    },
    {
        "input": 8,
        "target": -16,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 18,
                "display": "- 18"
            },
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            },
            {
                "op": "-",
                "val": 16,
                "display": "- 16"
            }
        ]
    },
    {
        "input": 4,
        "target": 19,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 8,
                "display": "× 8"
            },
            {
                "op": "-",
                "val": 14,
                "display": "- 14"
            },
            {
                "op": "+",
                "val": 1,
                "display": "+ 1"
            }
        ]
    },
    {
        "input": 17,
        "target": 89,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            },
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            },
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            }
        ]
    },
    {
        "input": 13,
        "target": 13,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 3,
                "display": "- 3"
            },
            {
                "op": "-",
                "val": 7,
                "display": "- 7"
            },
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            }
        ]
    },
    {
        "input": 10,
        "target": -7,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 10,
                "display": "- 10"
            },
            {
                "op": "-",
                "val": 11,
                "display": "- 11"
            },
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            }
        ]
    },
    {
        "input": 5,
        "target": 57,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 8,
                "display": "- 8"
            },
            {
                "op": "+",
                "val": 20,
                "display": "+ 20"
            },
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            }
        ]
    },
    {
        "input": 13,
        "target": 71,
        "slots": 4,
        "funcs": [
            {
                "op": "*",
                "val": 6,
                "display": "× 6"
            },
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            },
            {
                "op": "*",
                "val": 2,
                "display": "× 2"
            },
            {
                "op": "-",
                "val": 15,
                "display": "- 15"
            }
        ]
    },
    {
        "input": 2,
        "target": 2,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 3,
                "display": "+ 3"
            },
            {
                "op": "-",
                "val": 4,
                "display": "- 4"
            },
            {
                "op": "+",
                "val": 1,
                "display": "+ 1"
            },
            {
                "op": "/",
                "val": 1,
                "display": "÷ 1"
            }
        ]
    },
    {
        "input": 6,
        "target": 259,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            },
            {
                "op": "*",
                "val": 6,
                "display": "× 6"
            },
            {
                "op": "+",
                "val": 7,
                "display": "+ 7"
            }
        ]
    },
    {
        "input": 6,
        "target": 27,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 1,
                "display": "+ 1"
            },
            {
                "op": "+",
                "val": 5,
                "display": "+ 5"
            },
            {
                "op": "*",
                "val": 4,
                "display": "× 4"
            }
        ]
    },
    {
        "input": 6,
        "target": 195,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 9,
                "display": "+ 9"
            },
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            },
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            }
        ]
    },
    {
        "input": 12,
        "target": 16,
        "slots": 4,
        "funcs": [
            {
                "op": "-",
                "val": 13,
                "display": "- 13"
            },
            {
                "op": "/",
                "val": 1,
                "display": "÷ 1"
            },
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            },
            {
                "op": "+",
                "val": 7,
                "display": "+ 7"
            }
        ]
    },
    {
        "input": 17,
        "target": 13,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 1,
                "display": "- 1"
            },
            {
                "op": "-",
                "val": 11,
                "display": "- 11"
            },
            {
                "op": "+",
                "val": 8,
                "display": "+ 8"
            }
        ]
    },
    {
        "input": 1,
        "target": -69,
        "slots": 3,
        "funcs": [
            {
                "op": "/",
                "val": 1,
                "display": "÷ 1"
            },
            {
                "op": "-",
                "val": 7,
                "display": "- 7"
            },
            {
                "op": "*",
                "val": 10,
                "display": "× 10"
            }
        ]
    },
    {
        "input": 13,
        "target": 23,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            },
            {
                "op": "+",
                "val": 5,
                "display": "+ 5"
            },
            {
                "op": "+",
                "val": 1,
                "display": "+ 1"
            }
        ]
    },
    {
        "input": 19,
        "target": 314,
        "slots": 4,
        "funcs": [
            {
                "op": "*",
                "val": 2,
                "display": "× 2"
            },
            {
                "op": "*",
                "val": 8,
                "display": "× 8"
            },
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            },
            {
                "op": "+",
                "val": 8,
                "display": "+ 8"
            }
        ]
    },
    {
        "input": 11,
        "target": 38,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 18,
                "display": "+ 18"
            },
            {
                "op": "-",
                "val": 13,
                "display": "- 13"
            },
            {
                "op": "+",
                "val": 15,
                "display": "+ 15"
            },
            {
                "op": "+",
                "val": 7,
                "display": "+ 7"
            }
        ]
    },
    {
        "input": 7,
        "target": 6,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            },
            {
                "op": "-",
                "val": 11,
                "display": "- 11"
            },
            {
                "op": "-",
                "val": 4,
                "display": "- 4"
            }
        ]
    },
    {
        "input": 10,
        "target": 83,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 13,
                "display": "+ 13"
            },
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            },
            {
                "op": "-",
                "val": 7,
                "display": "- 7"
            },
            {
                "op": "-",
                "val": 11,
                "display": "- 11"
            }
        ]
    },
    {
        "input": 2,
        "target": -9,
        "slots": 4,
        "funcs": [
            {
                "op": "/",
                "val": 2,
                "display": "÷ 2"
            },
            {
                "op": "+",
                "val": 5,
                "display": "+ 5"
            },
            {
                "op": "-",
                "val": 19,
                "display": "- 19"
            },
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            }
        ]
    },
    {
        "input": 4,
        "target": 27,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 9,
                "display": "+ 9"
            },
            {
                "op": "+",
                "val": 15,
                "display": "+ 15"
            },
            {
                "op": "+",
                "val": 9,
                "display": "+ 9"
            },
            {
                "op": "-",
                "val": 10,
                "display": "- 10"
            }
        ]
    },
    {
        "input": 4,
        "target": 20,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 1,
                "display": "+ 1"
            },
            {
                "op": "*",
                "val": 1,
                "display": "× 1"
            },
            {
                "op": "+",
                "val": 15,
                "display": "+ 15"
            }
        ]
    },
    {
        "input": 18,
        "target": 210,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            },
            {
                "op": "+",
                "val": 16,
                "display": "+ 16"
            },
            {
                "op": "*",
                "val": 3,
                "display": "× 3"
            }
        ]
    },
    {
        "input": 9,
        "target": 30,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 19,
                "display": "+ 19"
            },
            {
                "op": "+",
                "val": 19,
                "display": "+ 19"
            },
            {
                "op": "-",
                "val": 17,
                "display": "- 17"
            }
        ]
    },
    {
        "input": 5,
        "target": -132,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 3,
                "display": "+ 3"
            },
            {
                "op": "-",
                "val": 20,
                "display": "- 20"
            },
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            }
        ]
    },
    {
        "input": 1,
        "target": 181,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            },
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            },
            {
                "op": "*",
                "val": 10,
                "display": "× 10"
            }
        ]
    },
    {
        "input": 11,
        "target": 1,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 14,
                "display": "- 14"
            },
            {
                "op": "+",
                "val": 15,
                "display": "+ 15"
            },
            {
                "op": "-",
                "val": 11,
                "display": "- 11"
            }
        ]
    },
    {
        "input": 7,
        "target": 44,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 10,
                "display": "× 10"
            },
            {
                "op": "/",
                "val": 2,
                "display": "÷ 2"
            },
            {
                "op": "+",
                "val": 9,
                "display": "+ 9"
            }
        ]
    },
    {
        "input": 20,
        "target": -32,
        "slots": 4,
        "funcs": [
            {
                "op": "-",
                "val": 15,
                "display": "- 15"
            },
            {
                "op": "*",
                "val": 4,
                "display": "× 4"
            },
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            }
        ]
    },
    {
        "input": 5,
        "target": 37,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "*",
                "val": 6,
                "display": "× 6"
            },
            {
                "op": "-",
                "val": 4,
                "display": "- 4"
            }
        ]
    },
    {
        "input": 3,
        "target": -72,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "+",
                "val": 3,
                "display": "+ 3"
            },
            {
                "op": "-",
                "val": 12,
                "display": "- 12"
            },
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            }
        ]
    },
    {
        "input": 15,
        "target": 17,
        "slots": 4,
        "funcs": [
            {
                "op": "/",
                "val": 3,
                "display": "÷ 3"
            },
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            },
            {
                "op": "+",
                "val": 8,
                "display": "+ 8"
            },
            {
                "op": "*",
                "val": 1,
                "display": "× 1"
            }
        ]
    },
    {
        "input": 3,
        "target": 32,
        "slots": 4,
        "funcs": [
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            },
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            },
            {
                "op": "+",
                "val": 3,
                "display": "+ 3"
            },
            {
                "op": "/",
                "val": 1,
                "display": "÷ 1"
            }
        ]
    },
    {
        "input": 3,
        "target": 187,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 20,
                "display": "+ 20"
            },
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            },
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            }
        ]
    },
    {
        "input": 14,
        "target": 10,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            },
            {
                "op": "+",
                "val": 3,
                "display": "+ 3"
            },
            {
                "op": "-",
                "val": 9,
                "display": "- 9"
            }
        ]
    },
    {
        "input": 2,
        "target": 43,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            },
            {
                "op": "+",
                "val": 20,
                "display": "+ 20"
            },
            {
                "op": "+",
                "val": 9,
                "display": "+ 9"
            },
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            }
        ]
    },
    {
        "input": 19,
        "target": -129,
        "slots": 4,
        "funcs": [
            {
                "op": "-",
                "val": 17,
                "display": "- 17"
            },
            {
                "op": "*",
                "val": 10,
                "display": "× 10"
            },
            {
                "op": "+",
                "val": 13,
                "display": "+ 13"
            },
            {
                "op": "+",
                "val": 9,
                "display": "+ 9"
            }
        ]
    },
    {
        "input": 6,
        "target": 42,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 6,
                "display": "× 6"
            },
            {
                "op": "*",
                "val": 7,
                "display": "× 7"
            },
            {
                "op": "/",
                "val": 6,
                "display": "÷ 6"
            }
        ]
    },
    {
        "input": 6,
        "target": 16,
        "slots": 3,
        "funcs": [
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "+",
                "val": 5,
                "display": "+ 5"
            },
            {
                "op": "-",
                "val": 1,
                "display": "- 1"
            }
        ]
    },
    {
        "input": 1,
        "target": 1,
        "slots": 4,
        "funcs": [
            {
                "op": "-",
                "val": 12,
                "display": "- 12"
            },
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "+",
                "val": 4,
                "display": "+ 4"
            },
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            }
        ]
    },
    {
        "input": 9,
        "target": 53,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 6,
                "display": "× 6"
            },
            {
                "op": "-",
                "val": 4,
                "display": "- 4"
            },
            {
                "op": "+",
                "val": 3,
                "display": "+ 3"
            }
        ]
    },
    {
        "input": 13,
        "target": 4212,
        "slots": 3,
        "funcs": [
            {
                "op": "*",
                "val": 4,
                "display": "× 4"
            },
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            },
            {
                "op": "*",
                "val": 9,
                "display": "× 9"
            }
        ]
    },
    {
        "input": 4,
        "target": 44,
        "slots": 4,
        "funcs": [
            {
                "op": "+",
                "val": 14,
                "display": "+ 14"
            },
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            },
            {
                "op": "+",
                "val": 6,
                "display": "+ 6"
            },
            {
                "op": "+",
                "val": 10,
                "display": "+ 10"
            }
        ]
    },
    {
        "input": 18,
        "target": -1,
        "slots": 4,
        "funcs": [
            {
                "op": "-",
                "val": 7,
                "display": "- 7"
            },
            {
                "op": "-",
                "val": 7,
                "display": "- 7"
            },
            {
                "op": "-",
                "val": 7,
                "display": "- 7"
            },
            {
                "op": "+",
                "val": 2,
                "display": "+ 2"
            }
        ]
    },
    {
        "input": 13,
        "target": 27,
        "slots": 3,
        "funcs": [
            {
                "op": "-",
                "val": 10,
                "display": "- 10"
            },
            {
                "op": "+",
                "val": 12,
                "display": "+ 12"
            },
            {
                "op": "+",
                "val": 12,
                "display": "+ 12"
            }
        ]
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

    // Matematiksel işlem önceliği (Order of Operations) ile hesapla
    let expression = currentPuzzle.input.toString();
    slots.forEach(slot => {
        const item = slot.children[0];
        const op = item.dataset.op;
        const val = item.dataset.val;
        
        expression += ` ${op} ${val}`;
    });

    currentVal = eval(expression);

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
