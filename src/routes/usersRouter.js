import { Router } from 'express';

import { getUserInfos } from '../controllers/usersController.js';
import { tokenValidation } from '../middlewares/usersMiddleware.js';

const usersRouter = Router();

usersRouter.get('/users/:id', tokenValidation, getUserInfos);

export default usersRouter;