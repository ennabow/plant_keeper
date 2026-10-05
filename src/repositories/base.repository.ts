import type { BaseEntity, FindAllOptions, PaginatedResult } from '../types';

export interface Repository<TEntity extends BaseEntity, TFilter = Partial<TEntity>> {
    findById(id: string): Promise<TEntity | null>;
    findOne(filter: TFilter): Promise<TEntity | null>;
    findAll(options?: FindAllOptions<TFilter>): Promise<PaginatedResult<TEntity>>;
    create(entity: Omit<TEntity, keyof BaseEntity> & Partial<BaseEntity>): Promise<TEntity>;
    update(id: string, patch: Partial<TEntity>): Promise<TEntity | null>;
    delete(id: string): Promise<boolean>;
    count(filter?: TFilter): Promise<number>;
}

export abstract class BaseRepository<
    TEntity extends BaseEntity,
    TFilter = Partial<TEntity>,
> implements Repository<TEntity, TFilter>
{
    abstract findById(id: string): Promise<TEntity | null>;
    abstract findOne(filter: TFilter): Promise<TEntity | null>;
    abstract findAll(options?: FindAllOptions<TFilter>): Promise<PaginatedResult<TEntity>>;
    abstract create(
        entity: Omit<TEntity, keyof BaseEntity> & Partial<BaseEntity>,
    ): Promise<TEntity>;
    abstract update(id: string, patch: Partial<TEntity>): Promise<TEntity | null>;
    abstract delete(id: string): Promise<boolean>;
    abstract count(filter?: TFilter): Promise<number>;
}