// yansima-aynasi/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('levelCounter');
const transformDisplay = document.getElementById('transformDisplay');
const gameMessage = document.getElementById('gameMessage');

const rot90Btn = document.getElementById('rot90Btn');
const refXBtn = document.getElementById('refXBtn');
const refYBtn = document.getElementById('refYBtn');

const GAME_ID = 'yansima-aynasi';
const MAX_LEVEL = 50;

let currentLevel = 1;
const GRID_SIZE = 10;
const CELL = 50;
const CENTER_PX = 250;

// Şekiller blok koordinatları (x,y) cinsinden. Merkez (0,0)
let currentShape = [];
let targetShape = [];

// Base Shapes
const shapes = [
    // L-Shape
    [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 3, y: 2}],
    // T-Shape
    [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 2, y: 3}],
    // Square
    [{x: 1, y: 1}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 2, y: 2}],
    // Z-Shape
    [{x: 1, y: 2}, {x: 2, y: 2}, {x: 2, y: 1}, {x: 3, y: 1}]
];

function initGame() {
    currentLevel = 1;
    setupButtons();
    loadLevel();
    draw();
}

function cloneShape(shape) {
    return shape.map(p => ({x: p.x, y: p.y}));
}

function loadLevel() {
    let base = shapes[Math.floor(Math.random() * shapes.length)];
    currentShape = cloneShape(base);
    
    // Create target by applying random transformations
    targetShape = cloneShape(currentShape);
    let numTransforms = 1 + Math.floor(currentLevel / 10);
    
    for (let i = 0; i < numTransforms; i++) {
        let r = Math.floor(Math.random() * 3);
        if (r === 0) targetShape = transformShape(targetShape, 'rot90');
        else if (r === 1) targetShape = transformShape(targetShape, 'refX');
        else if (r === 2) targetShape = transformShape(targetShape, 'refY');
    }
    
    // Check if target is exactly same as current. If so, apply one more.
    if (checkMatch(currentShape, targetShape)) {
        targetShape = transformShape(targetShape, 'rot90');
    }
    
    levelCounter.textContent = currentLevel;
    gameMessage.textContent = '';
    transformDisplay.textContent = 'Bekleniyor...';
    
    draw();
}

function transformShape(shape, type) {
    return shape.map(p => {
        if (type === 'rot90') {
            // 90 deg CCW: (x,y) -> (-y, x)
            return { x: -p.y, y: p.x };
        } else if (type === 'refX') {
            // Reflect X: (x,y) -> (x, -y)
            return { x: p.x, y: -p.y };
        } else if (type === 'refY') {
            // Reflect Y: (x,y) -> (-x, y)
            return { x: -p.x, y: p.y };
        }
        return p;
    });
}

function applyTransform(type) {
    currentShape = transformShape(currentShape, type);
    
    if (type === 'rot90') {
        transformDisplay.textContent = '(x, y) ➔ (-y, x)  [90° Dönüş]';
    } else if (type === 'refX') {
        transformDisplay.textContent = '(x, y) ➔ (x, -y)  [X\'e Göre Simetri]';
    } else if (type === 'refY') {
        transformDisplay.textContent = '(x, y) ➔ (-x, y)  [Y\'ye Göre Simetri]';
    }
    
    GameUtils.playSound('click');
    draw();
    
    if (checkMatch(currentShape, targetShape)) {
        winLevel();
    }
}

function setupButtons() {
    rot90Btn.onclick = () => applyTransform('rot90');
    refXBtn.onclick = () => applyTransform('refX');
    refYBtn.onclick = () => applyTransform('refY');
}

function checkMatch(s1, s2) {
    if (s1.length !== s2.length) return false;
    
    // Check if every point in s1 exists in s2
    for (let p1 of s1) {
        let found = s2.find(p2 => p2.x === p1.x && p2.y === p1.y);
        if (!found) return false;
    }
    return true;
}

function winLevel() {
    GameUtils.playSound('success');
    gameMessage.innerHTML = `<span style="color:var(--cyan);">EŞLEŞTİ!</span>`;
    
    // Disable buttons temporarily
    rot90Btn.disabled = true;
    refXBtn.disabled = true;
    refYBtn.disabled = true;
    
    if (typeof GameUtils !== 'undefined') {
        let score = GameUtils.getScore(GAME_ID);
        GameUtils.saveScore(GAME_ID, score + 100);
    }
    
    setTimeout(() => {
        rot90Btn.disabled = false;
        refXBtn.disabled = false;
        refYBtn.disabled = false;
        
        if (currentLevel < MAX_LEVEL) {
            currentLevel++;
            loadLevel();
        } else {
            gameMessage.innerHTML = `<span style="color:var(--yellow);">TÜM SEVİYELER TAMAMLANDI!</span>`;
        }
    }, 2000);
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= GRID_SIZE; i++) {
        let pos = i * CELL;
        ctx.moveTo(pos, 0); ctx.lineTo(pos, canvas.height);
        ctx.moveTo(0, pos); ctx.lineTo(canvas.width, pos);
    }
    ctx.stroke();
    
    // Axes
    ctx.lineWidth = 2;
    // X Axis (Red)
    ctx.strokeStyle = 'rgba(255, 45, 120, 0.8)';
    ctx.beginPath(); ctx.moveTo(0, CENTER_PX); ctx.lineTo(canvas.width, CENTER_PX); ctx.stroke();
    
    // Y Axis (Greenish/Cyan)
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.8)';
    ctx.beginPath(); ctx.moveTo(CENTER_PX, 0); ctx.lineTo(CENTER_PX, canvas.height); ctx.stroke();
}

function drawBlock(x, y, color, isGhost = false) {
    // Math coordinates to Canvas coordinates
    // Math X: right positive. Canvas X: right positive.
    // Math Y: up positive. Canvas Y: down positive.
    let cx = CENTER_PX + x * CELL;
    let cy = CENTER_PX - y * CELL - CELL; // -CELL because we draw from top-left
    
    if (isGhost) {
        ctx.fillStyle = color;
        ctx.fillRect(cx, cy, CELL, CELL);
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cx, cy, CELL, CELL);
        ctx.setLineDash([]);
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(cx, cy, CELL, CELL);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(cx, cy, CELL, CELL);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    
    // Draw Target Shape (Ghost)
    targetShape.forEach(p => {
        drawBlock(p.x, p.y, 'rgba(255, 255, 255, 0.2)', true);
    });
    
    // Draw Current Shape
    currentShape.forEach(p => {
        drawBlock(p.x, p.y, 'var(--yellow)', false);
    });
}

window.onload = initGame;
