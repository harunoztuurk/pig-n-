const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Geometrik Parçalama - ${i}. Şekil`,
        questionText: `Verilen şekli tam olarak ${i % 3 + 2} parçaya bölerek bir kare oluşturun.`,
        hint: 'Açıları korumaya çalışın.',
        pieces: i % 3 + 2
    });
}