document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        mazeGrid: document.getElementById('mazeGrid'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn'),
        resetBtn: document.getElementById('resetBtn')
    };

    // State Variables
    let playerPos = { r: 0, c: 0 };
    let playerEl = null;

    function loadLevel(index) {
        if (index >= totalLevels) {
            elements.endModal.classList.add('active');
            return;
        }

        const level = levelsData[index];
        elements.levelInfo.textContent = `STG - 0${index + 1}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.textContent = level.questionText;
        
        elements.feedbackMessage.textContent = '';
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.textContent = level.hint;

        renderMaze(level);
    }

    function renderMaze(level) {
        elements.mazeGrid.innerHTML = '';
        // Grid CSS ayarı
        elements.mazeGrid.style.gridTemplateColumns = `repeat(${level.columns}, 50px)`;
        elements.mazeGrid.style.width = `${level.columns * 51}px`; // 1px gap payı

        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.columns; c++) {
                const val = level.grid[r][c];
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                if (val === 'W') cell.classList.add('wall');
                else if (val === 'G') cell.classList.add('goal');
                else cell.classList.add('empty');

                if (val === 'S') {
                    playerPos = { r, c };
                }

                // Oklar veya metin içeriği
                if (['↑', '↓', '→', '←'].includes(val)) {
                    const span = document.createElement('span');
                    span.className = 'cell-content';
                    span.textContent = val;
                    cell.appendChild(span);
                }

                elements.mazeGrid.appendChild(cell);
            }
        }

        // Oyuncu Küresi
        playerEl = document.createElement('div');
        playerEl.className = 'player';
        updatePlayerUI();
        elements.mazeGrid.appendChild(playerEl);
    }

    function updatePlayerUI() {
        // Player'ın absolute lokasyonunu hücreye göre ayarla. Grid template col 50px + 1px gap = 51px
        const cellSize = 51;
        const offset = 10; // (50 - 30) / 2 = 10 (ortalamak için)
        
        playerEl.style.left = `${(playerPos.c * cellSize) + offset}px`;
        playerEl.style.top = `${(playerPos.r * cellSize) + offset}px`;
    }

    // Hareket Motoru
    function handleMove(dr, dc) {
        const level = levelsData[currentLevelIndex];
        const currentVal = level.grid[playerPos.r][playerPos.c];

        // 1. Arrow Maze Kuralı: Eğer bulunduğum yerde ok varsa, SADECE o yöne gidebilirim
        if (level.type === 'arrow') {
            if (currentVal === '↑' && (dr !== -1 || dc !== 0)) return showError("Sadece ok yönünde ilerleyebilirsiniz!");
            if (currentVal === '↓' && (dr !== 1 || dc !== 0)) return showError("Sadece ok yönünde ilerleyebilirsiniz!");
            if (currentVal === '→' && (dr !== 0 || dc !== 1)) return showError("Sadece ok yönünde ilerleyebilirsiniz!");
            if (currentVal === '←' && (dr !== 0 || dc !== -1)) return showError("Sadece ok yönünde ilerleyebilirsiniz!");
        }

        // 2. Ice Slider Kuralı (Kayma Mekaniği)
        if (level.type === 'ice') {
            slidePlayer(dr, dc, level);
        } else {
            // Normal (Adım adım) Hareket
            const nr = playerPos.r + dr;
            const nc = playerPos.c + dc;
            
            if (isValidMove(nr, nc, level)) {
                playerPos.r = nr;
                playerPos.c = nc;
                updatePlayerUI();
                checkWinCondition();
            } else {
                showError("Duvara çarptınız!");
            }
        }
    }

    // Ice Slider için recursive/loop kayma
    function slidePlayer(dr, dc, level) {
        let nr = playerPos.r + dr;
        let nc = playerPos.c + dc;
        
        // İlk adımda duvar varsa
        if (!isValidMove(nr, nc, level)) {
            return showError("O yönde hemen duvar var.");
        }

        // Kayabildiği kadar kaysın
        const slideInterval = setInterval(() => {
            let nextR = playerPos.r + dr;
            let nextC = playerPos.c + dc;

            if (isValidMove(nextR, nextC, level)) {
                playerPos.r = nextR;
                playerPos.c = nextC;
                updatePlayerUI();
                
                // Kayarken hedefin üzerine gelirse doğrudan bitir
                if (level.grid[playerPos.r][playerPos.c] === 'G') {
                    clearInterval(slideInterval);
                    checkWinCondition();
                }
            } else {
                // Duvara veya sınıra çarptık, dur
                clearInterval(slideInterval);
            }
        }, 100); // 100ms hızla kare kare kaydır
    }

    function isValidMove(r, c, level) {
        if (r < 0 || r >= level.rows || c < 0 || c >= level.columns) return false;
        if (level.grid[r][c] === 'W') return false;
        return true;
    }

    function checkWinCondition() {
        const level = levelsData[currentLevelIndex];
        if (level.grid[playerPos.r][playerPos.c] === 'G') {
            elements.feedbackMessage.textContent = "HEDEF ULAŞILDI!";
            elements.feedbackMessage.className = "feedback-message success";
            
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 1000);
        }
    }

    function showError(msg) {
        elements.feedbackMessage.textContent = msg;
        elements.feedbackMessage.className = "feedback-message error";
        // Mesajı biraz sonra temizle
        setTimeout(() => {
            if (elements.feedbackMessage.className.includes("error")) {
                elements.feedbackMessage.textContent = "";
            }
        }, 1500);
    }

    // Klavye Dinleyicisi
    window.addEventListener('keydown', (e) => {
        // Ok tuşları scroll yapmasın
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleMove(-1, 0);
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleMove(1, 0);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleMove(0, 1);
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleMove(0, -1);
    });

    // Mobil D-Pad Butonları Dinleyicisi
    document.getElementById('btnUp').addEventListener('click', () => handleMove(-1, 0));
    document.getElementById('btnDown').addEventListener('click', () => handleMove(1, 0));
    document.getElementById('btnRight').addEventListener('click', () => handleMove(0, 1));
    document.getElementById('btnLeft').addEventListener('click', () => handleMove(0, -1));

    elements.resetBtn.addEventListener('click', () => {
        loadLevel(currentLevelIndex); // Yeniden yükleyerek başlangıca atar
    });

    elements.hintBtn.addEventListener('click', () => {
        elements.hintContainer.style.display = 'block';
    });

    elements.restartBtn.addEventListener('click', () => {
        elements.endModal.classList.remove('active');
        currentLevelIndex = 0;
        loadLevel(0);
    });

    // Başlangıç
    loadLevel(currentLevelIndex);
});
