// fasulye-torbasi-atma/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const equationDisplay = document.getElementById('equationDisplay');
const angleDisplay = document.getElementById('angleDisplay');
const velocityDisplay = document.getElementById('velocityDisplay');
const levelCounter = document.getElementById('levelCounter');
const taskDescription = document.getElementById('taskDescription');
const gameMessage = document.getElementById('gameMessage');

const GAME_ID = 'fasulye-torbasi-atma';
let currentLevel = 1;
const MAX_LEVEL = 50;

// Physics & Scale constants
const SCALE = 10; // 10 pixels = 1 meter
const G = 9.8; // Gravity
const ORIGIN = { x: 50, y: 350 }; // World origin in canvas coords

// Game State
let state = 'idle'; // idle, dragging, flying
let beanBag = { x: 0, y: 0, radius: 10 }; // world coords
let target = { x: 20, y: 0, width: 4, height: 1 }; // world coords
let throwParams = { v0: 0, angle: 0 }; // angle in radians
let time = 0;
let dragStart = { x: 0, y: 0 };
let currentMouse = { x: 0, y: 0 };
let trajectory = [];

// Level Generation
function generateLevels() {
    let levels = [];
    for (let i = 1; i <= MAX_LEVEL; i++) {
        // As level increases, target gets further and sometimes elevated
        let distance = 10 + i * 1.2 + Math.random() * 5;
        let height = 0;
        if (i > 10) {
            height = Math.random() * (i / 2);
        }
        // constrain target to not go out of canvas
        distance = Math.min(distance, 70); 
        height = Math.min(height, 30);
        
        let targetW = Math.max(2, 6 - (i / 10)); // target gets smaller
        
        levels.push({ targetX: distance, targetY: height, targetW: targetW });
    }
    return levels;
}

const levelsData = generateLevels();

function initGame() {
    currentLevel = 1;
    loadLevel();
    setupEventListeners();
    requestAnimationFrame(gameLoop);
}

function loadLevel() {
    let lvl = levelsData[currentLevel - 1];
    target.x = lvl.targetX;
    target.y = lvl.targetY;
    target.width = lvl.targetW;
    target.height = 1; // 1 meter thick target pad
    
    levelCounter.textContent = currentLevel;
    taskDescription.textContent = `Hedefi Vur! Mesafe: ${target.x.toFixed(1)}m`;
    gameMessage.textContent = '';
    
    resetThrow();
}

function resetThrow() {
    state = 'idle';
    beanBag.x = 0;
    beanBag.y = 0;
    throwParams.v0 = 0;
    throwParams.angle = 0;
    time = 0;
    trajectory = [];
    updateUI();
}

function worldToCanvas(worldX, worldY) {
    return {
        x: ORIGIN.x + worldX * SCALE,
        y: ORIGIN.y - worldY * SCALE
    };
}

function canvasToWorld(canvasX, canvasY) {
    return {
        x: (canvasX - ORIGIN.x) / SCALE,
        y: (ORIGIN.y - canvasY) / SCALE
    };
}

