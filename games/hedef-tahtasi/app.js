// hedef-tahtasi/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const windDisplay = document.getElementById('windDisplay');
const levelCounter = document.getElementById('levelCounter');
const actionBtn = document.getElementById('actionBtn');
const resultBox = document.getElementById('resultBox');
const gameMessage = document.getElementById('gameMessage');

const hitRegionEl = document.getElementById('hitRegion');
const hitAreaEl = document.getElementById('hitArea');
const hitProbEl = document.getElementById('hitProb');
const hitPointsEl = document.getElementById('hitPoints');

const GAME_ID = 'hedef-tahtasi';
const MAX_TURNS = 10;

let currentTurn = 1;
let totalScore = 0;

// Game States: 'moveX', 'moveY', 'result', 'finished'
let gameState = 'moveX';

let wind = { x: 0, y: 0 };
let crosshair = { x: 0, y: 300, speedX: 5, speedY: 5 };
let lockedPos = { x: 300, y: 300 };
let finalPos = { x: 300, y: 300 };

// Target Definitions
const CENTER = { x: 300, y: 300 };
const TARGET_RINGS = [
    { name: 'Kırmızı (Merkez)', radius: 20, points: 100, color: '#ff2d78', areaProb: 0.01 },
    { name: 'Sarı', radius: 60, points: 50, color: '#ffcc00', areaProb: 0.08 },
    { name: 'Mavi', radius: 120, points: 20, color: '#00f5ff', areaProb: 0.27 },
    { name: 'Beyaz', radius: 200, points: 10, color: '#ffffff', areaProb: 0.64 }
];
const TOTAL_RADIUS = 200;
const TOTAL_AREA_PI = TOTAL_RADIUS * TOTAL_RADIUS; // 40000

function initGame() {
    currentTurn = 1;
    totalScore = 0;
    scoreDisplay.textContent = '0';
    setupEventListeners();
    startTurn();
    requestAnimationFrame(gameLoop);
}

function startTurn() {
    if (currentTurn > MAX_TURNS) {
        endGame();
        return;
    }
    
    levelCounter.textContent = currentTurn;
    gameState = 'moveX';
    actionBtn.textContent = 'X Eksenini Kilitle';
    actionBtn.style.display = 'block';
    resultBox.style.display = 'none';
    gameMessage.textContent = '';
    
    // Rastgele rüzgar -100 ile +100 arası (zorluk için)
    wind.x = (Math.random() * 200 - 100);
    wind.y = (Math.random() * 200 - 100);
    windDisplay.textContent = `${wind.x.toFixed(1)}`;
    
    crosshair.x = 0;
    crosshair.y = 300;
    lockedPos = { x: 300, y: 300 };
    
    // Hız her el biraz daha artsın
    let speed = 4 + (currentTurn * 0.5);
    crosshair.speedX = speed;
    crosshair.speedY = speed;
}

function setupEventListeners() {
    actionBtn.addEventListener('click', handleAction);
}

function handleAction() {
    if (gameState === 'moveX') {
        lockedPos.x = crosshair.x;
        gameState = 'moveY';
        actionBtn.textContent = 'Y Eksenini Kilitle';
        crosshair.y = 0; // reset y
        windDisplay.textContent = `${wind.x.toFixed(1)} / ${wind.y.toFixed(1)}`;
    } else if (gameState === 'moveY') {
        lockedPos.y = crosshair.y;
        actionBtn.style.display = 'none';
        calculateHit();
    }
}

function calculateHit() {
    gameState = 'result';
    
    // Rüzgar sapmasını ekle
    finalPos.x = lockedPos.x + wind.x;
    finalPos.y = lockedPos.y + wind.y;
    
    // Merkeze uzaklık (Collision Detection)
    let dx = finalPos.x - CENTER.x;
    let dy = finalPos.y - CENTER.y;
    let distance = Math.hypot(dx, dy);
    
    let hitRing = null;
    
    // Hangi halkanın içinde? (İçten dışa doğru kontrol et)
    for (let i = 0; i < TARGET_RINGS.length; i++) {
        if (distance <= TARGET_RINGS[i].radius) {
            hitRing = TARGET_RINGS[i];
            break;
        }
    }
    
    showResult(hitRing, distance);
}

