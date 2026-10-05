import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getRepositories } from '../repositories';
import { hashPassword } from '../utils/password.js';
import type { CareLogEntity, PlantEntity, UserEntity } from '../types';

interface SeedUser {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserEntity['role'];
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
}

interface SeedPlant {
    id: string;
    ownerId: string;
    name: string;
    species: string;
    location: string;
    health: PlantEntity['health'];
    wateringIntervalDays: number;
    lastWateredAt: string | null;
    notes: string;
}

interface SeedCareLog {
    id: string;
    plantId: string;
    ownerId: string;
    type: CareLogEntity['type'];
    note: string;
    occurredAt: string;
}

const here = dirname(fileURLToPath(import.meta.url));

const loadJson = async <T>(name: string): Promise<T> => {
    const raw = await readFile(join(here, name), 'utf8');
    return JSON.parse(raw) as T;
};

export const seed = async (): Promise<void> => {
    const repos = getRepositories();
    const existing = await repos.users.findOne({ email: 'demo@plantkeeper.dev' });
    if (existing) return;

    const [users, plants, careLogs] = await Promise.all([
        loadJson<SeedUser[]>('users.json'),
        loadJson<SeedPlant[]>('plants.json'),
        loadJson<SeedCareLog[]>('careLogs.json'),
    ]);

    for (const u of users) {
        const user = await repos.users.create({
            id: u.id,
            email: u.email,
            name: u.name,
            passwordHash: await hashPassword(u.password),
            role: u.role,
            twoFactorEnabled: u.twoFactorEnabled,
            twoFactorSecret: u.twoFactorSecret,
        });
        repos.users.store.set(u.id, user);
    }

    const now = new Date().toISOString();

    for (const p of plants) {
        repos.plants.store.set(p.id, {
            ...p,
            createdAt: now,
            updatedAt: now,
        });
    }

    for (const c of careLogs) {
        repos.careLogs.store.set(c.id, {
            ...c,
            createdAt: now,
            updatedAt: now,
        });
    }
};