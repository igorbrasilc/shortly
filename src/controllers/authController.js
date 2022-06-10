import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { authRepository } from '../repositories/authRepository.js';

export async function signUp(req, res) {
    const {name, email, password} = req.body;

    try {
        await authRepository.signUp(name, email, await bcrypt.hash(password, 10));

        res.sendStatus(201);
    } catch (e) {
        res.sendStatus(500);
        console.log('Erro ao postar usuário no banco');
    }
}

export async function signIn(req, res) {
    const {email, password} = req.body;

    try {
        const user = await authRepository.searchEmail(email);
        const secretKey = process.env.JWT_SECRET;
        if (user.rowCount > 0 && bcrypt.compareSync(password, user.rows[0].password)) {
            const token = jwt.sign(user.rows[0], secretKey, { expiresIn: 60*60*24*30});

            res.status(200).send({token});
        } else {
            res.status(401).send('Senha incompatível ou usuário não existe');
        }
    } catch (e) {
        res.sendStatus(500);
        console.log('Erro ao buscar usuário no banco', e);
    }
}