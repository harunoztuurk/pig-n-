// Matchstick Game Data Engine

// Puzzles have predefined "slots" where matchsticks can be placed.
// Slots have an id, x, y (top-left coordinates visually), and a rotation.
// The user starts with `initialMatches` slots filled.
// They can move exactly `maxMoves` matchsticks to achieve `targetMatches`.

const levelsData = [
    {
        id: 1,
        title: "Sandalye Problemi (Puzzle 2)",
        questionText: "Görselde 10 kibrit çöpü kullanılmış, ters duran (sola devrilmiş) bir sandalye görüyorsunuz.<br>Sadece <b>2 KİBRİT</b> oynatarak sandalyeyi düz, normal oturulabilir hale getirin.",
        // 6x6 Grid system
        boardWidth: 300,
        boardHeight: 300,
        maxMoves: 2,
        slots: [
            // Sandalye arkalığı ve oturak (Ters sola yatık)
            // Varsayım: Sırt kısmı yatay (alt), bacaklar yukarı doğru.

            { id: 1, type: "h", x: 50, y: 150 },   // sırt sol alt
            { id: 2, type: "h", x: 100, y: 150 },  // sırt orta alt
            { id: 3, type: "h", x: 150, y: 150 },  // sırt sağ alt (oturak çizgisi)
            { id: 4, type: "h", x: 200, y: 150 },  // bacak ucu (yanlış, bacak uzantısı)

            { id: 5, type: "v", x: 150, y: 100 },  // Oturak arka direk
            { id: 6, type: "v", x: 200, y: 100 },  // Oturak ön direk
            { id: 7, type: "h", x: 150, y: 100 },  // Oturak üst çizgi

            { id: 8, type: "v", x: 150, y: 50 },   // arka bacak üst
            { id: 9, type: "v", x: 200, y: 50 },    // ön bacak üst
            
            // To make it fully dynamic, we will provide a grid of possible slots.
            // Horizontal rows (y: 50, 100, 150, 200, 250)
            { id: "h1", type: "h", x: 50, y: 50 }, { id: "h2", type: "h", x: 100, y: 50 }, { id: "h3", type: "h", x: 150, y: 50 }, { id: "h4", type: "h", x: 200, y: 50 }, { id: "h5", type: "h", x: 250, y: 50 },
            { id: "h6", type: "h", x: 50, y: 100 }, { id: "h7", type: "h", x: 100, y: 100 }, { id: "h8", type: "h", x: 150, y: 100 }, { id: "h9", type: "h", x: 200, y: 100 }, { id: "h10", type: "h", x: 250, y: 100 },
            { id: "h11", type: "h", x: 50, y: 150 }, { id: "h12", type: "h", x: 100, y: 150 }, { id: "h13", type: "h", x: 150, y: 150 }, { id: "h14", type: "h", x: 200, y: 150 }, { id: "h15", type: "h", x: 250, y: 150 },
            { id: "h16", type: "h", x: 50, y: 200 }, { id: "h17", type: "h", x: 100, y: 200 }, { id: "h18", type: "h", x: 150, y: 200 }, { id: "h19", type: "h", x: 200, y: 200 }, { id: "h20", type: "h", x: 250, y: 200 },
            { id: "h21", type: "h", x: 50, y: 250 }, { id: "h22", type: "h", x: 100, y: 250 }, { id: "h23", type: "h", x: 150, y: 250 }, { id: "h24", type: "h", x: 200, y: 250 }, { id: "h25", type: "h", x: 250, y: 250 },
            // Vertical cols (x: 50, 100, 150, 200, 250)
            { id: "v1", type: "v", x: 50, y: 50 }, { id: "v2", type: "v", x: 100, y: 50 }, { id: "v3", type: "v", x: 150, y: 50 }, { id: "v4", type: "v", x: 200, y: 50 }, { id: "v5", type: "v", x: 250, y: 50 },
            { id: "v6", type: "v", x: 50, y: 100 }, { id: "v7", type: "v", x: 100, y: 100 }, { id: "v8", type: "v", x: 150, y: 100 }, { id: "v9", type: "v", x: 200, y: 100 }, { id: "v10", type: "v", x: 250, y: 100 },
            { id: "v11", type: "v", x: 50, y: 150 }, { id: "v12", type: "v", x: 100, y: 150 }, { id: "v13", type: "v", x: 150, y: 150 }, { id: "v14", type: "v", x: 200, y: 150 }, { id: "v15", type: "v", x: 250, y: 150 },
            { id: "v16", type: "v", x: 50, y: 200 }, { id: "v17", type: "v", x: 100, y: 200 }, { id: "v18", type: "v", x: 150, y: 200 }, { id: "v19", type: "v", x: 200, y: 200 }, { id: "v20", type: "v", x: 250, y: 200 }
        ],
        // The upside down (left-fallen) chair
        initialMatches: ["v6", "v7", "h6", "h11", "h12", "h13", "h14", "v12", "v13", "h17"],
        // The upright chair (solved)
        targetMatches: ["v6", "v7", "h6", "h11", "h12", "h13", "v12", "v13", "v17", "v18"],
        hint: "Sandalyenin arkalığını bozmayın, sadece en sağda çıkıntı yapan 2 kibriti alıp dik konuma getirmeyi deneyin."
    },
    {
        id: 2,
        title: "Kum Saati Problemi (Puzzle 1)",
        questionText: "9 kibrit çöpünden oluşan, dik duran bir kum saati görüyorsunuz. (Üst ve alt eşkenar üçgenler).<br>Sadece <b>4 KİBRİT</b> oynatarak bu kum saatini TERS yüz edilmiş (aşağı bakan) kum saatine çevirin.",
        // Triangular grid
        boardWidth: 300,
        boardHeight: 300,
        maxMoves: 4,
        slots: [
            // Horizontal
            { id: "h1", type: "h", x: 100, y: 50 },
            { id: "h2", type: "h", x: 100, y: 150 },
            { id: "h3", type: "h", x: 100, y: 250 },
            { id: "h4", type: "h", x: 50, y: 100 },
            { id: "h5", type: "h", x: 150, y: 100 },
            { id: "h6", type: "h", x: 50, y: 200 },
            { id: "h7", type: "h", x: 150, y: 200 },
            // Diagonals (Left leaning /)
            { id: "d1_1", type: "d1", x: 100, y: 50 },
            { id: "d1_2", type: "d1", x: 50, y: 100 },
            { id: "d1_3", type: "d1", x: 150, y: 150 },
            { id: "d1_4", type: "d1", x: 100, y: 150 },
            { id: "d1_5", type: "d1", x: 50, y: 200 },
            // Diagonals (Right leaning \)
            { id: "d2_1", type: "d2", x: 150, y: 50 },
            { id: "d2_2", type: "d2", x: 100, y: 100 },
            { id: "d2_3", type: "d2", x: 200, y: 100 },
            { id: "d2_4", type: "d2", x: 150, y: 150 },
            { id: "d2_5", type: "d2", x: 100, y: 200 }
        ],
        initialMatches: ["h1", "d1_1", "d2_1", "h2", "d1_4", "d2_4", "h3", "d1_3", "d2_2"], 
        // Note: The puzzle coordinates are mocked approximations for the engine.
        // We will make a visually functional sandbox instead of strict target checks for now if needed,
        // but for simplicity, we have defined target matches.
        targetMatches: ["h4", "d1_1", "d2_1", "h2", "d1_4", "d2_4", "h6", "d1_5", "d2_5"], 
        hint: "Alt üçgenin tabanını üst üçgenin tavanına kaydırın."
    }
];
