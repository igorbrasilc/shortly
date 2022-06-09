import db from '../database.js';

import { urlSchema } from '../schemas/urlSchema.js';

export async function urlValidation(req, res, next) {
    const {body} = req;

    const validation = urlSchema.validate(body);

    if (validation.error) return res.status(422).send(validation.error);

    next();
}