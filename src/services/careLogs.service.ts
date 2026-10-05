import { getRepositories } from '../repositories/index.js';
import { ApiError } from '../utils/ApiError.js';
import type {
    CareLogEntity,
    CareLogType,
    CreateCareLogInput,
    PaginatedResult,
} from '../types';

interface ListCareLogsParams {
    type?: CareLogType;
    page?: number;
    limit?: number;
}

export const careLogsService = {
    async list(
        ownerId: string,
        plantId: string,
        params: ListCareLogsParams,
    ): Promise<PaginatedResult<CareLogEntity>> {
        const repos = getRepositories();
        const plant = await repos.plants.findById(plantId);
        if (!plant || plant.ownerId !== ownerId) throw ApiError.notFound('Plant not found');

        const filter: Partial<CareLogEntity> = { plantId };
        if (params.type) filter.type = params.type;

        return repos.careLogs.findAll({
            filter,
            page: params.page ?? 1,
            limit: params.limit ?? 20,
            sort: '-occurredAt',
        });
    },

    async create(
        ownerId: string,
        plantId: string,
        input: CreateCareLogInput,
    ): Promise<CareLogEntity> {
        const repos = getRepositories();
        const plant = await repos.plants.findById(plantId);
        if (!plant || plant.ownerId !== ownerId) throw ApiError.notFound('Plant not found');

        const occurredAt = input.occurredAt ?? new Date().toISOString();
        const log = await repos.careLogs.create({
            plantId,
            ownerId,
            type: input.type,
            note: input.note ?? '',
            occurredAt,
        });

        if (input.type === 'watering') {
            await repos.plants.update(plantId, { lastWateredAt: occurredAt });
        }
        return log;
    },
};