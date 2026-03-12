// VERİ AVI OYUNU
const THIS_GAME_ID = 'veri-avi';
const GRID_SIZE = 5;
const BUFFER_SIZE = 5;
const PI_DIGITS = [
    3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4,
    6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7,
    1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4,
    4, 5, 9, 2, 3, 0, 7, 8, 1, 6, 4, 0, 6, 2, 8, 6, 2, 0, 8, 9,
    9, 8, 6, 2, 8, 0, 3, 4, 8, 2, 5, 3, 4, 2, 1, 1, 7, 0, 6, 7,
    9, 8, 2, 1, 4, 8, 0, 8, 6, 5, 1, 3, 2, 8, 2, 3, 0, 6, 6, 4,
    7, 0, 9, 3, 8, 4, 4, 6, 0, 9, 5, 5, 0, 5, 8, 2, 2, 3, 1, 7
]; // Uzatılmış Pi Dizisi

// Durum Değişkenleri
let matrix = [];
let buffer = [];
let selectedCells = [];
let selectionMode = 'row'; // 'row' (Yatay Satır) veya 'col' (Dikey Sütun)
let activeLineIndex = 0; // İlk hamle her zaman en üst satırdır
let gameOver = false;
let score = 0;
let currentIndex = 0; // Oyuncunun şu an Pi dizisinde nerede olduğu (Örn 0 ise 3 arıyor, 1 ise 1 arıyor)
let currentCombo = 10; // Kazanılacak combo puan (Her doğru adımda artacak)
let lastClickTime = 0; // Hız bonusu için son tıklama zamanı
let dynamiteCount = 1;
let gameStarted = false;

// Zamanlayıcı Değişkenleri
let timerInterval = null;
let secondsElapsed = 0;

function initGame() {
    matrix = [];
    buffer = [];
    selectedCells = [];
    selectionMode = 'row';
    activeLineIndex = 0;
    gameOver = false;
    score = 0;
    currentIndex = 0;
    currentCombo = 10;
    dynamiteCount = 1;
    gameStarted = false;

    // Süreyi Sıfırla (Ama henüz başlatma)
    secondsElapsed = 0;
    updateTimerDisplay();
    clearInterval(timerInterval);

    // Değerleri UI'a yansıt
    const dynamiteEl = document.getElementById('dynamiteCount');
    if (dynamiteEl) dynamiteEl.innerText = dynamiteCount;

    generateMatrix();
    updateProgressUI();

    renderMatrix();
    renderBuffer();
    renderLocalLeaderboard();

    const startModal = document.getElementById('piStartModal');
    if (startModal) {
        startModal.style.display = 'flex';
    }
}

function startRealGame() {
    const startModal = document.getElementById('piStartModal');
    if (startModal) startModal.style.display = 'none';

    gameStarted = true;
    lastClickTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
} function updateTimerDisplay() {
    const timerDisplay = document.getElementById('gameTimerDisplay');
    if (timerDisplay) {
        const m = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
        const s = String(secondsElapsed % 60).padStart(2, '0');
        timerDisplay.innerText = `${m}:${s}`;
    }
}

function renderLocalLeaderboard() {
    const listEl = document.getElementById('leaderboardList');
    if (!listEl) return;

    if (typeof GameUtils !== 'undefined' && GameUtils.getLeaderboard) {
        const board = GameUtils.getLeaderboard(THIS_GAME_ID);
        listEl.innerHTML = '';

        if (board.length === 0) {
            listEl.innerHTML = '<div style="color: rgba(0, 245, 255, 0.5); font-size: 0.85rem; padding: 10px; text-align: center;">Veri tabanı boş. İlk hackleyen sen ol!</div>';
            return;
        }

        board.forEach((user, index) => {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid rgba(0, 245, 255, 0.1); font-size: 0.9rem;';
            row.innerHTML = `<span style="color: ${index === 0 ? 'var(--yellow)' : 'var(--cyan)'};">${index + 1}. ${user.name}</span> <span style="font-weight: bold; color: var(--pink);">${user.score} P</span>`;
            listEl.appendChild(row);
        });
    }
}

