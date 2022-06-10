import db from '../database.js';

async function insertUrl(id, url) {
    return db.query('INSERT INTO urls ("userId", url) VALUES ($1, $2)', [id, url])
}

async function searchUrl(url, id) {
    return db.query('SELECT * FROM urls WHERE url = $1 AND "userId" = $2', [url, id]);
}

async function insertShortUrl(shortUrl, id) {
    return db.query('INSERT INTO "shortUrls" ("shortUrl", "urlId") VALUES ($1, $2)', [shortUrl, id]);
}

async function getUrlAndShortById(id) {
    const query = `
    SELECT u.id, su."shortUrl", u.url
    FROM urls u
    JOIN "shortUrls" su ON su."urlId" = u.id
    WHERE u.id = $1
    `;

    return db.query(query, [id]);
}

async function getUrlAndShortByShort(shortUrl) {
    const queryUrlSearch = `
    SELECT u.* 
    FROM urls u
    JOIN "shortUrls" su ON su."urlId" = u.id
    WHERE su."shortUrl" = $1 
    `;

    return db.query(queryUrlSearch, [shortUrl]);
}

async function incrementViews(increment, id) {
    const queryIncrementView = `
    UPDATE urls
    SET views = $1
    WHERE id = $2
    `;

    return db.query(queryIncrementView, [increment, id]);
}

async function searchByUrlAndUser(urlId, userId) {
    const querySearch = `
    SELECT urls.*, "shortUrls".id as "shortUrlId"
    FROM urls
    JOIN "shortUrls" ON "shortUrls"."urlId" = urls.id
    WHERE urls.id = $1 AND urls."userId" = $2
    `;

    return db.query(querySearch, [urlId, userId]);
}

async function deleteUrl(urlId) {
    const queryUrlDelete = `
    DELETE FROM urls
    WHERE urls.id = $1
    `;

    return db.query(queryUrlDelete, [urlId]);
}

async function deleteShortUrl(shortUrlId) {
    const queryShortUrlDelete = `
    DELETE FROM "shortUrls"
    WHERE "shortUrls".id = $1
    `;

    return db.query(queryShortUrlDelete, [shortUrlId]);
}

export const urlRepository = {
    insertUrl,
    searchUrl,
    insertShortUrl,
    getUrlAndShortById,
    getUrlAndShortByShort,
    incrementViews,
    searchByUrlAndUser,
    deleteUrl,
    deleteShortUrl
}