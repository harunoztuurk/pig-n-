document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        shapeLayer: document.getElementById('shapeLayer'),
        canvas: document.getElementById('laserCanvas'),
        verifyBtn: document.getElementById('verifyBtn'),
        resetBtn: document.getElementById('resetBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn')
    };

    const ctx = elements.canvas.getContext('2d');
    let lines = []; // Lazer çizgileri dizisi {A:{x,y}, B:{x,y}}
    let isDrawing = false;
    let startPoint = null;
    let mousePos = null;

    // Saat rakamlarının fiziksel merkez koordinatları
    const numberCoords = {};

    function loadLevel(index) {
        if (index >= totalLevels) {
            elements.endModal.classList.add('active');
            return;
        }

        const level = levelsData[index];
        elements.levelInfo.textContent = `Kesim = 0${index + 1}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.innerHTML = `${level.questionText}<br><span style="color:#ff003c;font-size:0.9em;">(Kalan Hak: <span id="linesLeft">${level.linesAllowed}</span>)</span>`;
        
        elements.feedbackMessage.textContent = '';
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.textContent = level.hint;

        lines = [];
        elements.shapeLayer.innerHTML = '';
        ctx.clearRect(0, 0, 500, 500);

        // Saat kadranını yerleştir
        const cx = 200, cy = 200, radius = 160;
        level.numbers.forEach(num => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            
            // X ve Y canvas boyutlarıyla uyuşması için offset (500x500 canvas vs 400x400 container. Canvas left:0, top:0)
            const numDiv = document.createElement('div');
            numDiv.className = 'clock-number';
            numDiv.textContent = num;
            // Canvas padding/offset: cx=200, container=400. 
            // ShapeLayer ve Canvas ayni boyutta (400x400).
            numDiv.style.left = `${x}px`;
            numDiv.style.top = `${y}px`;
            
            elements.shapeLayer.appendChild(numDiv);

            numberCoords[num] = { x: x, y: y };
        });
        
        // Canvas'ı 400x400'e kilitle
        elements.canvas.width = 400;
        elements.canvas.height = 400;

        updateCanvas();
    }

    // --- CANVAS DRAWING ---
    elements.canvas.addEventListener('mousedown', (e) => {
        const level = levelsData[currentLevelIndex];
        if (lines.length >= level.linesAllowed) return; // Çizgi hakkı doldu

        isDrawing = true;
        const rect = elements.canvas.getBoundingClientRect();
        startPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    elements.canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = elements.canvas.getBoundingClientRect();
        mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        updateCanvas();
    });

    elements.canvas.addEventListener('mouseup', (e) => {
        if (!isDrawing) return;
        isDrawing = false;
        lines.push({ A: startPoint, B: mousePos });
        startPoint = null;
        updateUI();
        updateCanvas();
    });

    function updateCanvas() {
        ctx.clearRect(0, 0, 400, 400);

        // Kaydedilmiş lazer çizgileri
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ff003c';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff003c';
        
        lines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.A.x, line.A.y);
            ctx.lineTo(line.B.x, line.B.y);
            ctx.stroke();
        });

        // Çizilen aktif lazer (Hover)
        if (isDrawing && startPoint && mousePos) {
            ctx.strokeStyle = 'rgba(255, 0, 60, 0.5)';
            ctx.beginPath();
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
    }

    function updateUI() {
        const level = levelsData[currentLevelIndex];
        const span = document.getElementById('linesLeft');
        if (span) {
            span.textContent = level.linesAllowed - lines.length;
        }
    }

    // --- VERIFICATION ALGORITHM ---
    function ccw(A, B, C) {
        return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    }

    // İki çizgi kesişiyor mu?
    function intersect(l1A, l1B, l2A, l2B) {
        return ccw(l1A, l2A, l2B) != ccw(l1B, l2A, l2B) && ccw(l1A, l1B, l2A) != ccw(l1A, l1B, l2B);
    }

    function verifyDissection() {
        const level = levelsData[currentLevelIndex];
        
        // Eğer hiç lazer atılmadıysa red
        if (lines.length === 0) {
            return showFeedback("Henüz bir lazer kesimi yapmadınız.", "error");
        }

        // 1'den 12'ye kadar sayıları düğüm (node) kabul eden bir bağlantı grafı (graph) kur
        const nodes = level.numbers;
        const adjacency = {};
        nodes.forEach(n => adjacency[n] = []);

        // Her sayı çifti (O(N^2) = 144 işlem, tarayıcı için anlık) arasında bir doğru hayal et.
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const p1 = numberCoords[n1];
                const p2 = numberCoords[n2];

                let isBlocked = false;
                // Bu hayali doğrumuz, çizdiğimiz lazerlerin HERHANGİ BİRİYLE kesişiyor mu?
                for (let line of lines) {
                    if (intersect(p1, p2, line.A, line.B)) {
                        isBlocked = true;
                        break;
                    }
                }

                if (!isBlocked) {
                    // Lazer bu iki sayının ortasından GEÇMİYOR, demek ki aynı "parça"/grup içindeler. Sınır yok.
                    adjacency[n1].push(n2);
                    adjacency[n2].push(n1);
                }
            }
        }

        // Connected Components (Bağlı Gruplar) bul
        const visited = new Set();
        const groups = [];

        nodes.forEach(n => {
            if (!visited.has(n)) {
                let currentGroupDetails = [];
                // BFS / DFS
                let queue = [n];
                visited.add(n);
                while(queue.length > 0) {
                    let curr = queue.shift();
                    currentGroupDetails.push(curr);
                    adjacency[curr].forEach(neighbor => {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            queue.push(neighbor);
                        }
                    });
                }
                groups.push(currentGroupDetails);
            }
        });

        // Grupların toplamları level.targetSum yapıyor mu kontrol et
        console.log("Oluşan Parçalar (Gruplar): ", groups);

        let isCorrect = true;
        let sums = [];
        groups.forEach(group => {
            const sum = group.reduce((a, b) => a + b, 0);
            sums.push(sum);
            if (sum !== level.targetSum) {
                isCorrect = false;
            }
        });

        if (isCorrect) {
            showFeedback(`ONAYLANDI: Parçaların toplamları [${sums.join(', ')}].`, "success");
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 3000);
        } else {
            showFeedback(`BAŞARISIZ. Parça toplamları: [${sums.join(', ')}]. Sizi ${level.targetSum} kurtarır.`, "error");
        }
    }

    function showFeedback(msg, type) {
        elements.feedbackMessage.textContent = msg;
        elements.feedbackMessage.className = `feedback-message ${type}`;
    }

    // Events
    elements.resetBtn.addEventListener('click', () => { lines = []; updateUI(); updateCanvas(); showFeedback("", "error"); });
    elements.verifyBtn.addEventListener('click', verifyDissection);
    elements.hintBtn.addEventListener('click', () => elements.hintContainer.style.display = 'block');
    elements.restartBtn.addEventListener('click', () => {
        elements.endModal.classList.remove('active');
        currentLevelIndex = 0;
        loadLevel(0);
    });

    loadLevel(currentLevelIndex);
});
