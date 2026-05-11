const { neon } = require('@neondatabase/serverless');

// Her çağrıda tabloyu garantiye almak için bir kere tablo oluşturma eylemini fırlat
let tableInitialized = false;

module.exports = async (req, res) => {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        return res.status(200).json({ _error: "NEON_DB_NOT_CONFIGURED" });
    }

    try {
        const sql = neon(dbUrl);

        if (!tableInitialized) {
            await sql`
                CREATE TABLE IF NOT EXISTS player_scores (
                    player VARCHAR(255) NOT NULL,
                    game_id VARCHAR(255) NOT NULL,
                    score INTEGER NOT NULL,
                    PRIMARY KEY (player, game_id)
                );
            `;
            tableInitialized = true;
        }

        // Tüm verileri çek
        const rows = await sql`SELECT player, game_id, score FROM player_scores`;

        // Vercel KV veri yapısına dönüştür: { "PlayerName": { "game-id": 100 } }
        const usersData = {};
        for (const row of rows) {
            if (!usersData[row.player]) {
                usersData[row.player] = {};
            }
            usersData[row.player][row.game_id] = row.score;
        }

        return res.status(200).json(usersData);
    } catch (error) {
        console.error("Neon DB fetch error:", error);
        return res.status(500).json({ error: "Failed to fetch top scores from Neon." });
    }
};
