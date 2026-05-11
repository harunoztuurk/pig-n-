// Geometrik Parçalar (SVG formatında)
const levelsData = [
    {
        id: 1,
        title: "Kayıp Kare (Square Dissection)",
        questionText: "Aşağıdaki rastgele dağılmış 4 üçgeni merkeze doğru sürükleyerek kusursuz bir 'Kare' elde et. İpucu: Tam ortada birleşecekler.",
        hint: "Hipotenüsleri (uzun kenarları) dışarıya bakacak şekilde çevirin.",
        // Hedef şekil (Kare) kesik çizgili (ghost)
        targetSVG: `<svg width="200" height="200" viewBox="0 0 200 200"><rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-dasharray="10,5"/></svg>`,
        targetWidth: 200,
        targetHeight: 200,
        pieces: [
            // Her parçanın hedef içerisindeki x,y (offset) koordinatları ve kendi SVG'si
            {
                id: 'p1',
                // Üst sol üçgen
                svg: `<svg width="100" height="100" viewBox="0 0 100 100"><polygon points="0,0 100,100 0,100" fill="var(--shape-color-1)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 0,
                targetY: 0,
                startX: 50, startY: 50
            },
            {
                id: 'p2',
                // Üst sağ üçgen
                svg: `<svg width="100" height="100" viewBox="0 0 100 100"><polygon points="0,100 100,0 100,100" fill="var(--shape-color-2)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 100,
                targetY: 0,
                startX: 600, startY: 80
            },
            {
                id: 'p3',
                // Alt sol üçgen
                svg: `<svg width="100" height="100" viewBox="0 0 100 100"><polygon points="0,0 100,0 0,100" fill="var(--shape-color-3)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 0,
                targetY: 100,
                startX: 100, startY: 350
            },
            {
                id: 'p4',
                // Alt sağ üçgen
                svg: `<svg width="100" height="100" viewBox="0 0 100 100"><polygon points="0,0 100,0 100,100" fill="var(--shape-color-4)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 100,
                targetY: 100,
                startX: 550, startY: 300
            }
        ]
    },
    {
        id: 2,
        title: "T-Bulmacası (T-Puzzle)",
        questionText: "Bu meşhur Yoshigahara T-Tangram puzzle'ını çözmek zor olabilir. Bütün parçaları merkezde kullanarak kusursuz bir 'T' harfi oluştur.",
        hint: "Maviyi üste yatay koy, kırmızıyı çapraz kesimle alta hizala.",
        targetSVG: `<svg width="200" height="250" viewBox="0 0 200 250">
            <polygon points="0,0 200,0 200,50 125,50 125,250 75,250 75,50 0,50" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-dasharray="10,5"/>
        </svg>`,
        targetWidth: 200,
        targetHeight: 250,
        pieces: [
            {
                id: 'p1', // Üst yatay çubuk (Dikdörtgen)
                svg: `<svg width="200" height="50" viewBox="0 0 200 50"><polygon points="0,0 200,0 200,50 0,50" fill="var(--shape-color-2)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 0, targetY: 0,
                startX: 150, startY: 350
            },
            {
                id: 'p2', // T Alt Sol boşluk parçası (Yarım yamuk/üçgen benzeri. Basitleştirildi)
                svg: `<svg width="50" height="100" viewBox="0 0 50 100"><polygon points="0,0 50,0 50,100 0,100" fill="var(--shape-color-1)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 75, targetY: 50,
                startX: 50, startY: 150
            },
            {
                id: 'p3', // Alt kısmı
                svg: `<svg width="50" height="100" viewBox="0 0 50 100"><polygon points="0,0 50,0 50,100 0,100" fill="var(--shape-color-3)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 75, targetY: 150,
                startX: 600, startY: 200
            }
        ]
    },
    {
        id: 3,
        title: "Alan Eşitleme (Mimar)",
        questionText: "Elimizde 3 farklı üçgen var. Bu üçgenleri hedefteki altıgen alana boşluksuz oturacak şekilde taşı. Noktalar kilitlenecektir.",
        hint: "Önce en büyük üçgeni merkeze konumlandırın.",
        targetSVG: `<svg width="300" height="200" viewBox="0 0 300 200">
            <polygon points="50,0 250,0 300,100 250,200 50,200 0,100" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-dasharray="10,5"/>
        </svg>`,
        targetWidth: 300,
        targetHeight: 200,
        pieces: [
            {
                id: 'p1', 
                svg: `<svg width="200" height="200" viewBox="0 0 200 200"><polygon points="0,0 200,100 0,200" fill="var(--shape-color-4)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 50, targetY: 0,
                startX: 450, startY: 250
            },
            {
                id: 'p2', 
                svg: `<svg width="100" height="100" viewBox="0 0 100 100"><polygon points="0,100 50,0 100,100" fill="var(--shape-color-5)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 0, targetY: 100,
                startX: 50, startY: 50
            },
            {
                id: 'p3', 
                svg: `<svg width="100" height="100" viewBox="0 0 100 100"><polygon points="0,0 100,0 50,100" fill="var(--shape-color-1)" stroke="#fff" stroke-width="1"/></svg>`,
                targetX: 200, targetY: 0,
                startX: 550, startY: 100
            }
            // Not: Basitleştirilmiş kurgusal altıgen alan eşitlemesi
        ]
    }
];
