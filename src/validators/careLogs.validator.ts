import { body, param, query } from 'express-validator';
import type { CareLogType } from '../types';

const types: CareLogType[] = ['watering', 'fertilizing', 'repotting', 'pruning', 'note'];

export const createCareLogValidator = [
    param('plantId').isUUID(),
    body('type').isIn(types),
    body('note').optional().isString().isLength({ max: 1000 }),
    body('occurredAt').optional().isISO8601().toDate(),
];

export const listCareLogsValidator = [
    param('plantId').isUUID(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('type').optional().isIn(types),
];