function generateMatrix() {
    matrix = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        let row = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            // Hex kodlar yerine Pi dizisinden rastgele sayı seç
            const randomPiDigit = PI_DIGITS[Math.floor(Math.random() * PI_DIGITS.length)];
            row.push(randomPiDigit);
        }
        matrix.push(row);
    }

    // GARANTİSİ: Aktif satırda/sütunda beklenen sayının olduğundan emin ol
    if (currentIndex < PI_DIGITS.length) {
        const expected = PI_DIGITS[currentIndex];
        let hasExpected = false;

        for (let i = 0; i < GRID_SIZE; i++) {
            let rCheck = selectionMode === 'row' ? activeLineIndex : i;
            let cCheck = selectionMode === 'col' ? activeLineIndex : i;
            if (matrix[rCheck][cCheck] == expected) {
                hasExpected = true;
            }
        }

        if (!hasExpected) {
            const randomSpot = Math.floor(Math.random() * GRID_SIZE);
            if (selectionMode === 'row') {
                matrix[activeLineIndex][randomSpot] = expected;
            } else {
                matrix[randomSpot][activeLineIndex] = expected;
            }
        }
    }
}

function updateProgressUI() {
    const nextEl = document.getElementById('nextExpectedDigit');
    const scoreEl = document.getElementById('currentScoreDisplay');

    if (nextEl) {
        if (currentIndex < PI_DIGITS.length) {
            nextEl.innerText = "?"; // Sadece yardım isteyince görünecek
        } else {
            nextEl.innerText = "SON"; // Çok zor ama dizilim biterse
        }
    }
    if (scoreEl) {
        scoreEl.innerText = score;
    }
}

function renderMatrix() {
    const grid = document.getElementById('matrixGrid');
    grid.innerHTML = '';

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'hex-cell';
            cell.innerText = matrix[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Hücre Stili ve Mantığı
            if (gameOver) {
                cell.classList.add('disabled');
            } else {
                const isSelected = selectedCells.some(s => s.r === r && s.c === c);
                if (isSelected) {
                    cell.classList.add('selected'); // Seçilmiş hücre pasif
                } else {
                    const isActive = (selectionMode === 'row' && r === activeLineIndex) ||
                        (selectionMode === 'col' && c === activeLineIndex);

                    if (isActive) {
                        cell.classList.add('active-line'); // Bu satır veya sütun seçilebilir
                        cell.addEventListener('click', () => handleCellClick(r, c));
                    } else {
                        cell.classList.add('disabled'); // Seçilemez
                    }
                }
            }

            grid.appendChild(cell);
        }
    }
}

function renderBuffer() {
    const bufferDisplay = document.getElementById('bufferSquares');
    bufferDisplay.innerHTML = '';

    // Buffer artık sınırsız (Sonsuz Mod). Tampon büyüklüğüne veya Grid Size'a sabitlemiyoruz, kutular eklenecek.
    buffer.forEach(val => {
        const box = document.createElement('div');
        box.className = 'buffer-box filled';
        box.style.marginBottom = "5px"; // Satır aşağı taşarsa boşluk
        box.innerText = val;
        bufferDisplay.appendChild(box);
    });
}

