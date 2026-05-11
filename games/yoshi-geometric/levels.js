const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Açı ve Alan - Soru ${i}`,
        questionText: `Boyalı bölgenin alanını hesaplayın. Yarıçap r=${i}.`,
        hint: 'Dairenin alanından üçgeni çıkarın.',
        radius: i
    });
}