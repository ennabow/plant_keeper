import { getRepositories } from '../repositories';
import { ApiError } from '../utils/ApiError.js';
import type {
    CreatePlantInput,
    PaginatedResult,
    PlantEntity,
    UpdatePlantInput,
} from '../types';

interface ListPlantsParams {
    search?: string;
    health?: PlantEntity['health'];
    location?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export const plantsService = {
    async list(ownerId: string, params: ListPlantsParams): Promise<PaginatedResult<PlantEntity>> {
        const repos = getRepositories();
        const filter: Partial<PlantEntity> = { ownerId };
        if (params.health) filter.health = params.health;
        if (params.location) filter.location = params.location;

        return repos.plants.findAll({
            filter,
            search: params.search,
            page: params.page ?? 1,
            limit: params.limit ?? 20,
            sort: params.sort ?? '-createdAt',
        });
    },

    async get(ownerId: string, id: string): Promise<PlantEntity> {
        const repos = getRepositories();
        const plant = await repos.plants.findById(id);
        if (!plant || plant.ownerId !== ownerId) throw ApiError.notFound('Plant not found');
        return plant;
    },

    async create(ownerId: string, input: CreatePlantInput): Promise<PlantEntity> {
        const repos = getRepositories();
        return repos.plants.create({
            ownerId,
            name: input.name,
            species: input.species ?? '',
            location: input.location ?? '',
            health: input.health ?? 'unknown',
            wateringIntervalDays: input.wateringIntervalDays ?? 7,
            lastWateredAt: null,
            notes: input.notes ?? '',
        });
    },

    async update(ownerId: string, id: string, patch: UpdatePlantInput): Promise<PlantEntity> {
        const repos = getRepositories();
        const plant = await repos.plants.findById(id);
        if (!plant || plant.ownerId !== ownerId) throw ApiError.notFound('Plant not found');

        const updated = await repos.plants.update(id, patch as Partial<PlantEntity>);
        if (!updated) throw ApiError.notFound('Plant not found');
        return updated;
    },

    async remove(ownerId: string, id: string): Promise<void> {
        const repos = getRepositories();
        const plant = await repos.plants.findById(id);
        if (!plant || plant.ownerId !== ownerId) throw ApiError.notFound('Plant not found');
        await repos.plants.delete(id);
    },
};