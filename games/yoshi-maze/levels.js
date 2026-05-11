const levelsData = [
    {
        id: 1,
        title: "Yön Tuşları: Temel Rota",
        questionText: "Işıklı küreyi hedefe (★) sağ salim ulaştırın. Kırmızı duvarlara (W) basamazsınız. W,A,S,D veya Yön Tuşlarını kullanın.",
        hint: "Oldukça basit; yolu takip edin.",
        columns: 5,
        rows: 5,
        type: "normal", // Her adımda bir kare durarak
        grid: [
            ['S', '0', 'W', '0', '0'],
            ['W', '0', 'W', '0', 'W'],
            ['0', '0', '0', '0', '0'],
            ['0', 'W', 'W', 'W', '0'],
            ['0', '0', '0', 'G', '0'],
        ]
    },
    {
        id: 2,
        title: "Zorunlu İstikamet (Arrow Maze)",
        questionText: "Zemindeki oklar, size SADECE o yöne hareket etme izni verir. (↑: Yukarı, ↓: Aşağı, →: Sağ, ←: Sol). Boş zeminlerde özgürsünüz.",
        hint: "Yanlış oka basarsanız duvara veya boşluğa hapsolur, 'Tekrar Dene' yapmak zorunda kalırsınız.",
        columns: 6,
        rows: 6,
        type: "arrow",
        grid: [
            ['S', '→', '↓', 'W', '0', '0'],
            ['W', '↓', '0', '←', 'W', '↓'],
            ['0', '→', '→', '↓', '0', '↓'],
            ['↑', 'W', '0', 'W', 'W', '↓'],
            ['↑', '←', '←', '↓', '0', '↓'],
            ['←', 'W', '0', '→', '→', 'G'],
        ]
    },
    {
        id: 3,
        title: "Buzlu Neon Zemin (Ice Slider)",
        questionText: "Bir yöne hareket ettiğinizde, bir engele (kırmızı duvar veya ekran sonu) çarpana kadar DURAMAZSINIZ. Kayarak hedefe (★) tam isabet sağlamalısınız.",
        hint: "Direkt hedefe gidemezsiniz, çünkü kayıp geçersiniz. Önce sağdaki ya da alttaki bir duvara çarpıp orada 'fren' yapmalı, sonra hedefe yönelmelisiniz.",
        columns: 6,
        rows: 6,
        type: "ice",
        grid: [
            ['S', '0', '0', '0', 'W', '0'],
            ['0', 'W', '0', '0', '0', '0'],
            ['0', '0', '0', '0', 'W', '0'],
            ['W', '0', '0', 'G', '0', '0'],
            ['0', '0', 'W', '0', '0', 'W'],
            ['0', 'W', '0', '0', '0', '0'],
        ]
    }
];
