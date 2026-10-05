import type { Request, Response } from 'express';
import { careLogsService } from '../services/careLogs.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import type { CareLogEntity, PaginatedResult } from '../types';

export const careLogsController = {
    list: asyncHandler(
        async (req: Request, res: Response<PaginatedResult<CareLogEntity>>) => {
            if (!req.user) throw ApiError.unauthorized();
            const result = await careLogsService.list(req.user.sub, req.params.plantId!, {
                type: req.query.type as CareLogEntity['type'] | undefined,
                page: req.query.page as number | undefined,
                limit: req.query.limit as number | undefined,
            });
            res.json(result);
        },
    ),

    create: asyncHandler(async (req: Request, res: Response<{ data: CareLogEntity }>) => {
        if (!req.user) throw ApiError.unauthorized();
        const log = await careLogsService.create(req.user.sub, req.params.plantId!, req.body);
        res.status(201).json({ data: log });
    }),
};