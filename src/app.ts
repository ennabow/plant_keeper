import express, { type Express } from 'express';
import cors from 'cors';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

export const createApp = (): Express => {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
    app.use('/api/v1', apiRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
};