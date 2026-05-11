document.addEventListener('DOMContentLoaded', () => {
    // Toplam Seviye Sayısı ve Mevcut Seviye
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    // DOM Elementleri
    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        answerInput: document.getElementById('answerInput'),
        submitBtn: document.getElementById('submitBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        homeBtn: document.getElementById('homeBtn'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn')
    };

    // Arka plan animasyonu için daha fazla numara ekeleme (Opsiyonel görselleştirme)
    function setupBackgroundNumbers() {
        const bgContainer = document.getElementById('bgNumbers');
        if (!bgContainer) return;
        
        const extraNumbersCount = 15;
        for (let i = 0; i < extraNumbersCount; i++) {
            const span = document.createElement('span');
            span.classList.add('floating-number');
            // Rastgele bir rakam 0-9
            span.textContent = Math.floor(Math.random() * 10);
            
            // Rastgele konum, gecikme ve boyut
            const left = Math.floor(Math.random() * 100);
            const delay = Math.random() * 20; // 0-20s arası gecikme
            
            span.style.left = `${left}%`;
            span.style.animationDelay = `${delay}s`;
            
            bgContainer.appendChild(span);
        }
    }

    // Seviye Yükleme
    function loadLevel(index) {
        if (index >= totalLevels) {
            return showEndGameModal();
        }

        const level = levelsData[index];
        
        elements.levelInfo.textContent = `Seviye ${index + 1} / ${totalLevels}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.innerHTML = level.questionText;
        
        elements.answerInput.value = '';
        elements.answerInput.focus();
        
        // Geri bildirim ve ipuçlarını temizle
        elements.feedbackMessage.textContent = '';
        elements.feedbackMessage.className = 'feedback-message';
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.innerHTML = '';
        elements.hintBtn.style.display = level.hint ? 'block' : 'none';
    }

    // Cevap Kontrolü
    function checkAnswer() {
        const level = levelsData[currentLevelIndex];
        const userAnswer = elements.answerInput.value.trim().toLowerCase();
        
        // Eğer boş gönderilirse
        if (!userAnswer) {
            showFeedback('Lütfen bir cevap girin.', 'error');
            return;
        }

        let isCorrect = false;

        // Sayı tipi soru (Çoğu sorumuz bu şekilde)
        if (level.type === 'number') {
            // "06:00" girişine karşı veya "06" için, rakamları alıp karşılaştıralım (veya text eşitliği)
            // Ama örneğin sadece "6" da kabul edilmeli. Seviye 9 için answer "6".
            if (userAnswer === level.answer || parseInt(userAnswer, 10).toString() === level.answer) {
                isCorrect = true;
            } else if (level.id === 9 && (userAnswer === "06:00" || userAnswer === "06")) {
                // Saat 6 için özel istisna
                isCorrect = true;
            }
        } else {
            // Text veya Choice
            if (userAnswer === String(level.answer).toLowerCase()) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            showFeedback('Doğru Cevap! Harika.', 'success');
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 1500);
        } else {
            showFeedback('Yanlış Cevap. Seçeneklerinizi veya hesaplamanızı tekrar gözden geçirin.', 'error');
        }
    }

    // Geri Bildirim Gösterme Yöntemi
    function showFeedback(message, type) {
        elements.feedbackMessage.textContent = message;
        elements.feedbackMessage.className = `feedback-message show ${type}`;
        
        // Yanlış cevapta ufak bir "shake" animasyonu vermek için
        if (type === 'error') {
            elements.answerInput.classList.add('error');
            setTimeout(() => {
                elements.answerInput.classList.remove('error');
            }, 500);
        }
    }

    // İpucu Gösterme Yöntemi
    function showHint() {
        const level = levelsData[currentLevelIndex];
        if (level && level.hint) {
            elements.hintContainer.innerHTML = `<strong>İpucu:</strong> ${level.hint}`;
            elements.hintContainer.style.display = 'block';
            elements.hintBtn.style.display = 'none'; // İpucu butonunu gizle
        }
    }

    // Oyun Sonu Modalını Gösterme
    function showEndGameModal() {
        elements.endModal.classList.add('active');
    }

    // Tekrar Oynama Yöntemi
    function restartGame() {
        currentLevelIndex = 0;
        elements.endModal.classList.remove('active');
        loadLevel(currentLevelIndex);
    }

    // Event Listener'lar
    elements.submitBtn.addEventListener('click', checkAnswer);
    
    // Klavyede Enter'a basınca otomatik kontrol etsin
    elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    elements.hintBtn.addEventListener('click', showHint);
    
    elements.homeBtn.addEventListener('click', () => {
        window.location.href = '../../index.html'; // Ana dizine dön
    });

    elements.restartBtn.addEventListener('click', restartGame);

    // Initial Setup
    setupBackgroundNumbers();
    loadLevel(currentLevelIndex);
});
