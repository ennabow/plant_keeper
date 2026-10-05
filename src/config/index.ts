import dotenv from 'dotenv';
dotenv.config();

const required = (key: string, fallback?: string): string => {
    const value = process.env[key] ?? fallback;
    if (value === undefined) throw new Error(`Missing env: ${key}`);
    return value;
};

const num = (key: string, fallback?: number): number => {
    const raw = process.env[key];
    if (raw === undefined) {
        if (fallback === undefined) throw new Error(`Missing env: ${key}`);
        return fallback;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) throw new Error(`Env ${key} must be a number`);
    return parsed;
};

export interface AppConfig {
    env: string;
    port: number;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    bcryptRounds: number;
    db: {
        driver: 'memory' | 'postgres' | 'mysql';
    };
}

export const config: AppConfig = {
    env: required('NODE_ENV', 'development'),
    port: num('PORT', 3000),
    jwt: {
        secret: required('JWT_SECRET'),
        expiresIn: required('JWT_EXPIRES_IN', '1h'),
        refreshSecret: required('JWT_REFRESH_SECRET'),
        refreshExpiresIn: required('JWT_REFRESH_EXPIRES_IN', '30d'),
    },
    bcryptRounds: num('BCRYPT_ROUNDS', 10),
    db: {
        driver: (required('DB_DRIVER', 'memory') as AppConfig['db']['driver']),
    },
};