// Input handling
function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX = evt.clientX;
    let clientY = evt.clientY;
    
    if (evt.touches && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
        clientY = evt.touches[0].clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function setupEventListeners() {
    const startDrag = (e) => {
        if (state !== 'idle') return;
        let pos = getMousePos(e);
        let originCanvas = worldToCanvas(0, 0);
        
        // Sapan mekaniği: topun olduğu yerden çekmeye başla
        let dist = Math.hypot(pos.x - originCanvas.x, pos.y - originCanvas.y);
        if (dist < 40) {
            state = 'dragging';
            dragStart = pos;
            currentMouse = pos;
        }
    };
    
    const drag = (e) => {
        if (state !== 'dragging') return;
        e.preventDefault(); // Prevent scrolling on touch
        currentMouse = getMousePos(e);
        calculateThrowParams();
    };
    
    const endDrag = () => {
        if (state === 'dragging') {
            if (throwParams.v0 > 2) { // Minimum throw velocity
                state = 'flying';
                time = 0;
            } else {
                resetThrow();
            }
        }
    };

    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    
    canvas.addEventListener('touchstart', startDrag, {passive: false});
    canvas.addEventListener('touchmove', drag, {passive: false});
    window.addEventListener('touchend', endDrag);
}

function calculateThrowParams() {
    let originCanvas = worldToCanvas(0, 0);
    let dx = originCanvas.x - currentMouse.x;
    let dy = originCanvas.y - currentMouse.y; // Reversed because canvas Y is down
    
    // Calculate angle
    throwParams.angle = Math.atan2(dy, dx);
    if (throwParams.angle < 0) throwParams.angle = 0;
    if (throwParams.angle > Math.PI / 2) throwParams.angle = Math.PI / 2;
    
    // Calculate velocity based on drag distance
    let dist = Math.hypot(dx, dy);
    throwParams.v0 = Math.min(dist / 5, 40); // Max velocity 40 m/s
    
    updateUI();
}

function updateUI() {
    let angleDeg = (throwParams.angle * 180 / Math.PI).toFixed(1);
    angleDisplay.textContent = angleDeg;
    velocityDisplay.textContent = throwParams.v0.toFixed(1);
    
    if (throwParams.v0 > 0 && Math.cos(throwParams.angle) !== 0) {
        let v0 = throwParams.v0;
        let theta = throwParams.angle;
        let cosT = Math.cos(theta);
        
        let a = -G / (2 * v0 * v0 * cosT * cosT);
        let b = Math.tan(theta);
        let c = 0; // Starts from (0,0)
        
        let aStr = a.toFixed(4);
        let bStr = b.toFixed(2);
        let cStr = c.toFixed(2);
        
        equationDisplay.textContent = `f(x) = ${aStr}x² + ${bStr}x + ${cStr}`;
    } else {
        equationDisplay.textContent = `f(x) = 0x² + 0x + 0`;
    }
}

function updatePhysics() {
    if (state === 'flying') {
        time += 0.03; // dt
        
        let v0 = throwParams.v0;
        let theta = throwParams.angle;
        
        // Calculate new position
        beanBag.x = v0 * Math.cos(theta) * time;
        beanBag.y = v0 * Math.sin(theta) * time - 0.5 * G * time * time;
        
        // Store trajectory
        trajectory.push({ x: beanBag.x, y: beanBag.y });
        
        // Check ground collision
        if (beanBag.y <= 0) {
            beanBag.y = 0;
            checkHit(beanBag.x);
        }
    }
}

function checkHit(hitX) {
    state = 'hit';
    
    // Check if within target bounds
    // Target is from target.x - width/2 to target.x + width/2
    let targetLeft = target.x - target.width / 2;
    let targetRight = target.x + target.width / 2;
    
    // Target y must match (or close enough for elevated targets)
    // For simplicity, we check if it hits the platform from above
    let hitPlatform = false;
    
    if (hitX >= targetLeft && hitX <= targetRight) {
        // If elevated, we should check if it hit the top
        hitPlatform = true;
    }
    
    if (hitPlatform) {
        GameUtils.playSound('success');
        gameMessage.innerHTML = `<span style="color:var(--cyan);">BAŞARILI İSABET!</span> Formül doğrulandı.`;
        
        setTimeout(() => {
            if (currentLevel < MAX_LEVEL) {
                currentLevel++;
                loadLevel();
            } else {
                gameMessage.innerHTML = `<span style="color:var(--yellow);">TÜM SEVİYELER TAMAMLANDI!</span> Simülasyon bitti.`;
                GameUtils.saveScore(GAME_ID, 100);
            }
        }, 2000);
    } else {
        GameUtils.playSound('error');
        gameMessage.innerHTML = `<span style="color:var(--pink);">ISKA!</span> Atış açısını ve kuvvetini tekrar hesapla.`;
        setTimeout(() => {
            resetThrow();
            gameMessage.innerHTML = '';
        }, 2000);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.beginPath();
    ctx.moveTo(0, ORIGIN.y);
    ctx.lineTo(canvas.width, ORIGIN.y);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw origin marker
    ctx.beginPath();
    ctx.arc(ORIGIN.x, ORIGIN.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--cyan)';
    ctx.fill();
    
    // Draw target
    let tCanvas = worldToCanvas(target.x, target.y);
    let tW = target.width * SCALE;
    let tH = target.height * SCALE;
    
    ctx.fillStyle = 'rgba(255, 45, 120, 0.3)';
    ctx.fillRect(tCanvas.x - tW/2, tCanvas.y, tW, tH);
    ctx.strokeStyle = 'var(--pink)';
    ctx.strokeRect(tCanvas.x - tW/2, tCanvas.y, tW, tH);
    
    // Draw center of target
    ctx.beginPath();
    ctx.moveTo(tCanvas.x, tCanvas.y);
    ctx.lineTo(tCanvas.x, tCanvas.y + tH);
    ctx.strokeStyle = 'var(--yellow)';
    ctx.setLineDash([2, 2]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw dragging visual (slingshot)
    let originCanvas = worldToCanvas(0, 0);
    if (state === 'dragging') {
        ctx.beginPath();
        ctx.moveTo(originCanvas.x, originCanvas.y);
        ctx.lineTo(currentMouse.x, currentMouse.y);
        ctx.strokeStyle = 'var(--yellow)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw predicted trajectory
        drawPredictedTrajectory();
    }
    
    // Draw past trajectory
    if (trajectory.length > 0) {
        ctx.beginPath();
        let start = worldToCanvas(trajectory[0].x, trajectory[0].y);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < trajectory.length; i++) {
            let p = worldToCanvas(trajectory[i].x, trajectory[i].y);
            ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Draw Bean Bag
    let bbCanvas = worldToCanvas(beanBag.x, beanBag.y);
    ctx.beginPath();
    ctx.arc(bbCanvas.x, bbCanvas.y, beanBag.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--cyan)';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPredictedTrajectory() {
    if (throwParams.v0 <= 0) return;
    
    ctx.beginPath();
    let origin = worldToCanvas(0, 0);
    ctx.moveTo(origin.x, origin.y);
    
    let v0 = throwParams.v0;
    let theta = throwParams.angle;
    let maxT = (2 * v0 * Math.sin(theta)) / G; // Time of flight on flat ground
    if (maxT <= 0) return;
    
    // Draw points along the curve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([5, 5]);
    
    for (let t = 0; t <= maxT; t += 0.1) {
        let x = v0 * Math.cos(theta) * t;
        let y = v0 * Math.sin(theta) * t - 0.5 * G * t * t;
        let p = worldToCanvas(x, y);
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
}

function gameLoop() {
    updatePhysics();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
window.onload = initGame;
