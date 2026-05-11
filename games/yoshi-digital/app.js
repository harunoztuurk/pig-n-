document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        displayArea: document.getElementById('displayArea'),
        verifyBtn: document.getElementById('verifyBtn'),
        resetBtn: document.getElementById('resetBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn')
    };

    // Mevcut basılı segmentlerin takibi
    // Format: { "d1": ["a", "b"], "d2": ["c", "g"] }
    let currentState = {};

    function loadLevel(index) {
        if (index >= totalLevels) {
            return showEndGameModal();
        }

        const level = levelsData[index];
        elements.levelInfo.textContent = `Düğüm // 0${index + 1}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.textContent = level.questionText;
        
        elements.feedbackMessage.textContent = '';
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.textContent = level.hint;

        renderDigits(level.digits);
    }

    function renderDigits(digitsConfig) {
        elements.displayArea.innerHTML = '';
        currentState = {};

        digitsConfig.forEach(digitObj => {
            // Başlangıç statüsünü hafızaya kaydet
            currentState[digitObj.id] = [...digitObj.initialON];

            const digitDiv = document.createElement('div');
            digitDiv.className = 'digit';
            digitDiv.id = digitObj.id;

            const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
            segments.forEach(segKey => {
                const segDiv = document.createElement('div');
                segDiv.className = `segment seg-${segKey}`;
                segDiv.dataset.seg = segKey;
                segDiv.dataset.digitId = digitObj.id;

                // Başlangıçta yanacak olanlar
                if (digitObj.initialON.includes(segKey)) {
                    segDiv.classList.add('on');
                }

                // Tıklanma (Toggle) Etkileşimi
                segDiv.addEventListener('click', () => toggleSegment(digitObj.id, segKey, segDiv));

                digitDiv.appendChild(segDiv);
            });

            elements.displayArea.appendChild(digitDiv);
        });
    }

    function toggleSegment(digitId, segKey, segElement) {
        const idx = currentState[digitId].indexOf(segKey);
        
        if (idx > -1) {
            // Açıksa Kapat
            currentState[digitId].splice(idx, 1);
            segElement.classList.remove('on');
        } else {
            // Kapalıysa Aç
            currentState[digitId].push(segKey);
            segElement.classList.add('on');
        }
    }

    function verifyDigitalState() {
        const level = levelsData[currentLevelIndex];
        let isCorrect = true;

        level.digits.forEach(digitObj => {
            const tempCurrent = currentState[digitObj.id].sort();
            const tempTarget = [...digitObj.targetON].sort();

            // Uzunluk testi ve Dizi içeriği testi
            if (tempCurrent.length !== tempTarget.length) {
                isCorrect = false;
                return;
            }

            for (let i = 0; i < tempCurrent.length; i++) {
                if (tempCurrent[i] !== tempTarget[i]) {
                    isCorrect = false;
                    return;
                }
            }
        });

        if (isCorrect) {
            elements.feedbackMessage.textContent = "> DOĞRULANDI... İletişim Başarılı.";
            elements.feedbackMessage.className = "feedback-message success";
            
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 2000);
        } else {
            elements.feedbackMessage.textContent = "> HATA: SİNTENKS UYUMSUZLUĞU!";
            elements.feedbackMessage.className = "feedback-message error";
        }
    }

    // Event Listeners
    elements.resetBtn.addEventListener('click', () => {
        loadLevel(currentLevelIndex); // Bölümü resetle
    });

    elements.verifyBtn.addEventListener('click', verifyDigitalState);

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
