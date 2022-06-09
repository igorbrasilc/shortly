import { Router } from 'express';

import { urlValidation } from '../middlewares/urlMiddleware.js';
import { generateShortUrl } from '../controllers/urlController.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', urlValidation, generateShortUrl);

export default urlRouter;