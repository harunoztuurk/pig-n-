const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { player, gameId, score } = req.body;
    if (!player || !gameId || typeof score === 'undefined') {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        return res.status(200).json({ _error: "NEON_DB_NOT_CONFIGURED", success: false });
    }

    try {
        const sql = neon(dbUrl);
        const newScore = parseInt(score);

        // UPSERT mantığı: Kayıt yoksa ekle, varsa ve yeni skor daha büyükse güncelle
        await sql`
            INSERT INTO player_scores (player, game_id, score)
            VALUES (${player}, ${gameId}, ${newScore})
            ON CONFLICT (player, game_id)
            DO UPDATE SET score = GREATEST(player_scores.score, EXCLUDED.score);
        `;

        return res.status(200).json({ success: true, player, gameId, score: newScore });

    } catch (error) {
        console.error("Neon DB update error:", error);
        return res.status(500).json({ error: "Failed to update score in Neon." });
    }
};
