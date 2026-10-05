import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { plantsRouter } from './plants.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/plants', plantsRouter)