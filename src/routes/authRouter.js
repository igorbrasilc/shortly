import { Router } from 'express';

import { signUpValidation, signInValidation } from '../middlewares/authMiddleware.js';
import { signUp, signIn } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signup', signUpValidation, signUp);
authRouter.post('/signin', signInValidation, signIn);

export default authRouter;