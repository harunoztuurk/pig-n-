// radar-takip/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('levelCounter');
const targetAngleDisplay = document.getElementById('targetAngleDisplay');
const equationDisplay = document.getElementById('equationDisplay');
const gameMessage = document.getElementById('gameMessage');
const buttonsRow1 = document.getElementById('buttonsRow1');
const buttonsRow2 = document.getElementById('buttonsRow2');
const lockBtn = document.getElementById('lockBtn');

const GAME_ID = 'radar-takip';
const MAX_LEVEL = 50;

let currentLevel = 1;
let targetAngle = 0; // in degrees
let currentAngle = 0; // in degrees
let radarRadius = 180;
const CENTER = { x: 200, y: 200 };

function initGame() {
    currentLevel = 1;
    setupButtons();
    loadLevel();
    requestAnimationFrame(gameLoop);
}

function normalizeAngle(angle) {
    let a = angle % 360;
    if (a < 0) a += 360;
    return a;
}

function loadLevel() {
    currentAngle = 0;
    
    // Generate target angle based on level difficulty
    // Make sure target is reachable by simple additions
    // Let's just pick a multiple of 15
    targetAngle = Math.floor(Math.random() * 24) * 15;
    if (targetAngle === 0) targetAngle = 180; // Avoid 0
    
    // Radian vs Degree display for target
    let useRadianForTarget = Math.random() > 0.5 && currentLevel > 5;
    
    if (useRadianForTarget) {
        let frac = formatRadian(targetAngle);
        targetAngleDisplay.textContent = `${frac} rad`;
    } else {
        targetAngleDisplay.textContent = `${targetAngle}°`;
    }
    
    levelCounter.textContent = currentLevel;
    gameMessage.textContent = '';
    
    generateCommandButtons();
    updateEquation();
}

function formatRadian(deg) {
    // Convert deg to frac of PI. e.g. 90 -> PI/2
    let p = deg / 180;
    if (p === 0) return "0";
    if (p === 1) return "π";
    if (p === 2) return "2π";
    
    // find fraction
    let gcd = function(a, b) {
        if (!b) return a;
        return gcd(b, a % b);
    };
    
    let g = gcd(deg, 180);
    let num = deg / g;
    let den = 180 / g;
    
    let numStr = num === 1 ? "π" : `${num}π`;
    return `${numStr}/${den}`;
}

function generateCommandButtons() {
    buttonsRow1.innerHTML = '';
    buttonsRow2.innerHTML = '';
    
    // Havuzdan 4-5 buton seç
    let pool = [
        { val: 15, text: '+15°' },
        { val: 30, text: '+30°' },
        { val: 45, text: '+45°' },
        { val: 90, text: '+90°' },
        { val: -15, text: '-15°' },
        { val: -30, text: '-30°' },
        { val: -45, text: '-45°' },
        { val: -90, text: '-90°' }
    ];
    
    if (currentLevel > 10) {
        pool.push(
            { val: 45, text: '+π/4' },
            { val: 90, text: '+π/2' },
            { val: 180, text: '+π' },
            { val: -45, text: '-π/4' },
            { val: -90, text: '-π/2' }
        );
    }
    
    // Karıştır
    pool.sort(() => Math.random() - 0.5);
    
    let numBtns = Math.min(4 + Math.floor(currentLevel / 10), 8); // max 8 buttons
    let selected = pool.slice(0, numBtns);
    
    selected.forEach((btn, idx) => {
        let el = document.createElement('button');
        el.className = 'cmd-btn';
        el.textContent = btn.text;
        el.onclick = () => {
            currentAngle = normalizeAngle(currentAngle + btn.val);
            GameUtils.playSound('click');
            updateEquation();
        };
        
        if (idx < 4) buttonsRow1.appendChild(el);
        else buttonsRow2.appendChild(el);
    });
}

function updateEquation() {
    let rad = currentAngle * Math.PI / 180;
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    
    // Handle floating point imprecision
    if (Math.abs(cos) < 0.0001) cos = 0;
    if (Math.abs(sin) < 0.0001) sin = 0;
    
    equationDisplay.innerHTML = `
        Açı (θ) = ${currentAngle}°<br>
        x = cos(${currentAngle}°) = ${cos.toFixed(2)}<br>
        y = sin(${currentAngle}°) = ${sin.toFixed(2)}
    `;
}

function setupButtons() {
    lockBtn.addEventListener('click', () => {
        if (currentAngle === targetAngle) {
            // Başarılı
            GameUtils.playSound('success');
            gameMessage.innerHTML = `<span style="color:var(--cyan);">HEDEFE KİLİTLENDİ!</span>`;
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
            // Başarısız
            GameUtils.playSound('error');
            gameMessage.innerHTML = `<span style="color:var(--pink);">ISKA!</span> Mevcut açı: ${currentAngle}°, Hedef: ${targetAngle}°`;
            setTimeout(() => {
                gameMessage.innerHTML = '';
            }, 2000);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Grid Lines (Crosshair)
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CENTER.x, 0); ctx.lineTo(CENTER.x, 400); // Y
    ctx.moveTo(0, CENTER.y); ctx.lineTo(400, CENTER.y); // X
    ctx.stroke();
    
    // Draw Unit Circles
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, radarRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, radarRadius / 2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw Target Angle (as a red dot/line)
    let tRad = -targetAngle * Math.PI / 180; // Negative because canvas Y is down, but math Y is up. To map 90 degrees to UP, we negate.
    let tx = CENTER.x + radarRadius * Math.cos(tRad);
    let ty = CENTER.y + radarRadius * Math.sin(tRad);
    
    ctx.strokeStyle = 'rgba(255, 45, 120, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CENTER.x, CENTER.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--pink)';
    ctx.fill();
    
    // Draw Current Radar Line
    let cRad = -currentAngle * Math.PI / 180;
    let cx = CENTER.x + radarRadius * Math.cos(cRad);
    let cy = CENTER.y + radarRadius * Math.sin(cRad);
    
    ctx.strokeStyle = 'var(--cyan)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(CENTER.x, CENTER.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    
    // Draw Current Point
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--yellow)';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw Arc for angle
    if (currentAngle > 0) {
        ctx.beginPath();
        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        // Canvas uses positive angles clockwise. Our cRad is negative, so it's counterclockwise visually.
        // To draw an arc from 0 to -currentAngle:
        ctx.arc(CENTER.x, CENTER.y, 40, 0, cRad, true);
        ctx.strokeStyle = 'var(--yellow)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

window.onload = initGame;
