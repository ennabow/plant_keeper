import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { loginValidator, registerValidator, refreshValidator } from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerValidator), authController.register);
authRouter.post('/login', validate(loginValidator), authController.login);
authRouter.post('/refresh', validate(refreshValidator), authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.get('/me', authenticate, authController.me);