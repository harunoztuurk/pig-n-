const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Kombinasyon - Seçim ${i}`,
        questionText: `${i + 3} farklı nesneden ${Math.floor((i+3)/2)} tanesini seçme yollarını hesaplayın.`,
        hint: 'C(n,r) formülünü hatırlayın.',
        n: i + 3,
        r: Math.floor((i+3)/2)
    });
}