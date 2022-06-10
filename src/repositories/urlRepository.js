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

export const urlRepository = {
    insertUrl,
    searchUrl,
    insertShortUrl
}