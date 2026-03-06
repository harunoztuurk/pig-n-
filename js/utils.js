// MÜFIT ŞAN - OYUN PLATFORMU ORTAK FONKSİYONLAR (UTILS)

window.GameUtils = {
    /**
     * Ekranda bildirim gösterir (Örn: Kazanma, Kaybetme, Bilgi)
     */
    showModal: function (title, message, isSuccess = true) {
        // Önceden açık modal varsa kapat
        let existing = document.getElementById('cyber-alert-modal');
        if (existing) existing.remove();

        const prefix = isSuccess ? "[ BAŞARILI ]" : "[ SİSTEM UYARISI ]";
        const typeClass = isSuccess ? "success" : "error";
        const formattedMsg = message.replace(/\n/g, '<br>');

        const modalHtml = `
            <div id="cyber-alert-modal" class="system-alert-overlay">
                <div class="system-alert-box ${typeClass}">
                    <div class="system-alert-prefix">${prefix}</div>
                    <div class="system-alert-title">${title}</div>
                    <div class="system-alert-msg">${formattedMsg}</div>
                    <button class="system-alert-btn" onclick="document.getElementById('cyber-alert-modal').remove(); if(typeof GameUtils !== 'undefined' && GameUtils.playSound) GameUtils.playSound('click');">ONAYLA</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    /**
     * Konfeti veya görsel başarı efekti patlatır
     */
    triggerSuccessEffect: function () {
        // İleride buraya canvas bazlı konfeti/neon patlama efekti eklenebilir.
        console.log(">>> BAŞARI EFEKTİ TETİKLENDİ <<<");
    },

    // --- KULLANICI & SKOR YÖNETİMİ (ÇOKLU OTURUM) ---

    /**
     * Tüm kullanıcı verilerini çeker
     */
    _getUsersData: function () {
        try {
            let data = localStorage.getItem('game_users');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    /**
     * Tüm kullanıcı verilerini kaydeder
     */
    _saveUsersData: function (data) {
        try {
            localStorage.setItem('game_users', JSON.stringify(data));
        } catch (e) {
            console.error("Local storage hatası:", e);
        }
    },

    /**
     * O anki aktif kullanıcı adını çeker, yoksa null döner
     */
    getUserName: function () {
        try {
            return localStorage.getItem('current_player');
        } catch (e) {
            return null;
        }
    },

    /**
     * Kullanıcı adını ayarlayıp giriş (login) yapar
     */
    setUserName: function (name) {
        if (!name) return;
        // Tüm isimleri küçük harfe çevirerek eşleştirme riskini ortadan kaldırıyoruz
        name = name.trim().toLowerCase();
        try {
            localStorage.setItem('current_player', name);

            // Eğer kullanıcı ilk defa giriyorsa veritabanında ona obje aç
            let usersData = this._getUsersData();
            if (!usersData[name]) {
                usersData[name] = {};
                this._saveUsersData(usersData);
                console.log(`Yeni oyuncu kaydı açıldı: ${name}`);
            }
        } catch (e) {
            console.error("Local storage hatası:", e);
        }
    },

    /**
     * Çıkış yapar (Aktif kullanıcıyı siler)
     */
    logoutUser: function () {
        try {
            localStorage.removeItem('current_player');
            location.reload(); // Sayfayı yenileyerek modal ekranını tekrar göster
        } catch (e) {
            console.error("Local storage hatası:", e);
        }
    },

    /**
     * Aktif kullanıcının belirli bir oyunundaki skorunu döner
     */
    getScore: function (gameId) {
        try {
            let currentPlayer = this.getUserName();
            if (!currentPlayer) return 0;

            let usersData = this._getUsersData();
            let userScores = usersData[currentPlayer];

            if (userScores && userScores[gameId]) {
                return parseInt(userScores[gameId]);
            }
            return 0;
        } catch (e) {
            return 0;
        }
    },

    /**
     * Oynanan oyundan kazanılan yeni puanı aktif kullanıcı adına yazar
     */
    saveScore: function (gameId, score) {
        try {
            let currentPlayer = this.getUserName();
            if (!currentPlayer) return;

            let currentScore = this.getScore(gameId);
            if (score > currentScore) { // Yalnızca yüksek skor kaydedilsin
                let usersData = this._getUsersData();
                if (!usersData[currentPlayer]) usersData[currentPlayer] = {};

                usersData[currentPlayer][gameId] = score;
                this._saveUsersData(usersData);
                console.log(`${currentPlayer} oyuncusunun ${gameId} skoru güncellendi: ${score}`);
            }
        } catch (e) {
            console.error("Local storage hatası:", e);
        }
    },

    /**
     * Bütün oyunlardaki skorları hesaplayıp toplamını döner
     */
    getTotalScore: function (gamesList) {
        if (!gamesList || !Array.isArray(gamesList)) return 0;
        let total = 0;
        gamesList.forEach(game => {
            total += this.getScore(game.id);
        });
        return total;
    },

    // --- SES ve MEDYA SİSTEMİ (WEB AUDIO API) ---

    _audioCtx: null,

    /**
     * Cyberpunk tarzı sentetik (synth) ses üretici
     * type: 'click', 'error', 'success', 'hover'
     */
    playSound: function (type) {
        try {
            if (!this._audioCtx) {
                this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this._audioCtx.state === 'suspended') {
                this._audioCtx.resume();
            }

            const osc = this._audioCtx.createOscillator();
            const gain = this._audioCtx.createGain();

            osc.connect(gain);
            gain.connect(this._audioCtx.destination);

            const now = this._audioCtx.currentTime;

            if (type === 'click' || type === 'hover') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(type === 'hover' ? 300 : 600, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

                osc.start(now);
                osc.stop(now + 0.1);
            }
            else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.3);

                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

                osc.start(now);
                osc.stop(now + 0.3);
            }
            else if (type === 'success') {
                osc.type = 'sine';

                // Arpeggio efekti
                osc.frequency.setValueAtTime(440, now); // A4
                osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
                osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
                osc.frequency.setValueAtTime(880, now + 0.3); // A5

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
                gain.gain.setValueAtTime(0.2, now + 0.3);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);

                osc.start(now);
                osc.stop(now + 0.5);
            }
        } catch (err) {
            console.warn("Ses çalınamadı (Kullanıcı etkileşimi gerekebilir):", err);
        }
    },

    // --- REKABET SİSTEMİ (LİDERLİK TABLOSU) ---

    /**
     * Verilen oyun ID'si için, puan alan oyuncuları sıralı dizi (descending) olarak döner
     * Return: [ {name: 'Gizem', score: 120}, {name: 'Deniz', score: 80} ... ]
     */
    getLeaderboard: function (gameId) {
        let usersData = this._getUsersData();
        let leaderboard = [];

        // Tüm kullanıcıları gez, sadece bu oyunda skoru 0'dan büyük olanları diziye at
        for (let userName in usersData) {
            if (usersData[userName].hasOwnProperty(gameId)) {
                let s = parseInt(usersData[userName][gameId]);
                if (s > 0) {
                    leaderboard.push({ name: userName, score: s });
                }
            }
        }

        // Skora göre Büyükten Küçüğe doğru sırala
        leaderboard.sort((a, b) => b.score - a.score);
        return leaderboard;
    }
};
