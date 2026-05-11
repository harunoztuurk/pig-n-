const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Örüntü Tanıma - G.${i}`,
        questionText: `Dizideki sıradaki sayıyı bulun: ${i}, ${i+2}, ${i+5}, ${i+9}, ?`,
        hint: 'Artış miktarı sürekli 1 artıyor.',
        answer: i + 14
    });
}