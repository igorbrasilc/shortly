import { rankingRepository } from '../repositories/rankingRepository.js';

export async function getRanking(req, res) {

    try {
        const rankingSearch = await rankingRepository.searchRanking();

        res.status(200).send(rankingSearch.rows);
    } catch (e) {
        res.status(500).send(e);
        console.log('Erro ao buscar ranking', e);
    }
}