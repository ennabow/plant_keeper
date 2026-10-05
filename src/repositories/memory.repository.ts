import { randomUUID } from 'node:crypto';
import { BaseRepository } from './base.repository.js';
import type { BaseEntity, FindAllOptions, PaginatedResult } from '../types';

type Filter = Record<string, unknown>;

interface MemoryRepositoryOptions<TEntity extends BaseEntity> {
    searchableFields?: (keyof TEntity)[];
    idPrefix?: string;
}

const matchesFilter = <TEntity extends BaseEntity>(
    entity: TEntity,
    filter: Filter,
): boolean =>
    Object.entries(filter).every(([key, value]) => {
        if (value === undefined) return true;
        return (entity as Record<string, unknown>)[key] === value;
    });

const matchesSearch = <TEntity extends BaseEntity>(
    entity: TEntity,
    search: string | undefined,
    fields: (keyof TEntity)[],
): boolean => {
    if (!search) return true;
    const q = search.toLowerCase();
    return fields.some((field) => {
        const value = entity[field];
        return String(value ?? '').toLowerCase().includes(q);
    });
};

export class MemoryRepository<
    TEntity extends BaseEntity,
    TFilter extends Filter = Filter,
> extends BaseRepository<TEntity, TFilter> {
    public readonly store = new Map<string, TEntity>();
    private readonly searchableFields: (keyof TEntity)[];

    constructor(options: MemoryRepositoryOptions<TEntity> = {}) {
        super();
        this.searchableFields = options.searchableFields ?? [];
    }

    override async findById(id: string): Promise<TEntity | null> {
        return this.store.get(id) ?? null;
    }

    override async findOne(filter: TFilter): Promise<TEntity | null> {
        for (const entity of this.store.values()) {
            if (matchesFilter(entity, filter as Filter)) return entity;
        }
        return null;
    }

    override async findAll(
        options: FindAllOptions<TFilter> = {},
    ): Promise<PaginatedResult<TEntity>> {
        const { filter = {} as TFilter, search, page = 1, limit = 20, sort = '-createdAt' } = options;

        let items = [...this.store.values()].filter((e) =>
            matchesFilter(e, filter as Filter),
        );

        if (search) {
            items = items.filter((e) => matchesSearch(e, search, this.searchableFields));
        }

        const desc = sort.startsWith('-');
        const field = (desc ? sort.slice(1) : sort) as keyof TEntity;
        items.sort((a, b) => {
            const av = a[field];
            const bv = b[field];
            if (av === bv) return 0;
            return (av! > bv! ? 1 : -1) * (desc ? -1 : 1);
        });

        const total = items.length;
        const start = (page - 1) * limit;
        const data = items.slice(start, start + limit);
        return { data, total, page, limit, pages: Math.ceil(total / limit) || 1 };
    }

    override async create(
        entity: Omit<TEntity, keyof BaseEntity> & Partial<BaseEntity>,
    ): Promise<TEntity> {
        const now = new Date().toISOString();
        const id = (entity.id as string | undefined) ?? randomUUID();
        const record = {
            ...entity,
            id,
            createdAt: (entity.createdAt as string | undefined) ?? now,
            updatedAt: now,
        } as TEntity;
        this.store.set(id, record);
        return record;
    }

    override async update(id: string, patch: Partial<TEntity>): Promise<TEntity | null> {
        const current = this.store.get(id);
        if (!current) return null;
        const next: TEntity = {
            ...current,
            ...patch,
            id: current.id,
            updatedAt: new Date().toISOString(),
        };
        this.store.set(id, next);
        return next;
    }

    override async delete(id: string): Promise<boolean> {
        return this.store.delete(id);
    }

    override async count(filter: TFilter = {} as TFilter): Promise<number> {
        return [...this.store.values()].filter((e) => matchesFilter(e, filter as Filter)).length;
    }
}