function showResult(hitRing, distance) {
    resultBox.style.display = 'block';
    
    if (hitRing) {
        GameUtils.playSound('success');
        hitRegionEl.textContent = hitRing.name;
        hitRegionEl.style.color = hitRing.color;
        
        let probPercent = (hitRing.areaProb * 100).toFixed(0);
        hitAreaEl.textContent = `${(hitRing.areaProb * TOTAL_AREA_PI).toFixed(0)}π`;
        hitProbEl.textContent = `${hitRing.areaProb} (%${probPercent})`;
        hitPointsEl.textContent = `+${hitRing.points}`;
        hitPointsEl.style.color = 'var(--yellow)';
        
        totalScore += hitRing.points;
        scoreDisplay.textContent = totalScore;
        gameMessage.innerHTML = `<span style="color:var(--cyan);">İSABET!</span> Sapma: ${(distance).toFixed(1)}px`;
    } else {
        GameUtils.playSound('error');
        hitRegionEl.textContent = 'KARAVANA (Tahta Dışı)';
        hitRegionEl.style.color = 'var(--pink)';
        hitAreaEl.textContent = '0';
        hitProbEl.textContent = '0';
        hitPointsEl.textContent = '0';
        hitPointsEl.style.color = 'var(--pink)';
        gameMessage.innerHTML = `<span style="color:var(--pink);">ISKA!</span> Hedef tahtasını vuramadın.`;
    }
    
    setTimeout(() => {
        currentTurn++;
        startTurn();
    }, 3000);
}

function endGame() {
    gameState = 'finished';
    actionBtn.style.display = 'none';
    resultBox.style.display = 'none';
    
    let expectedTotal = 16.8 * MAX_TURNS; // 168 puan teorik ortalama
    
    let endMsg = `Simülasyon Tamamlandı.<br>
                  Toplam Puan: <strong style="color:var(--yellow)">${totalScore}</strong><br>
                  Beklenen Değer (EV): ${expectedTotal.toFixed(1)}`;
                  
    if (totalScore > expectedTotal) {
        endMsg += `<br><span style="color:var(--cyan)">Mükemmel! İstatistiksel beklentinin üzerine çıktın.</span>`;
    } else {
        endMsg += `<br><span style="color:var(--pink)">Beklentinin altında kaldın. Zamanlamanı geliştirmelisin.</span>`;
    }
                  
    gameMessage.innerHTML = endMsg;
    
    if (typeof GameUtils !== 'undefined') {
        let currentRecord = GameUtils.getScore(GAME_ID);
        if (totalScore > currentRecord) {
            GameUtils.saveScore(GAME_ID, totalScore);
        }
    }
}

function updatePhysics() {
    if (gameState === 'moveX') {
        crosshair.x += crosshair.speedX;
        if (crosshair.x > canvas.width || crosshair.x < 0) {
            crosshair.speedX *= -1;
        }
    } else if (gameState === 'moveY') {
        crosshair.y += crosshair.speedY;
        if (crosshair.y > canvas.height || crosshair.y < 0) {
            crosshair.speedY *= -1;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Target Rings (Dıştan içe doğru çizilir ki küçükler üstte kalsın)
    for (let i = TARGET_RINGS.length - 1; i >= 0; i--) {
        let ring = TARGET_RINGS[i];
        ctx.beginPath();
        ctx.arc(CENTER.x, CENTER.y, ring.radius, 0, Math.PI * 2);
        ctx.fillStyle = ring.color;
        // Dış çizgi siyah olsun
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }
    
    // Beklenen değer (Expected Value) bilgisi ekrana sabit yazdırılabilir
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px "Share Tech Mono"';
    ctx.fillText('E(X) = 16.8 Puan/Atış', 10, 20);
    
    // Draw Crosshair lines
    if (gameState === 'moveX' || gameState === 'moveY' || gameState === 'result') {
        let cx = gameState === 'moveX' ? crosshair.x : lockedPos.x;
        let cy = gameState === 'moveY' ? crosshair.y : (gameState === 'moveX' ? CENTER.y : lockedPos.y); // If moveX, keep y in center for visualization, but visually we just draw a line
        
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.8)';
        ctx.lineWidth = 2;
        
        // Dikey Kırmızı/Cyan çizgi (X ekseni)
        if (gameState === 'moveX' || gameState === 'moveY' || gameState === 'result') {
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, canvas.height);
            ctx.stroke();
        }
        
        // Yatay çizgi (Y ekseni)
        if (gameState === 'moveY' || gameState === 'result') {
            ctx.beginPath();
            ctx.moveTo(0, cy);
            ctx.lineTo(canvas.width, cy);
            ctx.stroke();
        }
        
        // Kilitlenen noktayı göster
        if (gameState === 'moveY' || gameState === 'result') {
            ctx.beginPath();
            ctx.arc(cx, cy, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'var(--cyan)';
            ctx.fill();
        }
    }
    
    // Draw Final Hit Point with wind offset
    if (gameState === 'result') {
        ctx.beginPath();
        ctx.arc(finalPos.x, finalPos.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--yellow)';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Sapma (Rüzgar) Çizgisi
        ctx.beginPath();
        ctx.moveTo(lockedPos.x, lockedPos.y);
        ctx.lineTo(finalPos.x, finalPos.y);
        ctx.strokeStyle = 'var(--pink)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function gameLoop() {
    updatePhysics();
    draw();
    requestAnimationFrame(gameLoop);
}

window.onload = initGame;
