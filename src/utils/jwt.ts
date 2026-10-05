import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import type { AccessTokenPayload, RefreshTokenPayload } from '../types';

export const signAccess = (payload: AccessTokenPayload): string =>
    jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as SignOptions);

export const signRefresh = (payload: RefreshTokenPayload): string =>
    jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    } as SignOptions);

export const verifyAccess = (token: string): AccessTokenPayload =>
    jwt.verify(token, config.jwt.secret) as AccessTokenPayload;

export const verifyRefresh = (token: string): RefreshTokenPayload =>
    jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;