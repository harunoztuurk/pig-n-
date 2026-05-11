document.addEventListener('DOMContentLoaded', () => {
    let currentLevelIndex = 0;
    const totalLevels = levelsData.length;

    const elements = {
        levelInfo: document.getElementById('levelInfo'),
        questionTitle: document.getElementById('questionTitle'),
        inputValue: document.getElementById('inputValue'),
        targetValue: document.getElementById('targetValue'),
        hintBtn: document.getElementById('hintBtn'),
        hintContainer: document.getElementById('hintContainer'),
        commandPalette: document.getElementById('commandPalette'),
        pipelineSlots: document.getElementById('pipelineSlots'),
        verifyBtn: document.getElementById('verifyBtn'),
        resetBtn: document.getElementById('resetBtn'),
        feedbackMessage: document.getElementById('feedbackMessage'),
        endModal: document.getElementById('endModal'),
        restartBtn: document.getElementById('restartBtn')
    };

    let pipelineFlow = [];

    function loadLevel(index) {
        if (index >= totalLevels) {
            elements.endModal.classList.add('active');
            return;
        }

        const level = levelsData[index];
        elements.levelInfo.textContent = `Proses ${index + 1} / ${totalLevels}`;
        elements.questionTitle.textContent = `// ${level.title}`;
        
        elements.inputValue.textContent = level.input;
        elements.targetValue.textContent = level.target;

        elements.feedbackMessage.textContent = '';
        elements.hintContainer.style.display = 'none';
        elements.hintContainer.textContent = level.hint;

        pipelineFlow = [];
        renderWorkspace(level);
    }

    function renderWorkspace(level) {
        elements.commandPalette.innerHTML = '';
        elements.pipelineSlots.innerHTML = '';

        // Slotları oluştur
        for (let i = 0; i < level.maxSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'pipe-slot';
            slot.dataset.index = i;
            
            slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('drag-over'); });
            slot.addEventListener('dragleave', (e) => { slot.classList.remove('drag-over'); });
            slot.addEventListener('drop', handleDropOnSlot);

            elements.pipelineSlots.appendChild(slot);
        }

        // Komutları oluştur (Klonlanabilir kaynak)
        level.commands.forEach(cmd => {
            const block = document.createElement('div');
            block.className = 'cmd-block';
            block.draggable = true;
            block.textContent = cmd.label;
            block.dataset.id = cmd.id;
            block.dataset.type = cmd.type;
            block.dataset.val = cmd.val;

            block.addEventListener('dragstart', handleDragStart);
            
            elements.commandPalette.appendChild(block);
        });
    }

    let draggedSource = null; // Palette'den mi geldi slot'tan mı?
    let draggedData = null;

    function handleDragStart(e) {
        draggedSource = e.target.parentElement.className.includes('command-palette') ? 'palette' : 'slot';
        draggedData = {
            id: e.target.dataset.id,
            label: e.target.textContent,
            type: e.target.dataset.type,
            val: e.target.dataset.val
        };
        e.dataTransfer.setData("text/plain", draggedData.id);
        
        if (draggedSource === 'slot') {
            // Eğer slotun içindekini sürüklüyorsa, oradan sileceğiz (Move action)
            setTimeout(() => e.target.remove(), 0);
        }
    }

    function handleDropOnSlot(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');

        if (draggedData) {
            // Slot zaten doluysa üstüne ekleme (veya değiştir)
            if (e.currentTarget.children.length > 0) {
                e.currentTarget.innerHTML = ''; // temizle
            }

            const block = document.createElement('div');
            block.className = 'cmd-block';
            block.draggable = true;
            block.textContent = draggedData.label;
            block.dataset.id = draggedData.id;
            block.dataset.type = draggedData.type;
            block.dataset.val = draggedData.val;
            
            block.addEventListener('dragstart', handleDragStart);

            e.currentTarget.appendChild(block);
        }
    }

    function executePipeline() {
        const level = levelsData[currentLevelIndex];
        let currentValue = level.input;
        const slots = elements.pipelineSlots.children;

        // Pipeline boş mu kontrolü
        let hasCommand = false;

        for (let i = 0; i < slots.length; i++) {
            const block = slots[i].querySelector('.cmd-block');
            if (block) {
                hasCommand = true;
                const type = block.dataset.type;
                const val = parseFloat(block.dataset.val);

                if (type === 'add') currentValue += val;
                if (type === 'sub') currentValue -= val;
                if (type === 'mul') currentValue *= val;
                if (type === 'div') currentValue /= val;
                if (type === 'rev') {
                    // Sayıyı string yap, ters çevir, int yap
                    let str = String(Math.abs(currentValue));
                    let revStr = str.split('').reverse().join('');
                    let revNum = parseInt(revStr, 10);
                    currentValue = currentValue < 0 ? -revNum : revNum;
                }
            }
        }

        if (!hasCommand) {
            return showFeedback("Compilation Error: Komut hattı boş.", "error");
        }

        // Dinamik gösterge
        elements.inputValue.textContent = currentValue;

        if (currentValue === level.target) {
            showFeedback("Output == Target. İşlem Onaylandı.", "success");
            setTimeout(() => {
                currentLevelIndex++;
                loadLevel(currentLevelIndex);
            }, 2000);
        } else {
            showFeedback(`Beklenmeyen Çıktı: ${currentValue}.`, "error");
            // Girdiyi eski haline al
            setTimeout(()=> {
                elements.inputValue.textContent = level.input;
            }, 1500)
        }
    }

    function showFeedback(msg, type) {
        elements.feedbackMessage.textContent = msg;
        elements.feedbackMessage.className = `feedback-message ${type}`;
    }

    elements.resetBtn.addEventListener('click', () => loadLevel(currentLevelIndex));
    elements.verifyBtn.addEventListener('click', executePipeline);
    elements.hintBtn.addEventListener('click', () => { elements.hintContainer.style.display = 'block'; });
    elements.restartBtn.addEventListener('click', () => {
        elements.endModal.classList.remove('active');
        currentLevelIndex = 0;
        loadLevel(0);
    });

    loadLevel(currentLevelIndex);
});
