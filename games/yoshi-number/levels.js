const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Sayı Piramidi - ${i}`,
        questionText: `Soru işareti yerine hangi sayı gelmelidir?`,
        hint: 'Alt iki sayının toplamı üstteki sayıyı veriyor.',
        target: i * 3
    });
}