import { MemoryRepository } from './memory.repository.js';
import { config } from '../config';
import type { UserEntity, PlantEntity, CareLogEntity } from '../types';

export interface Repositories {
    users: MemoryRepository<UserEntity>;
    plants: MemoryRepository<PlantEntity>;
    careLogs: MemoryRepository<CareLogEntity>;
}

const buildRepositories = (): Repositories => ({
    users: new MemoryRepository<UserEntity>({ searchableFields: ['email', 'name'] }),
    plants: new MemoryRepository<PlantEntity>({
        searchableFields: ['name', 'species', 'location', 'notes'],
    }),
    careLogs: new MemoryRepository<CareLogEntity>({ searchableFields: ['type', 'note'] }),
});

let repos: Repositories | undefined;

export const getRepositories = (): Repositories => {
    if (!repos) {
        if (config.db.driver !== 'memory') {
            throw new Error(`Unsupported DB driver: ${config.db.driver}`);
        }
        repos = buildRepositories();
    }
    return repos;
};