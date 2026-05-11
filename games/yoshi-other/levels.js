const levelsData = [
    {
        id: 1,
        title: "Ponzo Yanılsaması",
        questionText: "Kırmızı çizgiyi, Siyah çizgiyle *tam olarak aynı uzunluğa* gelene kadar kaydırıcıyla esnetin.",
        hint: "Daralan perspektif çizgileri gözünüzü yanıltır. Üstteki çizgi (kırmızı) olduğundan daha uzunmuş gibi algılanır. Hedefe ulaşmak için mantığınıza güvenin.",
        type: "ponzo",
        targetLength: 100, // Referans black objenin size'ı
        initialValue: 50,
        tolerance: 5 // %5 hata payı
    },
    {
        id: 2,
        title: "Titchener (Ebbinghaus) Daireleri",
        questionText: "Sağdaki Kırmızı ve soldaki Siyah merkez daireleri *tam olarak eşit büyüklükte* yapana kadar ayarlayın.",
        hint: "Büyük dairelerle çevrili olan merkez, küçükmüş gibi algılanır. Aynı şekilde küçük dairelerle çevrili olan merkez de olduğundan büyükmüş gibi gelir.",
        type: "ebbinghaus",
        targetLength: 60, // Siyah merkezin çapı
        initialValue: 100,
        tolerance: 5
    }
];