function handleCellClick(r, c) {
    if (gameOver || !gameStarted) return;

    // Tıklama Sesi
    if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('click');

    const clickedDigit = parseInt(matrix[r][c]);
    const expectedDigit = PI_DIGITS[currentIndex];

    // DOĞRU MU?
    if (clickedDigit === expectedDigit) {
        buffer.push(clickedDigit);
        selectedCells.push({ r, c });

        // Zaman (Refleks) Bonusu Hesabı
        const now = Date.now();
        const timeDiff = (now - lastClickTime) / 1000; // Saniye farkı
        lastClickTime = now;

        // Hızlı tıklayana 50 puan, yavaşladıkça eriyen (negatife düşmeyen) sabit bonus.
        let speedBonus = Math.max(0, Math.floor(50 - (timeDiff * 10)));

        if (speedBonus > 30) {
            const comboEl = document.getElementById('comboIndicator');
            if (comboEl) {
                comboEl.classList.remove('anim-flash');
                void comboEl.offsetWidth; // trigger reflow
                comboEl.classList.add('anim-flash');
            }
        }

        // İlerleyiş Hesapları
        score += currentCombo + speedBonus;
        currentCombo += 5; // Combo çarpanı artar
        currentIndex++;

        // Satır/Sütun değişimi
        if (selectionMode === 'row') {
            selectionMode = 'col';
            activeLineIndex = c;
        } else {
            selectionMode = 'row';
            activeLineIndex = r;
        }

        updateProgressUI();

        // ** GARANTİ YOL (GUARANTEED PATH) **
        // Bir sonraki adımdaki beklenen rakamın, yepyeni aktif satır/sütunda KESİNLİKLE var olduğundan emin ol.
        // Aksi takdirde oyun şans eseri / mantıksız şekilde bitebilir.
        if (currentIndex < PI_DIGITS.length) {
            const nextExpected = PI_DIGITS[currentIndex];
            let hasNextDigit = false;
            let availableCellsForNext = [];

            // Aktif satır/sütunu tara
            for (let i = 0; i < GRID_SIZE; i++) {
                let rCheck = selectionMode === 'row' ? activeLineIndex : i;
                let cCheck = selectionMode === 'col' ? activeLineIndex : i;
                const isSelected = selectedCells.some(s => s.r === rCheck && s.c === cCheck);

                if (!isSelected) {
                    availableCellsForNext.push({ r: rCheck, c: cCheck });
                    if (matrix[rCheck][cCheck] == nextExpected) {
                        hasNextDigit = true;
                    }
                }
            }

            // Eğer sıradaki beklenen rakam bu hatta (satır/sütun) yoksa ve vurulacak boş hücre varsa, rastgele birine yerleştir
            if (!hasNextDigit && availableCellsForNext.length > 0) {
                const randomSpot = availableCellsForNext[Math.floor(Math.random() * availableCellsForNext.length)];
                matrix[randomSpot.r][randomSpot.c] = nextExpected; // Matrisi o hücredeki rakamla ezerek garanti sağla
            }
        }

        renderMatrix();
        renderBuffer();

        // Eğer mevcut matris içinde gidilecek yol kalmadıysa veya 25 kere tıklandıysa, matrisi KİLİTLEME YENİLE!
        if (checkIfBlocked()) {
            // Animasyon ekle ve Matrisi Yenile, Puanı koru
            const gridEl = document.getElementById('matrixGrid');
            if (gridEl) {
                gridEl.classList.remove('anim-lock-flash');
                void gridEl.offsetWidth; // trigger reflow
                gridEl.classList.add('anim-lock-flash');
            }

            setTimeout(() => {
                generateMatrix();
                selectedCells = [];
                renderMatrix();
                if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('click'); // Yenileme sesi
            }, 300);
        }

        // Ya da mükemmel oynayıp dizinin sonuna geldi (Zor)
        if (currentIndex >= PI_DIGITS.length) {
            gameOver = true;
            clearInterval(timerInterval);
            finishGame(true, "MÜKEMMEL İHLAL", "Kayıtlı en derin Pi verisine ulaştın!");
        }
    } else {
        // YANLIŞ!
        buffer.push(clickedDigit); // Yanlış girdiği rakamı da kırmızı göstersin diye ekleyelim
        selectedCells.push({ r, c });
        renderMatrix();
        renderBuffer(); // Ekrana versin

        gameOver = true;
        clearInterval(timerInterval);
        finishGame(false, "BAĞLANTI KOPTU", `Hatalı veri dizilimi girildi.\nBeklenen: ${expectedDigit} - Girilen: ${clickedDigit}`);
    }
}

// Oyuncu hamle yapacak aktif hatta boş hücre kaldı mı?
function checkIfBlocked() {
    let availableCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
        let rCheck = selectionMode === 'row' ? activeLineIndex : i;
        let cCheck = selectionMode === 'col' ? activeLineIndex : i;
        const isAlreadySelected = selectedCells.some(s => s.r === rCheck && s.c === cCheck);
        if (!isAlreadySelected) availableCount++;
    }
    return availableCount === 0;
}

