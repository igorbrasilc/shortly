import { Router } from 'express';

import { urlValidation } from '../middlewares/urlMiddleware.js';
import { generateShortUrl, getUrl, redirectShortUrl } from '../controllers/urlController.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', urlValidation, generateShortUrl);
urlRouter.get('/urls/:id', getUrl);
urlRouter.get('/urls/open/:shortUrl', redirectShortUrl)

export default urlRouter;