export type Role = 'user' | 'admin';

export type HealthStatus = 'healthy' | 'needs_attention' | 'critical' | 'unknown';

export type CareLogType = 'watering' | 'fertilizing' | 'repotting' | 'pruning' | 'note';

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserEntity extends BaseEntity {
    email: string;
    name: string;
    passwordHash: string;
    role: Role;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
}

export interface PublicUser {
    id: string;
    email: string;
    name: string;
    role: Role;
    twoFactorEnabled: boolean;
}

export interface PlantEntity extends BaseEntity {
    ownerId: string;
    name: string;
    species: string;
    location: string;
    health: HealthStatus;
    wateringIntervalDays: number;
    lastWateredAt: string | null;
    notes: string;
}

export interface CareLogEntity extends BaseEntity {
    plantId: string;
    ownerId: string;
    type: CareLogType;
    note: string;
    occurredAt: string;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface ListQuery {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
}

export interface FindAllOptions<TFilter> {
    filter?: TFilter;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResult extends AuthTokens {
    user: PublicUser;
}

export interface AccessTokenPayload {
    sub: string;
    role: Role;
    email: string;
}

export interface RefreshTokenPayload {
    sub: string;
    type: 'refresh';
}

export interface RegisterInput {
    email: string;
    name: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RefreshInput {
    refreshToken: string;
}

export interface CreatePlantInput {
    name: string;
    species?: string;
    location?: string;
    health?: HealthStatus;
    wateringIntervalDays?: number;
    notes?: string;
}

export interface UpdatePlantInput {
    name?: string;
    species?: string;
    location?: string;
    health?: HealthStatus;
    wateringIntervalDays?: number;
    notes?: string;
}

export interface CreateCareLogInput {
    type: CareLogType;
    note?: string;
    occurredAt?: string;
}