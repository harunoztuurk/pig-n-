// bowling-kombinasyon/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('levelCounter');
const comboDisplay = document.getElementById('comboDisplay');
const gameMessage = document.getElementById('gameMessage');

const dirBar = document.getElementById('dirBar');
const speedBar = document.getElementById('speedBar');
const spinBar = document.getElementById('spinBar');
const dirValue = document.getElementById('dirValue');
const speedValue = document.getElementById('speedValue');
const spinValue = document.getElementById('spinValue');
const actionBtn = document.getElementById('actionBtn');

const questionArea = document.getElementById('questionArea');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const checkAnswerBtn = document.getElementById('checkAnswerBtn');

const GAME_ID = 'bowling-kombinasyon';
const MAX_LEVEL = 50;

let currentLevel = 1;

// Input States
let inputPhase = 'angle'; // angle -> speed -> spin -> rolling -> question
let angleTimer, speedTimer, spinTimer;
let angleVal = 0; // -30 to 30
let speedVal = 50; // 10 to 100
let spinVal = 0; // -10 to 10

let angleDir = 1, speedDir = 1, spinDir = 1;

// Physics Entities
let ball = null;
let pins = [];
const PIN_RADIUS = 8;
const BALL_RADIUS = 12;
const BALL_MASS = 5;
const PIN_MASS = 1;

let knockedCount = 0;

function initGame() {
    currentLevel = 1;
    setupEvents();
    loadLevel();
    requestAnimationFrame(gameLoop);
}

function resetPhysics() {
    ball = {
        x: 150, y: 450,
        vx: 0, vy: 0,
        radius: BALL_RADIUS, mass: BALL_MASS,
        spin: 0
    };
    
    pins = [];
    // Arrange 10 pins in triangle
    let startY = 100;
    let startX = 150;
    let spacingX = 20;
    let spacingY = 18;
    
    let id = 0;
    for(let row = 0; row < 4; row++) {
        let pinsInRow = row + 1;
        let rowWidth = (pinsInRow - 1) * spacingX;
        let sx = startX - rowWidth / 2;
        let sy = startY - row * spacingY;
        
        for(let col = 0; col < pinsInRow; col++) {
            pins.push({
                id: id++,
                x: sx + col * spacingX,
                y: sy,
                origX: sx + col * spacingX,
                origY: sy,
                vx: 0, vy: 0,
                radius: PIN_RADIUS, mass: PIN_MASS,
                knocked: false
            });
        }
    }
}

function loadLevel() {
    inputPhase = 'angle';
    angleVal = 0; speedVal = 10; spinVal = 0;
    knockedCount = 0;
    questionArea.style.display = 'none';
    actionBtn.style.display = 'block';
    gameMessage.textContent = '';
    comboDisplay.textContent = 'Atış Bekleniyor';
    levelCounter.textContent = currentLevel;
    
    resetPhysics();
}

function setupEvents() {
    const handleAction = () => {
        if(inputPhase === 'angle') {
            inputPhase = 'speed';
            GameUtils.playSound('click');
        } else if(inputPhase === 'speed') {
            inputPhase = 'spin';
            GameUtils.playSound('click');
        } else if(inputPhase === 'spin') {
            inputPhase = 'rolling';
            GameUtils.playSound('click');
            fireBall();
        }
    };
    
    actionBtn.addEventListener('click', handleAction);
    window.addEventListener('keydown', (e) => {
        if(e.code === 'Space') {
            e.preventDefault();
            if(inputPhase !== 'rolling' && inputPhase !== 'question') {
                handleAction();
            }
        }
    });
    
    checkAnswerBtn.addEventListener('click', checkAnswer);
}

function updateInputBars() {
    if(inputPhase === 'angle') {
        angleVal += angleDir * 1.5;
        if(angleVal > 30 || angleVal < -30) angleDir *= -1;
    } else if(inputPhase === 'speed') {
        speedVal += speedDir * 3;
        if(speedVal > 100 || speedVal < 10) speedDir *= -1;
    } else if(inputPhase === 'spin') {
        spinVal += spinDir * 0.5;
        if(spinVal > 10 || spinVal < -10) spinDir *= -1;
    }
    
    dirBar.style.width = `${((angleVal + 30) / 60) * 100}%`;
    dirValue.textContent = `${Math.round(angleVal)}°`;
    
    speedBar.style.width = `${speedVal}%`;
    speedValue.textContent = `${Math.round(speedVal)}`;
    
    spinBar.style.width = `${((spinVal + 10) / 20) * 100}%`;
    spinValue.textContent = `${Math.round(spinVal)}`;
}

function fireBall() {
    let rad = (angleVal - 90) * Math.PI / 180;
    let power = speedVal * 0.15; // scalar
    
    ball.vx = Math.cos(rad) * power;
    ball.vy = Math.sin(rad) * power;
    ball.spin = spinVal * 0.05; // Spin adds lateral acceleration
}

