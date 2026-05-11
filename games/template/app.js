// YENİ OYUNA AİT JAVASCRIPT KODLARI
// utils.js dosyasından GameUtils.showModal veya GameUtils.triggerSuccessEffect kullanılabilir.

// !! ÖNEMLİ !!
// Kendi oyununuzun benzersiz ID'sini ('template' yerine) ve kazanacağı puanı buraya yazın.
const THIS_GAME_ID = 'template-game';
const SCORE_TO_AWARD = 100;

function checkGame() {
    console.log("Oyun kontrol ediliyor...");

    // Varsayılan başarılı kontrol örneği (Kendi oyununuzun mantığını buraya kurun)
    const isSuccess = true;

    if (isSuccess) {
        GameUtils.showModal("GÖREV TAMAMLANDI", "Tebrikler, bu oyun başarıyla tamamlandı.");
        GameUtils.triggerSuccessEffect();

        // BAŞARILI OLUNCA SKORU KAYDET:
        if (typeof GameUtils !== 'undefined' && GameUtils.saveScore) {
            GameUtils.saveScore(THIS_GAME_ID, SCORE_TO_AWARD);
        }

    } else {
        GameUtils.showModal("HATALI DENEME", "Şifre/Yanıt yanlış, tekrar dene.", false);
    }
}
