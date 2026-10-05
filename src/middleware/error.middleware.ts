import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config';

interface ErrorResponse {
    error: {
        message: string;
        details?: unknown;
        stack?: string;
    };
}

export const notFoundHandler = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
): void => {
    const status = err instanceof ApiError ? err.status : 500;
    const message =
        err instanceof Error ? err.message : 'Internal Server Error';
    const details = err instanceof ApiError ? err.details : undefined;

    const payload: ErrorResponse = {
        error: { message, ...(details !== undefined ? { details } : {}) },
    };

    if (config.env !== 'production' && status >= 500 && err instanceof Error) {
        payload.error.stack = err.stack;
    }

    res.status(status).json(payload);
};