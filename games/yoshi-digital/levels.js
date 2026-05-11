const levelsData = [
    {
        id: 1,
        title: "Sistem Arızası: Rakam Dönüşümü",
        questionText: "Ekranda hatalı olarak '8' rakamı yanıyor. Sadece FAZLA olan hata çubuğuna tıklayarak bunu '0' (Sıfır) rakamına dönüştürün.",
        hint: "Sıfır rakamında ortadaki yatay çizgi olmaz. Söndürmek için üzerine tıklayın.",
        digits: [
            {
                id: 'digit_1',
                initialON: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], // 8
                targetON: ['a', 'b', 'c', 'd', 'e', 'f'] // 0 (g kapalı)
            }
        ]
    },
    {
        id: 2,
        title: "Hata Kodu: EORR -> ERROR",
        questionText: "Sistem 'EORR' yazıyor ancak kelimenin 'ERROR' (HATA) olması gerek! Çubuklara tıklayarak doğru kelimeyi yazın.",
        hint: "O harfini R yapmak için ortadaki çubuğu yakın ve alt çizgiyi söndürün, E(a,d,e,f,g) R(a,e,f) R(a,e,f) O(a,b,c,d,e,f) R(a,e,f)... Basit R harfi için sadece a,e,f kullanabilirsiniz veya küçük r (e,g). Tam hedef: E R R O R. \n\nE: a,d,e,f,g\nR: e,g (küçük r)\nO: c,d,e,g (küçük o)",
        digits: [
            {
                id: 'd1', // E
                initialON: ['a', 'd', 'e', 'f', 'g'], // E
                targetON: ['a', 'd', 'e', 'f', 'g'] // E
            },
            {
                id: 'd2', // O -> r
                initialON: ['c', 'd', 'e', 'g'], // küçük o
                targetON: ['e', 'g'] // küçük r
            },
            {
                id: 'd3', // r -> r
                initialON: ['e', 'g'], // küçük r
                targetON: ['e', 'g'] // r
            },
            {
                id: 'd4', // r -> o
                initialON: ['e', 'g'], // küçük r
                targetON: ['c', 'd', 'e', 'g'] // küçük o
            },
            {
                id: 'd5', // r (EORRr sonu yoktu ama baştan yazalım)
                initialON: ['e', 'g'], // küçük r
                targetON: ['e', 'g'] // r
            }
        ]
    },
    {
        id: 3,
        title: "Ayna Görüntüsü (Simetri)",
        questionText: "Ekranda yanan sayı '2 5'. Bu sayının aynadaki kusursuz yansıması olan sayıyı yazmanız gerekiyor.",
        hint: "2'nin aynadaki tersi 5 gibi görünür. 5'in aynadaki tersi ise 2 gibi görünür. Yani hedef '5 2' olmalıdır.",
        digits: [
            {
                id: 'd1', // 2 -> 5
                initialON: ['a', 'b', 'd', 'e', 'g'], // 2
                targetON: ['a', 'c', 'd', 'f', 'g'] // 5
            },
            {
                id: 'd2', // 5 -> 2
                initialON: ['a', 'c', 'd', 'f', 'g'], // 5
                targetON: ['a', 'b', 'd', 'e', 'g'] // 2
            }
        ]
    }
];