function checkCollision(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let dist = Math.hypot(dx, dy);
    let minDist = p1.radius + p2.radius;
    
    if(dist < minDist) {
        // Elastic collision resolution
        let angle = Math.atan2(dy, dx);
        let overlap = minDist - dist;
        
        // Push apart
        let pushX = Math.cos(angle) * overlap / 2;
        let pushY = Math.sin(angle) * overlap / 2;
        p1.x -= pushX; p1.y -= pushY;
        p2.x += pushX; p2.y += pushY;
        
        // 1D elastic collision on the normal
        let nx = dx / dist;
        let ny = dy / dist;
        
        let p1Vn = p1.vx * nx + p1.vy * ny;
        let p2Vn = p2.vx * nx + p2.vy * ny;
        
        let p1Vt = -p1.vx * ny + p1.vy * nx;
        let p2Vt = -p2.vx * ny + p2.vy * nx;
        
        let m1 = p1.mass;
        let m2 = p2.mass;
        
        let p1VnAfter = (p1Vn * (m1 - m2) + 2 * m2 * p2Vn) / (m1 + m2);
        let p2VnAfter = (p2Vn * (m2 - m1) + 2 * m1 * p1Vn) / (m1 + m2);
        
        p1.vx = p1VnAfter * nx - p1Vt * ny;
        p1.vy = p1VnAfter * ny + p1Vt * nx;
        
        p2.vx = p2VnAfter * nx - p2Vt * ny;
        p2.vy = p2VnAfter * ny + p2Vt * nx;
        
        GameUtils.playSound('click');
    }
}

function updatePhysics() {
    if(inputPhase !== 'rolling') return;
    
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // Apply Spin curve (adds velocity perpendicular to movement)
    let bSpeed = Math.hypot(ball.vx, ball.vy);
    if(bSpeed > 0.1) {
        let perpX = -ball.vy / bSpeed;
        let perpY = ball.vx / bSpeed;
        ball.vx += perpX * ball.spin;
        ball.vy += perpY * ball.spin;
    }
    
    // Friction
    ball.vx *= 0.99;
    ball.vy *= 0.99;
    ball.spin *= 0.99;
    
    // Move pins
    let isMoving = false;
    if(Math.hypot(ball.vx, ball.vy) > 0.2) isMoving = true;
    
    pins.forEach(pin => {
        pin.x += pin.vx;
        pin.y += pin.vy;
        pin.vx *= 0.95; // higher friction for pins
        pin.vy *= 0.95;
        
        if(Math.hypot(pin.vx, pin.vy) > 0.2) isMoving = true;
        
        // Wall bounce for pins
        if(pin.x < 0 || pin.x > canvas.width) pin.vx *= -1;
        if(pin.y < 0) pin.vy *= -1;
        
        // Check knocked
        if(!pin.knocked && Math.hypot(pin.x - pin.origX, pin.y - pin.origY) > 10) {
            pin.knocked = true;
        }
        
        // Collide with ball
        checkCollision(ball, pin);
    });
    
    // Collide pins with pins
    for(let i=0; i<pins.length; i++) {
        for(let j=i+1; j<pins.length; j++) {
            checkCollision(pins[i], pins[j]);
        }
    }
    
    // Check if stopped or ball out of bounds
    if(!isMoving || ball.y < -50 || ball.y > 550 || ball.x < -50 || ball.x > 350) {
        finishRolling();
    }
}

function finishRolling() {
    inputPhase = 'question';
    knockedCount = pins.filter(p => p.knocked).length;
    
    actionBtn.style.display = 'none';
    questionArea.style.display = 'block';
    answerInput.value = '';
    
    questionText.textContent = `10 Lobuttan ${knockedCount}'i devrildi. Kombinasyon C(10, ${knockedCount}) kaçtır?`;
    comboDisplay.textContent = `C(10, ${knockedCount}) bekleniyor...`;
}

function fact(n) {
    if(n <= 1) return 1;
    return n * fact(n-1);
}

function checkAnswer() {
    let ans = parseInt(answerInput.value);
    if(isNaN(ans)) return;
    
    let correct = fact(10) / (fact(knockedCount) * fact(10 - knockedCount));
    
    if(ans === correct) {
        GameUtils.playSound('success');
        gameMessage.innerHTML = `<span style="color:var(--cyan);">DOĞRU! C(10,${knockedCount}) = ${correct}</span>`;
        comboDisplay.textContent = `C(10,${knockedCount}) = ${correct}`;
        
        if(typeof GameUtils !== 'undefined') {
            let score = GameUtils.getScore(GAME_ID);
            GameUtils.saveScore(GAME_ID, score + 100);
        }
        
        setTimeout(() => {
            if(currentLevel < MAX_LEVEL) {
                currentLevel++;
                loadLevel();
            } else {
                gameMessage.innerHTML = `<span style="color:var(--yellow);">TÜM SEVİYELER TAMAMLANDI!</span>`;
            }
        }, 2000);
    } else {
        GameUtils.playSound('error');
        gameMessage.innerHTML = `<span style="color:var(--pink);">HATALI!</span> Cevap ${correct} olmalıydı. Tekrar dene.`;
        setTimeout(() => {
            loadLevel();
        }, 2000);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Lane lines
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    
    // Draw Pins
    pins.forEach(pin => {
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.radius, 0, Math.PI*2);
        ctx.fillStyle = pin.knocked ? 'var(--pink)' : '#fff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Red stripe
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.radius/2, 0, Math.PI*2);
        ctx.fillStyle = '#f00';
        ctx.fill();
    });
    
    // Draw Ball
    if(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = 'var(--cyan)';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Show spin via small dots
        ctx.fillStyle = '#000';
        ctx.beginPath();
        let sAngle = Date.now() * 0.005 * (ball.spin || 0);
        ctx.arc(ball.x + Math.cos(sAngle)*6, ball.y + Math.sin(sAngle)*6, 2, 0, Math.PI*2);
        ctx.fill();
    }
}

function gameLoop() {
    updateInputBars();
    updatePhysics();
    draw();
    requestAnimationFrame(gameLoop);
}

window.onload = initGame;
