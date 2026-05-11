const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Algoritma Kapıları - Aşama ${i}`,
        questionText: `${i > 25 ? 'Karmaşık' : 'Temel'} mantık kapılarını (AND, OR, XOR) çözün.`,
        hint: 'Çıktının 1 olması için hangi girdilerin 1 olması gerektiğini düşünün.',
        difficulty: i
    });
}