function finishGame(isPerfect, title, msg) {
    setTimeout(() => {
        let finalMsg = `${msg}\n\nÇözülen Basamak: ${currentIndex} / ${PI_DIGITS.length}\nToplam Kazanç: ${score} Puan\nGeçen Süre: ${document.getElementById('gameTimerDisplay').innerText}`;

        if (isPerfect) {
            if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('success');
            GameUtils.showModal(title, finalMsg, true);
            GameUtils.triggerSuccessEffect();
            if (typeof GameUtils !== 'undefined' && GameUtils.saveScore) {
                GameUtils.saveScore(THIS_GAME_ID, score);
                renderLocalLeaderboard();
            }
        } else {
            if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('error');
            GameUtils.showModal(title, finalMsg, false); // Kırmızı

            if (score > 0 && typeof GameUtils !== 'undefined' && GameUtils.saveScore) {
                GameUtils.saveScore(THIS_GAME_ID, score);
                renderLocalLeaderboard();
            }
        }
    }, 500);
}

document.getElementById('resetBufferBtn').addEventListener('click', () => {
    if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('error'); // Reset bip sesi
    initGame();
});

document.getElementById('startGameBtn')?.addEventListener('click', () => {
    if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('click');
    startRealGame();
});

document.getElementById('helpBtn')?.addEventListener('click', () => {
    if (gameOver || !gameStarted) return;
    if (score < 10) {
        if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('error');
        // Kırmızı uyarıyı bir süre sonra kapatacak geçici alert de kullanılabilir, veya ufak bir tooltip
        const pEl = document.getElementById('currentProgress');
        const oldBorder = pEl.style.borderColor;
        pEl.style.borderColor = 'red';
        setTimeout(() => pEl.style.borderColor = oldBorder, 1000);
        return;
    }

    score -= 10;
    updateProgressUI();
    if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('click');

    const nextExpected = PI_DIGITS[currentIndex];
    const nextEl = document.getElementById('nextExpectedDigit');
    if (nextEl) {
        nextEl.innerText = nextExpected;
        setTimeout(() => { if (nextEl.innerText === String(nextExpected)) nextEl.innerText = "?"; }, 3000);
    }

    for (let i = 0; i < GRID_SIZE; i++) {
        let rCheck = selectionMode === 'row' ? activeLineIndex : i;
        let cCheck = selectionMode === 'col' ? activeLineIndex : i;
        const isSelected = selectedCells.some(s => s.r === rCheck && s.c === cCheck);

        if (!isSelected && matrix[rCheck][cCheck] == nextExpected) {
            const cells = document.querySelectorAll('.hex-cell');
            cells.forEach(cell => {
                if (parseInt(cell.dataset.row) === rCheck && parseInt(cell.dataset.col) === cCheck) {
                    cell.classList.add('highlight-dynamite');
                    setTimeout(() => cell.classList.remove('highlight-dynamite'), 2000);
                }
            });
            break;
        }
    }
});

document.getElementById('dynamiteBtn')?.addEventListener('click', () => {
    if (gameOver || !gameStarted) return;

    if (score < 50) {
        if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('error');
        const pEl = document.getElementById('currentProgress');
        const oldBorder = pEl.style.borderColor;
        pEl.style.borderColor = 'red';
        setTimeout(() => pEl.style.borderColor = oldBorder, 1000);
        return;
    }

    score -= 50;
    updateProgressUI();
    if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('success'); // Patlama benzeri ses

    const nextExpected = PI_DIGITS[currentIndex];

    for (let i = 0; i < GRID_SIZE; i++) {
        let rCheck = selectionMode === 'row' ? activeLineIndex : i;
        let cCheck = selectionMode === 'col' ? activeLineIndex : i;
        const isSelected = selectedCells.some(s => s.r === rCheck && s.c === cCheck);

        if (!isSelected && matrix[rCheck][cCheck] == nextExpected) {
            handleCellClick(rCheck, cCheck);
            break;
        }
    }
});

window.addEventListener('load', async () => {
    if (typeof GameUtils !== 'undefined' && GameUtils.syncWithDatabase) {
        await GameUtils.syncWithDatabase();
    }
    initGame();
});
