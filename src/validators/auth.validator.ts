import { body } from 'express-validator';

export const registerValidator = [
    body('email').isEmail().normalizeEmail(),
    body('name').isString().trim().isLength({ min: 2, max: 64 }),
    body('password').isString().isLength({ min: 8, max: 128 }),
];

export const loginValidator = [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1 }),
];

export const refreshValidator = [
    body('refreshToken').isString().isLength({ min: 10 }),
];