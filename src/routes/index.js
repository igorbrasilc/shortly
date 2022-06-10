import { Router } from 'express';

import authRouter from './authRouter.js';
import urlRouter from './urlRouter.js';
import usersRouter from './usersRouter.js';
import rankingRouter from './rankingRouter.js';

const router = Router();

router.use(authRouter);
router.use(urlRouter);
router.use(usersRouter);
router.use(rankingRouter);

export default router;