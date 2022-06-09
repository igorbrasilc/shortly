import { Router } from 'express';

import { urlValidation } from '../middlewares/urlMiddleware.js';
import { generateShortUrl, getUrl, redirectShortUrl, deleteUrl } from '../controllers/urlController.js';

const urlRouter = Router();

urlRouter.post('/urls/shorten', urlValidation, generateShortUrl);
urlRouter.get('/urls/:id', getUrl);
urlRouter.get('/urls/open/:shortUrl', redirectShortUrl);
urlRouter.delete('/urls/:id', deleteUrl)

export default urlRouter;