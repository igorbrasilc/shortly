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