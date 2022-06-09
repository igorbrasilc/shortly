import { Router } from 'express';

import authRouter from './authRouter.js';
import urlRouter from './urlRouter.js';

const router = Router();

router.use(authRouter);
router.use(urlRouter);

export default router;