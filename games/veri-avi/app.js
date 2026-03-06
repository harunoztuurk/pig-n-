// VERİ AVI OYUNU
const THIS_GAME_ID = 'veri-avi';
const GRID_SIZE = 5;
const BUFFER_SIZE = 5;
const PI_DIGITS = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7]; // Pi'nin ilk 30 hanesi

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
    lastClickTime = Date.now();

    // Süreyi Sıfırla
    secondsElapsed = 0;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);

    generateMatrix();
    updateProgressUI();

    renderMatrix();
    renderBuffer();
    renderLocalLeaderboard();
}

function updateTimerDisplay() {
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
    for (let r = 0; r < GRID_SIZE; r++) {
        let row = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            // Hex kodlar yerine Pi dizisinden rastgele sayı seç
            const randomPiDigit = PI_DIGITS[Math.floor(Math.random() * PI_DIGITS.length)];
            row.push(randomPiDigit);
        }
        matrix.push(row);
    }

    // İLK ADIM GARANTİSİ: İlk hamle 0. satırda başlar ve aranan ilk rakam PI_DIGITS[0]'dır. (Genelde 3)
    // Eğer şanssız bir şekilde grid üretildiyse ilk satırda 3 olmayabilir, bunu zorlayalım.
    const firstExpected = PI_DIGITS[0];
    if (!matrix[0].includes(firstExpected)) {
        const randomCol = Math.floor(Math.random() * GRID_SIZE);
        matrix[0][randomCol] = firstExpected;
    }
}

function updateProgressUI() {
    const nextEl = document.getElementById('nextExpectedDigit');
    const scoreEl = document.getElementById('currentScoreDisplay');

    if (nextEl) {
        if (currentIndex < PI_DIGITS.length) {
            nextEl.innerText = PI_DIGITS[currentIndex];
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
    if (gameOver) return;

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

        // Eğer mevcut matris içinde gidilecek yol (aktif hatta seçilmemiş hücre kalmadıysa) oyun kilitlenir
        if (checkIfBlocked()) {
            gameOver = true;
            clearInterval(timerInterval);
            finishGame(false, "SİSTEM KİLİTLENDİ", "Seçebileceğin hata uygun veri kalmadı.");
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
        if (score > 0) {
            if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('success');
            GameUtils.showModal(title, `${msg}\n\nToplam Kazanç: ${score} Puan\nGeçen Süre: ${document.getElementById('gameTimerDisplay').innerText}`);
            GameUtils.triggerSuccessEffect();
            if (typeof GameUtils !== 'undefined' && GameUtils.saveScore) {
                GameUtils.saveScore(THIS_GAME_ID, score);
                renderLocalLeaderboard();
            }
        } else {
            if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('error');
            GameUtils.showModal(title, msg, false); // Kırmızı
        }
    }, 500);
}

document.getElementById('resetBufferBtn').addEventListener('click', () => {
    if (typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('error'); // Reset bip sesi
    initGame();
});

window.addEventListener('load', initGame);
