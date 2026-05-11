const levelsData = [
    {
        id: 1,
        title: "Zamanı Bölmek",
        questionText: "Saat kadranına 2 adet çapraz/düz lazer çizgisi çekerek saati 3 parçaya bölün. Öyle ki her bir parçada kalan rakamların TOPLAMI tam olarak 26 olsun.",
        hint: "Toplam 78 eder, 78/3 = 26. \nParça 1: 11, 12, 1, 2\nParça 2: 9, 10, 3, 4\nParça 3: 5, 6, 7, 8\nLazerler bu sayı grupları arasından geçmelidir.",
        linesAllowed: 2,
        targetSum: 26,
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    {
        id: 2,
        title: "Kusursuz Simetri",
        questionText: "Lazerinizi 5 kez kullanarak saati 6 eşit parçaya bölün. Her parçanın toplamı tam 13 olmalı.",
        hint: "Toplam 78 / 6 = 13. Karşılıklı sayılar değil, ardışık sayı kombinasyonları: 12+1=13, 2+11=13, 3+10=13 vb. Lazerleri öyle çekin ki sadece bu iki sayı aynı alanda kalsın.",
        linesAllowed: 5,
        targetSum: 13,
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
];
