import { body, param, query } from 'express-validator';
import type { HealthStatus } from '../types';

const healthValues: HealthStatus[] = ['healthy', 'needs_attention', 'critical', 'unknown'];

export const createPlantValidator = [
    body('name').isString().trim().isLength({ min: 1, max: 80 }),
    body('species').optional().isString().trim().isLength({ max: 120 }),
    body('location').optional().isString().trim().isLength({ max: 80 }),
    body('health').optional().isIn(healthValues),
    body('wateringIntervalDays').optional().isInt({ min: 1, max: 365 }),
    body('notes').optional().isString().isLength({ max: 2000 }),
];

export const updatePlantValidator = [
    param('id').isUUID(),
    body('name').optional().isString().trim().isLength({ min: 1, max: 80 }),
    body('species').optional().isString().trim().isLength({ max: 120 }),
    body('location').optional().isString().trim().isLength({ max: 80 }),
    body('health').optional().isIn(healthValues),
    body('wateringIntervalDays').optional().isInt({ min: 1, max: 365 }),
    body('notes').optional().isString().isLength({ max: 2000 }),
];

export const idValidator = [param('id').isUUID()];

export const listPlantsValidator = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString().trim().isLength({ max: 120 }),
    query('health').optional().isIn(healthValues),
    query('location').optional().isString().trim().isLength({ max: 80 }),
    query('sort').optional().isString().matches(/^-?[a-zA-Z]+$/),
];