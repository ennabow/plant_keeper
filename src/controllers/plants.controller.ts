import type { Request, Response } from 'express';
import { plantsService } from '../services/plants.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import type { PaginatedResult, PlantEntity } from '../types';

export const plantsController = {
    list: asyncHandler(async (req: Request, res: Response<PaginatedResult<PlantEntity>>) => {
        if (!req.user) throw ApiError.unauthorized();
        const result = await plantsService.list(req.user.sub, {
            search: req.query.search as string | undefined,
            health: req.query.health as PlantEntity['health'] | undefined,
            location: req.query.location as string | undefined,
            page: req.query.page as number | undefined,
            limit: req.query.limit as number | undefined,
            sort: req.query.sort as string | undefined,
        });
        res.json(result);
    }),

    get: asyncHandler(async (req: Request, res: Response<{ data: PlantEntity }>) => {
        if (!req.user) throw ApiError.unauthorized();
        const plant = await plantsService.get(req.user.sub, req.params.id!);
        res.json({ data: plant });
    }),

    create: asyncHandler(async (req: Request, res: Response<{ data: PlantEntity }>) => {
        if (!req.user) throw ApiError.unauthorized();
        const plant = await plantsService.create(req.user.sub, req.body);
        res.status(201).json({ data: plant });
    }),

    update: asyncHandler(async (req: Request, res: Response<{ data: PlantEntity }>) => {
        if (!req.user) throw ApiError.unauthorized();
        const plant = await plantsService.update(req.user.sub, req.params.id!, req.body);
        res.json({ data: plant });
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) throw ApiError.unauthorized();
        await plantsService.remove(req.user.sub, req.params.id!);
        res.status(204).send();
    }),
};