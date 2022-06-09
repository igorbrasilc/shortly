import db from '../database.js';
import bcrypt from 'bcrypt';

export async function signUp(req, res) {
    const {name, email, password} = req.body;

    const query = `
    INSERT INTO users
    (name, email, password) VALUES
    ($1, $2, $3)
    `;

    try {
        await db.query(query, [name, email, await bcrypt.hash(password, 10)]);

        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
        console.log('Erro ao verificar usuário no banco');
    }
}