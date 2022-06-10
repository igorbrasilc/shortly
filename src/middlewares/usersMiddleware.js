import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secretKey = process.env.JWT_SECRET;

export async function tokenValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();

    if (!token) return res.sendStatus(401);

    try {
        const userJwt = jwt.verify(token, secretKey);
        next();
    } catch (e) {
        res.status(401).send('Token inválido!');
    }
}