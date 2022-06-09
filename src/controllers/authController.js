import db from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

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
        console.log('Erro ao postar usuário no banco');
    }
}

export async function signIn(req, res) {
    const {email, password} = req.body;

    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const secretKey = process.env.JWT_SECRET;
        if (user && bcrypt.compareSync(password, user.rows[0].password)) {
            const token = jwt.sign(user.rows[0], secretKey, { expiresIn: 60*60*24*30});

            res.status(200).send({token});
        } else {
            res.status(401).send('Senha incompatível ou usuário não existe');
        }
    } catch (e) {
        res.sendStatus(500);
        console.log('Erro ao buscar usuário no banco');
    }
}