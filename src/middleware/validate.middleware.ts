import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult, type ValidationChain } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validate =
    (chains: ValidationChain[]): RequestHandler =>
        async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
            await Promise.all(chains.map((chain) => chain.run(req)));
            const result = validationResult(req);
            if (!result.isEmpty()) {
                next(ApiError.badRequest('Validation failed', result.array()));
                return;
            }
            next();
        };