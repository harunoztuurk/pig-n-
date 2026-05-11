document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        illusionContainer: document.getElementById('illusionContainer'),
        sliderGroup: document.getElementById('sliderGroup'),
        illusionSlider: document.getElementById('illusionSlider'),
        sliderValue: document.getElementById('sliderValue'),
        verifyBtn: document.getElementById('verifyBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn')
    };

    let targetElement = null; // Kırmızı boyutlandırılabilir obje

    function loadLevel(index) {
        if (index >= totalLevels) {
            elements.endModal.classList.add('active');
            return;
        }

        const level = levelsData[index];
        elements.levelInfo.textContent = `Illusio // 0${index + 1}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.innerHTML = level.questionText;
        
        elements.feedbackMessage.textContent = '';
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.textContent = level.hint;

        renderIllusion(level);
        
        // Setup slider
        elements.sliderGroup.style.display = 'block';
        elements.illusionSlider.value = level.initialValue;
        updateSliderVisual(level.initialValue);
    }

    function renderIllusion(level) {
        elements.illusionContainer.innerHTML = '';

        if (level.type === 'ponzo') {
            // Ponzo Illusion (Kesişen raylar)
            elements.illusionContainer.innerHTML = `
                <div class="ponzo-bg">
                    <div class="ponzo-track left"></div>
                    <div class="ponzo-track right"></div>
                </div>
            `;
            // Reference Line (Black, Default)
            const refLine = document.createElement('div');
            refLine.className = 'ill-line';
            refLine.style.width = `${level.targetLength}px`;
            refLine.style.top = '70%'; // Altta (Büyük görünür normalde ama dar, tersi ponzo)
            refLine.style.left = '50%';
            refLine.style.transform = 'translate(-50%, -50%)';
            
            // Target Line (Red, Resizable)
            targetElement = document.createElement('div');
            targetElement.className = 'ill-line target';
            targetElement.style.top = '30%'; // Üstte
            targetElement.style.left = '50%';
            targetElement.style.transform = 'translate(-50%, -50%)';

            elements.illusionContainer.appendChild(refLine);
            elements.illusionContainer.appendChild(targetElement);
        }

        if (level.type === 'ebbinghaus') {
            // Ebbinghaus (Çiçek)
            // Sol taraf: Siyah referans etrafında devasa çemberler
            const leftGroup = document.createElement('div');
            leftGroup.className = 'ebb-group left';
            leftGroup.style.width = '200px'; leftGroup.style.height = '200px';
            leftGroup.style.left = '20%'; leftGroup.style.top = '50%';
            leftGroup.style.transform = 'translate(-50%, -50%)';

            const refCenter = document.createElement('div');
            refCenter.className = 'ebb-center';
            refCenter.style.width = `${level.targetLength}px`;
            refCenter.style.height = `${level.targetLength}px`;
            leftGroup.appendChild(refCenter);
            
            // Büyük çevre (Petals)
            const angles = [0, 60, 120, 180, 240, 300];
            angles.forEach(deg => {
                const petal = document.createElement('div');
                petal.className = 'ebb-petal';
                petal.style.width = '60px'; petal.style.height = '60px';
                const rad = deg * Math.PI / 180;
                const dist = 70;
                petal.style.left = `${100 - 30 + Math.cos(rad) * dist}px`;
                petal.style.top = `${100 - 30 + Math.sin(rad) * dist}px`;
                leftGroup.appendChild(petal);
            });

            // Sağ Taraf: Hedef kırmızı merkez etrafında küçük çemberler
            const rightGroup = document.createElement('div');
            rightGroup.className = 'ebb-group right';
            rightGroup.style.width = '150px'; rightGroup.style.height = '150px';
            rightGroup.style.left = '75%'; rightGroup.style.top = '50%';
            rightGroup.style.transform = 'translate(-50%, -50%)';

            targetElement = document.createElement('div');
            targetElement.className = 'ebb-center target';
            rightGroup.appendChild(targetElement);

            // Küçük çevre (Petals)
            [0, 45, 90, 135, 180, 225, 270, 315].forEach(deg => {
                const petal = document.createElement('div');
                petal.className = 'ebb-petal';
                petal.style.width = '20px'; petal.style.height = '20px';
                const rad = deg * Math.PI / 180;
                const dist = 40;
                petal.style.left = `${75 - 10 + Math.cos(rad) * dist}px`;
                petal.style.top = `${75 - 10 + Math.sin(rad) * dist}px`;
                rightGroup.appendChild(petal);
            });

            elements.illusionContainer.appendChild(leftGroup);
            elements.illusionContainer.appendChild(rightGroup);
        }
    }

    elements.illusionSlider.addEventListener('input', (e) => {
        updateSliderVisual(e.target.value);
    });

    function updateSliderVisual(val) {
        elements.sliderValue.textContent = `${val} BİRİM`;
        if (targetElement) {
            const level = levelsData[currentLevelIndex];
            if (level.type === 'ponzo') {
                targetElement.style.width = `${val}px`;
            } else if (level.type === 'ebbinghaus') {
                targetElement.style.width = `${val}px`;
                targetElement.style.height = `${val}px`;
            }
        }
    }

    function verifyIllusion() {
        const level = levelsData[currentLevelIndex];
        const userValue = parseInt(elements.illusionSlider.value, 10);
        
        const diff = Math.abs(userValue - level.targetLength);

        if (diff <= level.tolerance) {
            elements.feedbackMessage.textContent = `Aydınlandınız! Referans sınır: ${level.targetLength}. Siz: ${userValue}. Kusursuz.`;
            elements.feedbackMessage.className = "feedback-message success";
            
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 3000);
        } else {
            let desc = userValue > level.targetLength ? "çok büyük" : "çok küçük";
            elements.feedbackMessage.textContent = `Zihniniz size oyun oynuyor. Objenizi referansa kıyasla ${desc} bıraktınız.`;
            elements.feedbackMessage.className = "feedback-message error";
        }
    }

    elements.verifyBtn.addEventListener('click', verifyIllusion);
    elements.hintBtn.addEventListener('click', () => { elements.hintContainer.style.display = 'block'; });
    elements.restartBtn.addEventListener('click', () => {
        elements.endModal.classList.remove('active');
        currentLevelIndex = 0;
        loadLevel(0);
    });

    loadLevel(currentLevelIndex);
});
