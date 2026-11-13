import type { AccessTokenPayload } from './domain.js';

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}

export {};