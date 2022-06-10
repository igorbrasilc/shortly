import db from '../database.js';

export async function getUserInfos(req, res) {
    const {id} = req.params;

    const queryUser = `
    SELECT us.id, us.name, SUM(ur.views) as "visitCount"
    FROM users us
    JOIN urls ur ON us.id = ur."userId"
    WHERE us.id = $1
    GROUP BY us.id;
    `;

    const queryShortUrl = `
    SELECT ur.id, s."shortUrl", ur.url, ur.views as "visitCount"
    FROM urls ur
    JOIN "shortUrls" s ON s."urlId" = ur.id
    WHERE ur."userId" = $1
    GROUP BY s."shortUrl", ur.id
    `;

    try {
        const userSearch = await db.query(queryUser, [id]);

        if (userSearch.rowCount === 0) return res.sendStatus(404);

        const shortUrlsSearch = await db.query(queryShortUrl, [id]);

        res.status(200).send({...userSearch.rows[0], shortenedUrls: shortUrlsSearch.rows});
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao buscar informações do usuário no banco', e);
    }
}