import db from '../database.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import 'dotenv/config';

const secretKey = process.env.JWT_SECRET;

export async function generateShortUrl(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    const {url} = req.body;

    if (!token) return res.sendStatus(401);

    
    try {
        const user = jwt.verify(token, secretKey);

        await db.query('INSERT INTO urls ("userId", url) VALUES ($1, $2)', [user.id, url]);

        const urlPosted = await db.query('SELECT * FROM urls WHERE url = $1 AND "userId" = $2', [url, user.id]);

        const shortUrl = nanoid(10);
        
        await db.query('INSERT INTO "shortUrls" ("shortUrl", "urlId") VALUES ($1, $2)', [shortUrl, urlPosted.rows[0].id]);

        res.send({shortUrl});
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao postar a shortUrl', e);
    }
}

export async function getUrl(req, res) {
    const {id} = req.params;

    const query = `
    SELECT u.id, su."shortUrl", u.url
    FROM urls u
    JOIN "shortUrls" su ON su."urlId" = u.id
    WHERE u.id = $1
    `;

    try {
        const urlSearch = await db.query(query, [id]);

        if (urlSearch.rowCount === 0) return res.sendStatus(404);

        res.status(200).send(urlSearch.rows[0]);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao buscar a url', e);
    }
}

export async function redirectShortUrl(req, res) {
    const {shortUrl} = req.params;

    const queryUrlSearch = `
    SELECT u.* 
    FROM urls u
    JOIN "shortUrls" su ON su."urlId" = u.id
    WHERE su."shortUrl" = $1 
    `;

    const queryIncrementView = `
    UPDATE urls
    SET views = $1
    WHERE id = $2
    `;

    try {
        const urlSearch = await db.query(queryUrlSearch, [shortUrl]);

        if (urlSearch.rowCount === 0) return res.sendStatus(404);

        const increment = urlSearch.rows[0].views + 1;

        const viewIncrement = await db.query(queryIncrementView, [increment, urlSearch.rows[0].id]);

        res.redirect(urlSearch.rows[0].url);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao redirecionar para a url', e);
    }
}

export async function deleteUrl(req, res) {
    const {authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();

    const {id} = req.params;

    if (!token) return res.sendStatus(401);

    const querySearch = `
    SELECT urls.*, "shortUrls".id as "shortUrlId"
    FROM urls
    JOIN "shortUrls" ON "shortUrls"."urlId" = urls.id
    WHERE urls.id = $1 AND urls."userId" = $2
    `;

    const queryUrlDelete = `
    DELETE FROM urls
    WHERE urls.id = $1
    `;

    const queryShortUrlDelete = `
    DELETE FROM "shortUrls"
    WHERE "shortUrls".id = $1
    `;

    try {
        const user = jwt.verify(token, secretKey);

        const urlSearch = await db.query(querySearch, [id, user.id]);

        if (urlSearch.rowCount === 0) return res.sendStatus(401);
        
        await db.query(queryShortUrlDelete, [urlSearch.rows[0].shortUrlId]);
        await db.query(queryUrlDelete, [id]);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao deletar a url', e);
    }
}