import db from '../database.js';

export async function getRanking(req, res) {
    const query = `
    SELECT us.id, us.name, COUNT(ur.*) as "linksCount", COALESCE(SUM(ur.views), 0) as "visitCount"
    FROM users us
    LEFT JOIN urls ur ON ur."userId" = us.id
    GROUP BY us.id
    ORDER BY "visitCount" DESC
    LIMIT 10
    `;

    try {
        const rankingSearch = await db.query(query, []);

        res.status(200).send(rankingSearch.rows);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao buscar ranking', e);
    }
}