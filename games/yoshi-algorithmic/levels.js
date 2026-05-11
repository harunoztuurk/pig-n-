const levelsData = [
    {
        id: 1,
        title: "Döngü İşlemi (Temel)",
        questionText: "Girdi değerini Hedef değere ulaştırmak için aşağıdaki komut bloklarını işlem hattına (pipeline) sırayla sürükleyin.",
        hint: "Verilen bloklar her adımda Input değerini değiştirir.\nSıralama: *2, +5 derseniz: (10 * 2) + 5 = 25 yapar.",
        input: 5,
        target: 21,
        maxSlots: 3,
        commands: [
            { id: 'c1', label: '+ 5', action: (val) => val + 5 },
            { id: 'c2', label: '* 3', action: (val) => val * 3 },
            { id: 'c3', label: '- 4', action: (val) => val - 4 }
        ],
        // Doğru sıralama: 5 -> +5 (10) -> -4 (6) -> *3 (18) Olamaz.
        // 5 -> *3 (15) -> +5 (20) Olamaz.
        // 5 -> *3 (15) -> -4 (11) Olamaz.
        // Wait, commands are array of objects. Let's make an exact combination.
        // If they use: +5 (10) -> *3 (30) -> -4 (26) No.
        // Let's adjust target:
        // 5 * 3 = 15. 15 + 6 = 21.
        // Let's redefine commands for Level 1:
    }
];

// Let's redefine levels safely:
levelsData[0] = {
    id: 1,
    title: "Derleme Süreci #1",
    questionText: "Girdi (Input) değerinden Hedef Çıktı (Output) değerine ulaşmak için komut bloklarını sürükleyin. Tüm yuvaları kullanmak zorunda değilsiniz.",
    hint: "5 sayısı ile başlıyorsunuz.\nKomut: `x 3` yaparsanız 15 olur.\nKomut: `+ 6` yaparsanız 21 olur.",
    input: 5,
    target: 21,
    maxSlots: 2,
    commands: [
        { id: 'add6', label: '+ 6', type: 'add', val: 6 },
        { id: 'mul3', label: 'x 3', type: 'mul', val: 3 },
        { id: 'sub2', label: '- 2', type: 'sub', val: 2 }
    ]
};

levelsData[1] = {
    id: 2,
    title: "Derleme Süreci #2 (Tersine Mühendislik)",
    questionText: "Buradaki özel `REV` (Reverse) bloğu, sayının rakamlarını ters çevirir (Örn: 12 -> 21). Hedefe ulaşın.",
    hint: "12 + 6 = 18.\n18 * 2 = 36.\n36 ters çevrilirse (REV) 63 olur.",
    input: 12,
    target: 63,
    maxSlots: 3,
    commands: [
        { id: 'mul2', label: 'x 2', type: 'mul', val: 2 },
        { id: 'rev', label: 'REV()', type: 'rev', val: 0 },
        { id: 'add6', label: '+ 6', type: 'add', val: 6 },
        { id: 'div2', label: '/ 2', type: 'div', val: 2 }
    ]
};

levelsData[2] = {
    id: 3,
    title: "Sonsuz Döngü Hatası",
    questionText: "Matematiksel işlemleri komut satırına öyle bir dizin ki, 7 sayısından 100 sayısına ulaşın.",
    hint: "7x2 = 14. 14 ters çevir 41. 41+9 = 50. 50x2 = 100.",
    input: 7,
    target: 100,
    maxSlots: 4,
    commands: [
        { id: 'mul2', label: 'x 2', type: 'mul', val: 2 },
        { id: 'add9', label: '+ 9', type: 'add', val: 9 },
        { id: 'rev', label: 'REV()', type: 'rev', val: 0 },
        { id: 'mul3', label: 'x 3', type: 'mul', val: 3 }
    ]
};
