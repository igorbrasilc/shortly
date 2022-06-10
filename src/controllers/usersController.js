import { usersRepository } from '../repositories/usersRepository.js';

export async function getUserInfos(req, res) {
    const {id} = req.params;

    try {
        const userSearch = await usersRepository.searchUser(id);

        if (userSearch.rowCount === 0) return res.sendStatus(404);

        const shortUrlsSearch = await usersRepository.searchShortenedUrls(id);

        res.status(200).send({...userSearch.rows[0], shortenedUrls: shortUrlsSearch.rows});
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao buscar informações do usuário no banco', e);
    }
}