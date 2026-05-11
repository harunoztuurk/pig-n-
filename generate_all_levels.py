import os

generators = {
    'yoshi-algorithmic': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Algoritma Kapıları - Aşama ${i}`,
        questionText: `${i > 25 ? 'Karmaşık' : 'Temel'} mantık kapılarını (AND, OR, XOR) çözün.`,
        hint: 'Çıktının 1 olması için hangi girdilerin 1 olması gerektiğini düşünün.',
        difficulty: i
    });
}""",
    
    'yoshi-combinatorial': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Kombinasyon - Seçim ${i}`,
        questionText: `${i + 3} farklı nesneden ${Math.floor((i+3)/2)} tanesini seçme yollarını hesaplayın.`,
        hint: 'C(n,r) formülünü hatırlayın.',
        n: i + 3,
        r: Math.floor((i+3)/2)
    });
}""",

    'yoshi-digital': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Yedi Segment - Kırılma ${i}`,
        questionText: `Ekranda görünen dijital sayıda 1 çubuğun yerini değiştirerek en büyük sayıyı elde edin.`,
        hint: 'Sıfırları dokuzlara dönüştürmek her zaman kazandırır.',
        number: 800 + i
    });
}""",

    'yoshi-dissection': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Geometrik Parçalama - ${i}. Şekil`,
        questionText: `Verilen şekli tam olarak ${i % 3 + 2} parçaya bölerek bir kare oluşturun.`,
        hint: 'Açıları korumaya çalışın.',
        pieces: i % 3 + 2
    });
}""",

    'yoshi-geometric': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Açı ve Alan - Soru ${i}`,
        questionText: `Boyalı bölgenin alanını hesaplayın. Yarıçap r=${i}.`,
        hint: 'Dairenin alanından üçgeni çıkarın.',
        radius: i
    });
}""",

    'yoshi-introductory': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Örüntü Tanıma - G.${i}`,
        questionText: `Dizideki sıradaki sayıyı bulun: ${i}, ${i+2}, ${i+5}, ${i+9}, ?`,
        hint: 'Artış miktarı sürekli 1 artıyor.',
        answer: i + 14
    });
}""",

    'yoshi-matchstick': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Kibrit Denklemi - ${i}`,
        questionText: `1 kibrit çöpünün yerini değiştirerek eşitliği sağlayın.`,
        hint: 'V rakamını X yapmayı düşünün.',
        level: i
    });
}""",

    'yoshi-maze': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    const types = ['normal', 'arrow', 'ice'];
    const type = types[i % 3];
    const size = 5 + Math.floor(i / 10);
    
    // Create a simple dummy grid
    let grid = [];
    for(let r = 0; r < size; r++){
        let row = [];
        for(let c = 0; c < size; c++){
            if(r===0 && c===0) row.push('S');
            else if(r===size-1 && c===size-1) row.push('G');
            else row.push((Math.random() < 0.2) ? 'W' : '0');
        }
        grid.push(row);
    }
    
    levelsData.push({
        id: i,
        title: `Labirent - Kat ${i}`,
        questionText: type === 'ice' ? 'Buzlu zeminde kayın.' : 'Hedefe ulaşın.',
        hint: 'Duvarlara dikkat edin.',
        columns: size,
        rows: size,
        type: type,
        grid: grid
    });
}""",

    'yoshi-number': """const levelsData = [];
for (let i = 1; i <= 50; i++) {
    levelsData.push({
        id: i,
        title: `Sayı Piramidi - ${i}`,
        questionText: `Soru işareti yerine hangi sayı gelmelidir?`,
        hint: 'Alt iki sayının toplamı üstteki sayıyı veriyor.',
        target: i * 3
    });
}"""
}

import os
games_dir = 'games'

for game, content in generators.items():
    level_file = os.path.join(games_dir, game, 'levels.js')
    if os.path.exists(os.path.join(games_dir, game)):
        with open(level_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Generated levels for {game}")
