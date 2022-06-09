import db from '../database.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import 'dotenv/config';

export async function generateShortUrl(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();

    const secretKey = process.env.JWT_SECRET;
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