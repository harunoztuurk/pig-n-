document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        questionText: document.getElementById('questionText'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        slotsA: document.getElementById('slotsA'),
        slotsB: document.getElementById('slotsB'),
        verifyBtn: document.getElementById('verifyBtn'),
        resetBtn: document.getElementById('resetBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn')
    };

    let itemState = [];

    function loadLevel(index) {
        if (index >= totalLevels) {
            return showEndGameModal();
        }

        const level = levelsData[index];
        elements.levelInfo.textContent = `Düğüm ${index + 1} / ${totalLevels}`;
        elements.questionTitle.textContent = level.title;
        elements.questionText.textContent = level.questionText;
        elements.feedbackMessage.textContent = '';
        
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.textContent = level.hint;

        // Reset Containers
        elements.slotsA.innerHTML = '';
        elements.slotsB.innerHTML = '';

        itemState = level.items.map(i => ({ ...i, location: 'A' }));

        renderItems();
    }

    function renderItems() {
        elements.slotsA.innerHTML = '';
        elements.slotsB.innerHTML = '';

        // Drop Zone Event Listeners wrapper
        [elements.slotsA, elements.slotsB].forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('drop', handleDrop);
        });

        itemState.forEach(item => {
            const block = document.createElement('div');
            block.className = `item-block ${item.type}`;
            block.id = item.id;
            block.textContent = item.icon;
            block.draggable = true;

            block.addEventListener('dragstart', handleDragStart);
            block.addEventListener('dragend', handleDragEnd);

            if (item.location === 'A') {
                elements.slotsA.appendChild(block);
            } else {
                elements.slotsB.appendChild(block);
            }
        });
    }

    let draggedItemId = null;

    function handleDragStart(e) {
        draggedItemId = e.target.id;
        e.target.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", draggedItemId); // Firefox gereksinimi
    }

    function handleDragEnd(e) {
        e.target.style.opacity = '1';
        draggedItemId = null;
    }

    function handleDragOver(e) {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = "move";
    }

    function handleDrop(e) {
        e.preventDefault();
        const targetZoneId = e.currentTarget.id; // slotsA veya slotsB
        const newLocation = targetZoneId === 'slotsA' ? 'A' : 'B';

        if (draggedItemId) {
            const itemObj = itemState.find(i => i.id === draggedItemId);
            if (itemObj && itemObj.location !== newLocation) {
                itemObj.location = newLocation;
                renderItems();
            }
        }
    }

    function verifyCombination() {
        const level = levelsData[currentLevelIndex];
        
        const zoneAItems = itemState.filter(i => i.location === 'A');
        const zoneBItems = itemState.filter(i => i.location === 'B');

        const result = level.verify(zoneBItems, zoneAItems);

        if (result.success) {
            elements.feedbackMessage.textContent = "Bağlantı Doğrulandı! Kusursuz hamle.";
            elements.feedbackMessage.className = "feedback-message success";
            
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 2000);
        } else {
            elements.feedbackMessage.textContent = result.message;
            elements.feedbackMessage.className = "feedback-message error";
        }
    }

    elements.resetBtn.addEventListener('click', () => {
        loadLevel(currentLevelIndex); // Yeniden yükleyerek defaulta döner
    });

    elements.verifyBtn.addEventListener('click', verifyCombination);

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
