document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        targetZone: document.getElementById('targetZone'),
        piecesContainer: document.getElementById('piecesContainer'),
        verifyBtn: document.getElementById('verifyBtn'),
        resetBtn: document.getElementById('resetBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn'),
        homeBtn: document.getElementById('homeBtn')
    };

    // Parça Pozisyonlarını Tutma
    let activePiece = null;
    let offsetX = 0;
    let offsetY = 0;

    function loadLevel(index) {
        if (index >= totalLevels) {
            return showEndGameModal();
        }

        const level = levelsData[index];
        
        elements.levelInfo.textContent = `Seviye ${index + 1} / ${totalLevels}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.textContent = level.questionText;
        
        elements.feedbackMessage.textContent = '';
        elements.hintContainer.style.display = 'none';
        elements.hintBtn.style.display = level.hint ? 'inline-block' : 'none';
        if (level.hint) {
            elements.hintContainer.innerHTML = `<strong>İpucu:</strong> ${level.hint}`;
        }

        // Hedef Alan Çizimi (Ghost SVG)
        elements.targetZone.innerHTML = level.targetSVG;
        elements.targetZone.style.width = `${level.targetWidth}px`;
        elements.targetZone.style.height = `${level.targetHeight}px`;

        // Parçaları Sahneye Ekleme
        elements.piecesContainer.innerHTML = '';
        level.pieces.forEach(p => {
            const pieceDiv = document.createElement('div');
            pieceDiv.className = 'geo-piece';
            pieceDiv.id = p.id;
            pieceDiv.innerHTML = p.svg;
            
            // Başlangıç lokasyonları
            pieceDiv.style.left = `${p.startX}px`;
            pieceDiv.style.top = `${p.startY}px`;

            // Pointer Event Bağlamaları (Mobil uyumlu drag & drop)
            pieceDiv.addEventListener('pointerdown', handleDragStart);

            elements.piecesContainer.appendChild(pieceDiv);
        });
    }

    // Drag and Drop Mantığı
    function handleDragStart(e) {
        activePiece = e.currentTarget;
        const rect = activePiece.getBoundingClientRect();
        const workspaceRect = document.getElementById('workspace').getBoundingClientRect();

        // Tıklanan noktanın parça içindeki göreceli konumu
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        activePiece.setPointerCapture(e.pointerId);
        
        activePiece.addEventListener('pointermove', handleDragMove);
        activePiece.addEventListener('pointerup', handleDragEnd);
        activePiece.addEventListener('pointercancel', handleDragEnd);
    }

    function handleDragMove(e) {
        if (!activePiece) return;
        
        const workspaceRect = document.getElementById('workspace').getBoundingClientRect();
        
        let newX = e.clientX - workspaceRect.left - offsetX;
        let newY = e.clientY - workspaceRect.top - offsetY;

        activePiece.style.left = `${newX}px`;
        activePiece.style.top = `${newY}px`;
    }

    function handleDragEnd(e) {
        if (!activePiece) return;
        
        activePiece.removeEventListener('pointermove', handleDragMove);
        activePiece.removeEventListener('pointerup', handleDragEnd);
        activePiece.removeEventListener('pointercancel', handleDragEnd);
        activePiece.releasePointerCapture(e.pointerId);
        
        activePiece = null;
    }

    // Pozisyonları Doğrulama (Verification)
    function verifyGeometry() {
        const level = levelsData[currentLevelIndex];
        const targetRect = elements.targetZone.getBoundingClientRect();
        const workspaceRect = document.getElementById('workspace').getBoundingClientRect();
        
        // Hedefin workspace içindeki göreceli X ve Y si
        const tX = targetRect.left - workspaceRect.left;
        const tY = targetRect.top - workspaceRect.top;

        const tolerance = 40; // 40 pixel hata payı
        let isSolved = true;

        level.pieces.forEach(p => {
            const pieceDiv = document.getElementById(p.id);
            if (!pieceDiv) isSolved = false;

            const finalX = parseFloat(pieceDiv.style.left);
            const finalY = parseFloat(pieceDiv.style.top);

            // Parçanın hedeflenen mutlak pozisyonu (hedefin sol üst köşesine göre offset)
            const expectedX = tX + p.targetX;
            const expectedY = tY + p.targetY;

            // Math.abs d ile hata payı (tolerance) ölçümü
            if (Math.abs(finalX - expectedX) > tolerance || Math.abs(finalY - expectedY) > tolerance) {
                isSolved = false;
            } else {
                // Eğer tolerans altındaysa (yaklaştıysa), tam yerine oturt ("Snap")
                pieceDiv.style.left = `${expectedX}px`;
                pieceDiv.style.top = `${expectedY}px`;
                pieceDiv.style.transition = 'all 0.3s ease';
                setTimeout(() => { pieceDiv.style.transition = 'none'; }, 300);
            }
        });

        if (isSolved) {
            elements.feedbackMessage.textContent = "Kusursuz Mimari! Doğru Yerleşim.";
            elements.feedbackMessage.className = "feedback-message success";
            elements.verifyBtn.disabled = true;
            
            setTimeout(() => {
                elements.verifyBtn.disabled = false;
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 2000);
        } else {
            elements.feedbackMessage.textContent = "Parçalar tam örtüşmedi, konumları düzenleyin.";
            elements.feedbackMessage.className = "feedback-message error";
        }
    }

    function resetPieces() {
        const level = levelsData[currentLevelIndex];
        level.pieces.forEach(p => {
            const pieceDiv = document.getElementById(p.id);
            if (pieceDiv) {
                pieceDiv.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                pieceDiv.style.left = `${p.startX}px`;
                pieceDiv.style.top = `${p.startY}px`;
                setTimeout(() => { pieceDiv.style.transition = 'none'; }, 500);
            }
        });
        elements.feedbackMessage.textContent = "";
    }

    function showEndGameModal() {
        elements.endModal.classList.add('active');
    }

    // Event Listeners
    elements.verifyBtn.addEventListener('click', verifyGeometry);
    elements.resetBtn.addEventListener('click', resetPieces);
    
    elements.hintBtn.addEventListener('click', () => {
        elements.hintContainer.style.display = 'block';
        elements.hintBtn.style.display = 'none';
    });

    elements.restartBtn.addEventListener('click', () => {
        elements.endModal.classList.remove('active');
        currentLevelIndex = 0;
        loadLevel(currentLevelIndex);
    });

    // Başlangıç
    loadLevel(currentLevelIndex);
});
