// cisim-kosegeni/app.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelCounter = document.getElementById('levelCounter');
const edgesDisplay = document.getElementById('edgesDisplay');
const answerInput = document.getElementById('answerInput');
const checkBtn = document.getElementById('checkBtn');
const gameMessage = document.getElementById('gameMessage');

const GAME_ID = 'cisim-kosegeni';
const MAX_LEVEL = 50;

let currentLevel = 1;

// 3D Box Parameters
let boxA = 0, boxB = 0, boxC = 0;
let answerD = 0;

// Camera & Rotation
let rotX = -0.5; // rad
let rotY = 0.5; // rad
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Base Quads for a^2 + b^2 + c^2 = d^2
const pythagoreanQuads = [
    [2, 3, 6, 7],
    [1, 4, 8, 9],
    [2, 6, 9, 11],
    [3, 4, 12, 13],
    [2, 10, 11, 15],
    [1, 12, 12, 17],
    [4, 13, 16, 21],
    [8, 9, 12, 17],
    [6, 10, 15, 19],
    [12, 15, 16, 25]
];

function initGame() {
    currentLevel = 1;
    setupEvents();
    loadLevel();
    requestAnimationFrame(renderLoop);
}

function loadLevel() {
    // Select a random quad and scale it based on level
    let base = pythagoreanQuads[Math.floor(Math.random() * pythagoreanQuads.length)];
    let multiplier = 1 + Math.floor(currentLevel / 10);
    
    // Shuffle a,b,c so it's not always the same order
    let edges = [base[0] * multiplier, base[1] * multiplier, base[2] * multiplier];
    edges.sort(() => Math.random() - 0.5);
    
    boxA = edges[0];
    boxB = edges[1]; // y-axis height
    boxC = edges[2];
    answerD = base[3] * multiplier;
    
    edgesDisplay.textContent = `a=${boxA}, b=${boxB}, c=${boxC}`;
    levelCounter.textContent = currentLevel;
    gameMessage.textContent = '';
    answerInput.value = '';
    
    // Reset rotation slightly
    rotX = -0.3;
    rotY = 0.5;
}

function setupEvents() {
    checkBtn.addEventListener('click', () => {
        let val = parseFloat(answerInput.value);
        if (isNaN(val)) return;
        
        if (val === answerD) {
            // Correct
            GameUtils.playSound('success');
            gameMessage.innerHTML = `<span style="color:var(--cyan);">DOĞRU! d = ${answerD}</span>`;
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
            // Incorrect
            GameUtils.playSound('error');
            gameMessage.innerHTML = `<span style="color:var(--pink);">HATALI!</span> Tekrar hesapla.`;
            setTimeout(() => { gameMessage.innerHTML = ''; }, 2000);
        }
    });
    
    // Orbit Camera Controls
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let dx = e.clientX - lastMouseX;
        let dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        rotY += dx * 0.01;
        rotX += dy * 0.01;
    });
    window.addEventListener('mouseup', () => isDragging = false);
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        e.preventDefault();
    }, {passive: false});
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        let dx = e.touches[0].clientX - lastMouseX;
        let dy = e.touches[0].clientY - lastMouseY;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        
        rotY += dx * 0.01;
        rotX += dy * 0.01;
        e.preventDefault();
    }, {passive: false});
    window.addEventListener('touchend', () => isDragging = false);
}

// 3D Engine Math
function project3D(x, y, z) {
    // 1. Rotate around X axis
    let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
    let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
    
    // 2. Rotate around Y axis
    let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
    let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
    
    let y2 = y1;
    
    // 3. Perspective Projection
    let focalLength = 400;
    let zOffset = 300; // push box away from camera
    
    let scale = focalLength / (z2 + zOffset);
    
    return {
        x: x2 * scale + canvas.width / 2,
        y: y2 * scale + canvas.height / 2,
        z: z2 // for z-sorting if needed
    };
}

function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Idle rotation if not dragging
    if (!isDragging) {
        rotY += 0.005;
    }
    
    // Box dimensions scaled for display
    // Scale max dimension to fit in ~150 pixels
    let maxEdge = Math.max(boxA, boxB, boxC);
    let visualScale = 120 / maxEdge;
    
    let hw = (boxA * visualScale) / 2; // half width (x)
    let hh = (boxB * visualScale) / 2; // half height (y)
    let hd = (boxC * visualScale) / 2; // half depth (z)
    
    // 8 Vertices
    let verts = [
        {x: -hw, y: -hh, z: -hd}, // 0: Top-Left-Front
        {x: hw, y: -hh, z: -hd},  // 1: Top-Right-Front
        {x: hw, y: hh, z: -hd},   // 2: Bottom-Right-Front
        {x: -hw, y: hh, z: -hd},  // 3: Bottom-Left-Front
        {x: -hw, y: -hh, z: hd},  // 4: Top-Left-Back
        {x: hw, y: -hh, z: hd},   // 5: Top-Right-Back
        {x: hw, y: hh, z: hd},    // 6: Bottom-Right-Back
        {x: -hw, y: hh, z: hd}    // 7: Bottom-Left-Back
    ];
    
    // Project all vertices
    let pVerts = verts.map(v => project3D(v.x, v.y, v.z));
    
    // Edges (Pairs of vertex indices)
    let edges = [
        [0,1], [1,2], [2,3], [3,0], // Front face
        [4,5], [5,6], [6,7], [7,4], // Back face
        [0,4], [1,5], [2,6], [3,7]  // Connecting edges
    ];
    
    // Draw Box Wireframe
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
    ctx.lineWidth = 2;
    edges.forEach(e => {
        let p1 = pVerts[e[0]];
        let p2 = pVerts[e[1]];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    });
    
    // Draw Space Diagonal (Cisim Köşegeni)
    // From Bottom-Left-Front (3) to Top-Right-Back (5)
    let d1 = pVerts[3];
    let d2 = pVerts[5];
    
    ctx.strokeStyle = 'var(--pink)';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'var(--pink)';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(d1.x, d1.y);
    ctx.lineTo(d2.x, d2.y);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw Nodes for diagonal
    ctx.fillStyle = 'var(--yellow)';
    ctx.beginPath(); ctx.arc(d1.x, d1.y, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(d2.x, d2.y, 4, 0, Math.PI*2); ctx.fill();

    requestAnimationFrame(renderLoop);
}

window.onload = initGame;
