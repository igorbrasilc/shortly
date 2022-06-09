import db from '../database.js';

import { signUpSchema, signInSchema } from '../schemas/authSchema.js';

export async function signUpValidation(req, res, next) {
    const {body} = req;

    const validation = signUpSchema.validate(body);

    if(validation.error) return res.status(422).send(validation.error);

    try {
        const emailSearch = await db.query('SELECT * FROM users WHERE email = $1', [body.email]);

        if (emailSearch.rowCount > 0) return res.status(409).send('Email já cadastrado!');

        next();
    } catch (e) {
        res.sendStatus(500);
        console.log('Erro ao verificar usuário no banco');
    }
}

export async function signInValidation(req, res, next) {
    const {body} = req;

    const validation = signInSchema.validate(body);

    if (validation.error) return res.status(422).send(validation.error);

    next();
}