import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import 'dotenv/config';

import { urlRepository } from '../repositories/urlRepository.js';

const secretKey = process.env.JWT_SECRET;

export async function generateShortUrl(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    const {url} = req.body;

    if (!token) return res.sendStatus(401);

    
    try {
        const user = jwt.verify(token, secretKey);

        await urlRepository.insertUrl(user.id, url);

        const urlPosted = await urlRepository.searchUrl(url, user.id);

        const shortUrl = nanoid(10);
        
        await urlRepository.insertShortUrl(shortUrl, urlPosted.rows[0].id);

        res.send({shortUrl});
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao postar a shortUrl', e);
    }
}

export async function getUrl(req, res) {
    const {id} = req.params;

    try {
        const urlSearch = await urlRepository.getUrlAndShortById(id);

        if (urlSearch.rowCount === 0) return res.sendStatus(404);

        res.status(200).send(urlSearch.rows[0]);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao buscar a url', e);
    }
}

export async function redirectShortUrl(req, res) {
    const {shortUrl} = req.params;

    try {
        const urlSearch = await urlRepository.getUrlAndShortByShort(shortUrl);

        if (urlSearch.rowCount === 0) return res.sendStatus(404);

        const increment = urlSearch.rows[0].views + 1;

        const viewIncrement = await urlRepository.incrementViews(increment, urlSearch.rows[0].id);

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

    try {
        const user = jwt.verify(token, secretKey);

        const urlSearch = await urlRepository.searchByUrlAndUser(id, user.id);

        if (urlSearch.rowCount === 0) return res.sendStatus(401);
        
        await urlRepository.deleteShortUrl(urlSearch.rows[0].shortUrlId);
        await urlRepository.deleteUrl(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao deletar a url', e);
    }
}