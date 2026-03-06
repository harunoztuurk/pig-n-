const games = [
    {
        id: 'sifre-kirici',
        title: 'ŞİFRE KIRICI',
        desc: 'Matematiksel koordinatları çöz ve gizli sembolü bul. Cyberpunk temalı zeka oyunu.',
        icon: '◬',
        url: 'games/sifre-kirici/index.html'
    },
    {
        id: 'pi-renk-kodlama',
        title: 'RENK KODLAMA',
        desc: 'Renkleri keşfet, karışımları bul ve gizli numarayı (π) çöz!',
        icon: '🌈',
        url: 'games/pi-renk-kodlama/index.html'
    },
    {
        id: 'veri-avi',
        title: 'Pİ İHLALİ',
        desc: 'Pi sayısının sonsuzluğunda kaybolmuş veri bloklarını (Pi Matrisi) onar ve sisteme sız.',
        icon: '⟠',
        url: 'games/veri-avi/index.html'
    },
    {
        id: 'cember-olcumu',
        title: 'ÇEMBER ÖLÇÜMÜ',
        desc: 'Sadece cetvel kullanarak gizemli sayıyı (π) bul. Trigonometri veya hazır formüller yok!',
        icon: '⭘',
        url: 'games/cember-olcumu/index.html'
    }
];

// Global scope variables for modal state
let isModalReady = false;
let currentModalMode = 'register';

function initModal() {
    const tabs = document.querySelectorAll('.modal-tab');
    const loginBtn = document.getElementById('loginBtn');
    const nameInput = document.getElementById('playerNameInput');
    const errorDiv = document.getElementById('modalError');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentModalMode = e.target.getAttribute('data-tab');

            errorDiv.style.display = 'none';
            nameInput.value = '';

            if (currentModalMode === 'register') {
                modalTitle.textContent = 'SİSTEME KAYIT';
                modalDesc.textContent = 'Lütfen yeni bir kod adı belirleyin.';
                loginBtn.textContent = 'KAYDI TAMAMLA';
            } else {
                modalTitle.textContent = 'SİSTEME GİRİŞ';
                modalDesc.textContent = 'Mevcut kod adınızı girin.';
                loginBtn.textContent = 'BAĞLANTIYI KUR';
            }
            nameInput.focus();
        });
    });

    const doLogin = () => {
        // Mobil klavyelerde otomatik büyük harf atama veya satır sonu boşluklarını temizleme (case-insensitive destekle)
        let rawVal = nameInput.value.trim();
        let val = rawVal.toLowerCase();

        errorDiv.style.display = 'none';

        if (!val) {
            errorDiv.textContent = "Lütfen bir kod adı girin.";
            errorDiv.style.display = 'block';
            return;
        }

        const usersData = GameUtils._getUsersData();
        const userExists = usersData.hasOwnProperty(val);

        if (currentModalMode === 'register') {
            if (userExists) {
                errorDiv.textContent = "HATA: Bu kod adı zaten kullanılıyor.";
                errorDiv.style.display = 'block';
                return;
            }
        } else if (currentModalMode === 'login') {
            if (!userExists) {
                errorDiv.textContent = "HATA: Böyle bir hesap bulunamadı.";
                errorDiv.style.display = 'block';
                return;
            }
        }

        GameUtils.setUserName(val);
        document.getElementById('playerModal').style.display = 'none';
        checkUserAndRender(); // Tekrar çalıştır ve hub'ı render et
    };

    loginBtn.onclick = doLogin;
    nameInput.onkeydown = (e) => { if (e.key === 'Enter') doLogin(); };
    isModalReady = true;
}

function checkUserAndRender() {
    let userName = GameUtils.getUserName();

    if (!userName) {
        if (!isModalReady) initModal();
        const modal = document.getElementById('playerModal');
        const nameInput = document.getElementById('playerNameInput');
        const errorDiv = document.getElementById('modalError');

        errorDiv.style.display = 'none';
        nameInput.value = '';
        modal.style.display = 'flex';
        nameInput.focus();
    } else {
        const profileDiv = document.getElementById('user-profile');
        const nameDisplay = document.getElementById('playerNameDisplay');
        const scoreDisplay = document.getElementById('totalScoreDisplay');

        if (profileDiv && nameDisplay && scoreDisplay) {
            nameDisplay.textContent = userName;
            scoreDisplay.textContent = GameUtils.getTotalScore(games);
            profileDiv.style.display = 'block';
        }

        renderHubGrid();
        renderGlobalLeaderboard(); // Tümü render edilsin
    }
}

function renderHubGrid() {
    const hubGrid = document.getElementById('gameHub');
    hubGrid.innerHTML = ''; // Temizle

    games.forEach(game => {
        const isComingSoon = game.url === '#';
        const card = document.createElement('a');
        card.href = game.url;
        card.className = 'game-card';
        if (isComingSoon) {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
            card.addEventListener('click', e => e.preventDefault());
        }

        // Oyuna ait skoru getir
        const gameScore = GameUtils.getScore(game.id);
        const scoreBadge = !isComingSoon ?
            `<div style="font-size: 0.7rem; color: var(--yellow); margin-top: 10px; font-weight: bold;">
                ▸ EN İYİ SKOR: ${gameScore}
             </div>` : '';

        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">${game.title}</div>
            <div class="game-desc">${game.desc}</div>
            <div class="btn play-btn" style="${isComingSoon ? 'border-color:#555; color:#555;' : ''}">${isComingSoon ? 'KİLİTLİ' : '▸ BAŞLAT'}</div>
            ${scoreBadge}
        `;
        hubGrid.appendChild(card);
    });
}

function renderGlobalLeaderboard() {
    const listEl = document.getElementById('globalLeaderboardList');
    if (!listEl) return;

    if (typeof GameUtils === 'undefined') return;

    const usersData = GameUtils._getUsersData();
    let board = [];

    // Her kullanıcının toplam skorunu hesapla
    for (let uName in usersData) {
        let uTotal = 0;
        games.forEach(g => {
            if (usersData[uName][g.id]) {
                uTotal += parseInt(usersData[uName][g.id]);
            }
        });
        if (uTotal > 0) {
            board.push({ name: uName, score: uTotal });
        }
    }

    // Skorları Sırala (Büyükten küçüğe)
    board.sort((a, b) => b.score - a.score);

    listEl.innerHTML = '';
    if (board.length === 0) {
        listEl.innerHTML = '<span style="color:#777;">Sistemde ajan kaydı bulunamadı. Lütfen oynayınız.</span>';
        return;
    }

    board.forEach((user, index) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dotted rgba(255, 45, 120, 0.3);';

        let colorRank = index === 0 ? "var(--yellow)" : (index === 1 ? "#C0C0C0" : "var(--cyan)");
        let iconRank = index === 0 ? "👑" : `${index + 1}.`;

        row.innerHTML = `<span style="color: ${colorRank}; font-weight: bold;">${iconRank} ${user.name}</span> <span style="color: var(--pink); font-weight: bold;">${user.score} P</span>`;
        listEl.appendChild(row);
    });
}

function initHub() {
    checkUserAndRender();
}

window.addEventListener('load', initHub);
