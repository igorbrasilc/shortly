import { Router } from 'express';

import { signUpValidation } from '../middlewares/authMiddleware.js';
import { signUp } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signup', signUpValidation, signUp);

export default authRouter;