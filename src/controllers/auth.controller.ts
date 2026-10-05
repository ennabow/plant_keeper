import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import type { AuthResult, PublicUser } from '../types';

export const authController = {
    register: asyncHandler(async (req: Request, res: Response<AuthResult>) => {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    }),

    login: asyncHandler(async (req: Request, res: Response<AuthResult>) => {
        const result = await authService.login(req.body);
        res.json(result);
    }),

    refresh: asyncHandler(async (req: Request, res: Response<AuthResult>) => {
        const result = await authService.refresh(req.body);
        res.json(result);
    }),

    me: asyncHandler(async (req: Request, res: Response<{ user: PublicUser }>) => {
        if (!req.user) throw ApiError.unauthorized();
        const user = await authService.me(req.user.sub);
        res.json({ user });
    }),

    logout: asyncHandler(async (_req: Request, res: Response) => {
        res.status(204).send();
    }),
};