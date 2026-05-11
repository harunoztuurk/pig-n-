const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Yedi Segment - Kırılma ${i}`,
        questionText: `Ekranda görünen dijital sayıda 1 çubuğun yerini değiştirerek en büyük sayıyı elde edin.`,
        hint: 'Sıfırları dokuzlara dönüştürmek her zaman kazandırır.',
        number: 800 + i
    });
}