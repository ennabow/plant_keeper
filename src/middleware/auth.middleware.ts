import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyAccess } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import type { Role } from '../types';

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
        next(ApiError.unauthorized('Missing bearer token'));
        return;
    }
    try {
        req.user = verifyAccess(token);
        next();
    } catch {
        next(ApiError.unauthorized('Invalid or expired token'));
    }
};

export const requireRole =
    (...roles: Role[]): RequestHandler =>
        (req, _res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                next(ApiError.forbidden());
                return;
            }
            next();
        };