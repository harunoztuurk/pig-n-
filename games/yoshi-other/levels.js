// games/yoshi-other/levels.js

const levelsData = [];

function generateOtherLevels() {
    for (let i = 1; i <= 50; i++) {
        // Switch between Ponzo and Ebbinghaus based on level number
        const type = i % 2 !== 0 ? "ponzo" : "ebbinghaus";
        
        // As level increases, tolerance gets stricter
        let tolerance = 5;
        if (i > 10) tolerance = 4;
        if (i > 30) tolerance = 3;
        if (i > 40) tolerance = 2;

        if (type === "ponzo") {
            const targetLength = Math.floor(Math.random() * 100) + 50; // 50 to 150
            const initialValue = Math.floor(Math.random() * 150) + 30;
            
            levelsData.push({
                id: i,
                title: `Ponzo Yanılsaması - Seviye ${i}`,
                questionText: "Kırmızı çizgiyi, Siyah çizgiyle *tam olarak aynı uzunluğa* gelene kadar kaydırıcıyla esnetin.",
                hint: "Daralan perspektif çizgileri gözünüzü yanıltır. Üstteki çizgi (kırmızı) olduğundan daha uzunmuş gibi algılanır. Hedefe ulaşmak için mantığınıza güvenin.",
                type: "ponzo",
                targetLength: targetLength,
                initialValue: initialValue,
                tolerance: tolerance
            });
        } else {
            const targetLength = Math.floor(Math.random() * 60) + 30; // 30 to 90
            const initialValue = Math.floor(Math.random() * 100) + 20;

            levelsData.push({
                id: i,
                title: `Titchener (Ebbinghaus) Daireleri - Seviye ${i}`,
                questionText: "Sağdaki Kırmızı ve soldaki Siyah merkez daireleri *tam olarak eşit büyüklükte* yapana kadar ayarlayın.",
                hint: "Büyük dairelerle çevrili olan merkez, küçükmüş gibi algılanır. Aynı şekilde küçük dairelerle çevrili olan merkez de olduğundan büyükmüş gibi gelir.",
                type: "ebbinghaus",
                targetLength: targetLength,
                initialValue: initialValue,
                tolerance: tolerance
            });
        }
    }
}

generateOtherLevels();
