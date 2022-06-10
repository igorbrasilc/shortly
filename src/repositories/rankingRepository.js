import db from '../database.js';

async function searchRanking() {
    const query = `
    SELECT us.id, us.name, COUNT(ur.*) as "linksCount", COALESCE(SUM(ur.views), 0) as "visitCount"
    FROM users us
    LEFT JOIN urls ur ON ur."userId" = us.id
    GROUP BY us.id
    ORDER BY "visitCount" DESC
    LIMIT 10
    `;

    return db.query(query, []);
}

export const rankingRepository = {
    searchRanking
}