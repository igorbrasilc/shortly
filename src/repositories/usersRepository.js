import db from '../database.js';

async function searchUser(userId) {
    const queryUser = `
    SELECT us.id, us.name, SUM(ur.views) as "visitCount"
    FROM users us
    JOIN urls ur ON us.id = ur."userId"
    WHERE us.id = $1
    GROUP BY us.id;
    `;

    return db.query(queryUser, [userId]);
}

async function searchShortenedUrls(userId) {
    const queryShortUrl = `
    SELECT ur.id, s."shortUrl", ur.url, ur.views as "visitCount"
    FROM urls ur
    JOIN "shortUrls" s ON s."urlId" = ur.id
    WHERE ur."userId" = $1
    GROUP BY s."shortUrl", ur.id
    `;

    return db.query(queryShortUrl, [userId]);
}

export const usersRepository = {
    searchUser,
    searchShortenedUrls
}