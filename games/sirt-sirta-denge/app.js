// sirt-sirta-denge/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const equationDisplay = document.getElementById('equationDisplay');
const levelCounter = document.getElementById('levelCounter');
const aiForceBar = document.getElementById('aiForceBar');
const playerForceBar = document.getElementById('playerForceBar');
const aiForceVal = document.getElementById('aiForceVal');
const playerForceVal = document.getElementById('playerForceVal');
const gameMessage = document.getElementById('gameMessage');

const GAME_ID = 'sirt-sirta-denge';
const MAX_LEVEL = 50;

let currentLevel = 1;
let gameState = 'idle'; // idle, playing, over, won

// Forces
const MAX_FORCE = 100;
let forceAI = 50;
let forcePlayer = 0;
let targetForceAI = 50;

// Tolerance for balance
let tolerance = 15; // Decreases as level goes up

// Physics & Positions
let positionX = 100; // group position
let ballY = 150;
let ballVelocityY = 0;
let isSpacePressed = false;

function initGame() {
    currentLevel = 1;
    loadLevel();
    setupEventListeners();
    requestAnimationFrame(gameLoop);
}

function loadLevel() {
    gameState = 'playing';
    positionX = 100;
    ballY = 150;
    ballVelocityY = 0;
    forcePlayer = 0;
    forceAI = 0; // Start at 0 so it ramps up, giving player time
    targetForceAI = 50;
    isSpacePressed = false;
    
    levelCounter.textContent = currentLevel;
    gameMessage.textContent = '';
    
    // Zorluk ayarları
    tolerance = Math.max(5, 15 - (currentLevel * 0.2));
}

function setupEventListeners() {
    const press = (e) => {
        if (e.code === 'Space') {
            isSpacePressed = true;
            e.preventDefault();
        }
    };
    
    const release = (e) => {
        if (e.code === 'Space') {
            isSpacePressed = false;
        }
    };
    
    window.addEventListener('keydown', press);
    window.addEventListener('keyup', release);
    
    // Dokunmatik destek
    canvas.addEventListener('touchstart', (e) => { isSpacePressed = true; e.preventDefault(); }, {passive: false});
    canvas.addEventListener('touchend', (e) => { isSpacePressed = false; }, {passive: false});
}

function updatePhysics() {
    if (gameState !== 'playing') {
        if (gameState === 'over') {
            ballY += ballVelocityY;
            ballVelocityY += 0.5; // gravity
            if (ballY > canvas.height - 20) ballY = canvas.height - 20;
        }
        return;
    }
    
    // Update Player Force
    if (isSpacePressed) {
        forcePlayer += 2.0; // Increase force
        if (forcePlayer > MAX_FORCE) forcePlayer = MAX_FORCE;
    } else {
        forcePlayer -= 1.5; // Decrease force
        if (forcePlayer < 0) forcePlayer = 0;
    }
    
    // Update AI Force randomly but smoothly
    if (Math.random() < 0.05) { // Change target force frequently
        let fluctuation = (currentLevel / MAX_LEVEL) * 40; // Max fluctuation increases with level
        targetForceAI = 50 + (Math.random() * fluctuation - fluctuation/2);
        if (targetForceAI > MAX_FORCE) targetForceAI = MAX_FORCE;
        if (targetForceAI < 20) targetForceAI = 20; // AI doesn't drop to 0
    }
    
    // Smooth transition for AI
    forceAI += (targetForceAI - forceAI) * 0.1;
    
    // Calculate Difference
    let diff = Math.abs(forcePlayer - forceAI);
    
    // Check Balance
    if (diff > tolerance) {
        // Unbalanced! Drop ball.
        gameState = 'over';
        GameUtils.playSound('error');
        gameMessage.innerHTML = `<span style="color:var(--pink);">DENGE BOZULDU!</span> Top düştü. (Fark: ${diff.toFixed(1)} N > Tolerans: ${tolerance.toFixed(1)} N)`;
        setTimeout(() => {
            loadLevel(); // Restart level
        }, 3000);
    } else {
        // Balanced, move forward
        positionX += 1.0; // Speed of walking
        
        if (positionX >= 700) {
            // Level Complete
            gameState = 'won';
            GameUtils.playSound('success');
            gameMessage.innerHTML = `<span style="color:var(--cyan);">SEVİYE ${currentLevel} TAMAMLANDI!</span>`;
            
            if (typeof GameUtils !== 'undefined') {
                let currentScore = GameUtils.getScore(GAME_ID);
                GameUtils.saveScore(GAME_ID, currentScore + 100);
            }
            
            setTimeout(() => {
                if (currentLevel < MAX_LEVEL) {
                    currentLevel++;
                    loadLevel();
                } else {
                    gameMessage.innerHTML = `<span style="color:var(--yellow);">TÜM SEVİYELER TAMAMLANDI!</span> Simülasyon bitti.`;
                }
            }, 2000);
        }
    }
    
    updateUI(diff);
}

function updateUI(diff) {
    aiForceBar.style.width = `${forceAI}%`;
    playerForceBar.style.width = `${forcePlayer}%`;
    
    aiForceVal.textContent = `${forceAI.toFixed(1)} N`;
    playerForceVal.textContent = `${forcePlayer.toFixed(1)} N`;
    
    equationDisplay.textContent = `|F_player - F_ai| = ${diff.toFixed(1)} N`;
    
    if (diff > tolerance) {
        equationDisplay.style.color = 'var(--pink)';
    } else if (diff > tolerance * 0.7) {
        equationDisplay.style.color = '#ff9900'; // Warning
    } else {
        equationDisplay.style.color = 'var(--cyan)';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Floor
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 200, canvas.width, canvas.height - 200);
    
    // Draw Finish Line
    ctx.strokeStyle = 'var(--yellow)';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(700, 50);
    ctx.lineTo(700, 200);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'var(--yellow)';
    ctx.font = '16px "Share Tech Mono"';
    ctx.fillText('BİTİŞ', 680, 40);
    
    // Draw Characters
    // AI Character (Left)
    ctx.fillStyle = 'var(--pink)';
    ctx.fillRect(positionX - 40, 100, 30, 100);
    
    // Player Character (Right)
    ctx.fillStyle = 'var(--cyan)';
    ctx.fillRect(positionX + 10, 100, 30, 100);
    
    // Draw Ball
    ctx.beginPath();
    ctx.arc(positionX, ballY, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--yellow)';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw Forces Arrows
    if (gameState === 'playing') {
        // AI arrow pushing right
        drawArrow(positionX - 40, 150, positionX - 15, 150, 'var(--pink)', forceAI / 5);
        // Player arrow pushing left
        drawArrow(positionX + 40, 150, positionX + 15, 150, 'var(--cyan)', forcePlayer / 5);
    }
}

function drawArrow(fromx, fromy, tox, toy, color, width) {
    let headlen = 10; // length of head in pixels
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, width);
    ctx.stroke();
}

function gameLoop() {
    updatePhysics();
    draw();
    requestAnimationFrame(gameLoop);
}

window.onload = initGame;
