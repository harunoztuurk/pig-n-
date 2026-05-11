// cember-isbirligi/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('levelCounter');
const targetAreaDisplay = document.getElementById('targetAreaDisplay');
const radiusVal = document.getElementById('radiusVal');
const circumferenceVal = document.getElementById('circumferenceVal');
const areaVal = document.getElementById('areaVal');
const gameMessage = document.getElementById('gameMessage');
const checkBtn = document.getElementById('checkBtn');

const GAME_ID = 'cember-isbirligi';
const MAX_LEVEL = 50;

let currentLevel = 1;
let currentRadius = 5; // internal logic units
let targetRadius = 10;
const CENTER = { x: 250, y: 250 };
const SCALE = 15; // 1 unit = 15 pixels

let isDragging = false;
let animationTime = 0;

function initGame() {
    currentLevel = 1;
    setupEvents();
    loadLevel();
    requestAnimationFrame(gameLoop);
}

function loadLevel() {
    // Generate a random integer radius target between 5 and 15
    targetRadius = Math.floor(Math.random() * 11) + 5;
    
    // Avoid same radius
    if (targetRadius === Math.round(currentRadius) && targetRadius < 15) {
        targetRadius++;
    }
    
    let targetArea = targetRadius * targetRadius; // Area without PI
    targetAreaDisplay.textContent = `${targetArea}π`;
    
    levelCounter.textContent = currentLevel;
    gameMessage.textContent = '';
    
    // Reset dragging
    isDragging = false;
    updateUI();
}

function setupEvents() {
    const handleDown = (e) => {
        let { x, y } = getMousePos(e);
        let dist = Math.hypot(x - CENTER.x, y - CENTER.y);
        let rPixel = currentRadius * SCALE;
        
        // Kenardan (veya içinden) tutulmasına izin ver
        if (Math.abs(dist - rPixel) < 30 || dist < rPixel) {
            isDragging = true;
            updateRadiusFromMouse(x, y);
        }
    };
    
    const handleMove = (e) => {
        if (!isDragging) return;
        let { x, y } = getMousePos(e);
        updateRadiusFromMouse(x, y);
    };
    
    const handleUp = () => {
        isDragging = false;
    };
    
    canvas.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    
    // Touch
    canvas.addEventListener('touchstart', (e) => {
        let touch = e.touches[0];
        handleDown({ clientX: touch.clientX, clientY: touch.clientY });
    }, {passive: false});
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        let touch = e.touches[0];
        handleMove({ clientX: touch.clientX, clientY: touch.clientY });
    }, {passive: false});
    window.addEventListener('touchend', handleUp);
    
    checkBtn.addEventListener('click', checkWin);
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function updateRadiusFromMouse(x, y) {
    let dist = Math.hypot(x - CENTER.x, y - CENTER.y);
    let newR = dist / SCALE;
    
    // Limit radius
    if (newR < 1) newR = 1;
    if (newR > 16) newR = 16;
    
    currentRadius = newR;
    updateUI();
}

function updateUI() {
    radiusVal.textContent = currentRadius.toFixed(1);
    
    let circ = 2 * currentRadius;
    circumferenceVal.textContent = `${circ.toFixed(1)}π`;
    
    let area = currentRadius * currentRadius;
    areaVal.textContent = `${area.toFixed(1)}π`;
}

function checkWin() {
    let rError = Math.abs(currentRadius - targetRadius);
    
    // Tolerance depends on level
    let tolerance = Math.max(0.2, 1.0 - (currentLevel * 0.015)); 
    
    if (rError <= tolerance) {
        // Win
        GameUtils.playSound('success');
        gameMessage.innerHTML = `<span style="color:var(--cyan);">DOĞRU ALAN! Seviye Geçildi.</span>`;
        if (typeof GameUtils !== 'undefined') {
            let score = GameUtils.getScore(GAME_ID);
            GameUtils.saveScore(GAME_ID, score + 100);
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
        gameMessage.innerHTML = `<span style="color:var(--pink);">HATALI ALAN!</span> Daha fazla dikkat et.`;
        setTimeout(() => {
            gameMessage.innerHTML = '';
        }, 2000);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationTime += 0.05;
    
    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<canvas.width; i+=SCALE) {
        ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height);
        ctx.moveTo(0, i); ctx.lineTo(canvas.width, i);
    }
    ctx.stroke();
    
    // Draw Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(CENTER.x, 0); ctx.lineTo(CENTER.x, canvas.height);
    ctx.moveTo(0, CENTER.y); ctx.lineTo(canvas.width, CENTER.y);
    ctx.stroke();
    
    let rPixel = currentRadius * SCALE;
    
    // Draw Area Scan Animation (Pulse effect inside circle)
    let pulseOpacity = 0.1 + (Math.sin(animationTime) * 0.05 + 0.05);
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, rPixel, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 45, 120, ${pulseOpacity})`; // Pinkish fill
    ctx.fill();
    
    // Draw Circle Circumference
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, rPixel, 0, Math.PI * 2);
    ctx.strokeStyle = 'var(--pink)';
    ctx.lineWidth = isDragging ? 5 : 3;
    if (isDragging) {
        ctx.shadowColor = 'var(--pink)';
        ctx.shadowBlur = 15;
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
    
    // Draw Radius Line
    ctx.beginPath();
    ctx.moveTo(CENTER.x, CENTER.y);
    let rx = CENTER.x + rPixel * Math.cos(animationTime * 0.5); // slowly rotating
    let ry = CENTER.y + rPixel * Math.sin(animationTime * 0.5);
    ctx.lineTo(rx, ry);
    ctx.strokeStyle = 'var(--cyan)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Center Dot
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--cyan)';
    ctx.fill();
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

window.onload = initGame;
