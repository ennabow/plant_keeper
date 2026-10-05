import { getRepositories } from '../repositories';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';
import type {
    AuthResult,
    LoginInput,
    PublicUser,
    RefreshInput,
    RegisterInput,
    UserEntity,
} from '../types';

const toPublic = (user: UserEntity): PublicUser => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    twoFactorEnabled: user.twoFactorEnabled,
});

const issueTokens = (user: UserEntity): AuthResult => ({
    user: toPublic(user),
    accessToken: signAccess({ sub: user.id, role: user.role, email: user.email }),
    refreshToken: signRefresh({ sub: user.id, type: 'refresh' }),
});

export const authService = {
    async register(input: RegisterInput): Promise<AuthResult> {
        const repos = getRepositories();
        const existing = await repos.users.findOne({ email: input.email });
        if (existing) throw ApiError.conflict('Email already registered');

        const user = await repos.users.create({
            email: input.email,
            name: input.name,
            passwordHash: await hashPassword(input.password),
            role: 'user',
            twoFactorEnabled: false,
            twoFactorSecret: null,
        });

        return issueTokens(user);
    },

    async login(input: LoginInput): Promise<AuthResult> {
        const repos = getRepositories();
        const user = await repos.users.findOne({ email: input.email });
        if (!user) throw ApiError.unauthorized('Invalid credentials');

        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok) throw ApiError.unauthorized('Invalid credentials');

        if (user.twoFactorEnabled) {
            throw ApiError.unauthorized('2FA required');
        }

        return issueTokens(user);
    },

    async refresh(input: RefreshInput): Promise<AuthResult> {
        let payload;
        try {
            payload = verifyRefresh(input.refreshToken);
        } catch {
            throw ApiError.unauthorized('Invalid refresh token');
        }

        const repos = getRepositories();
        const user = await repos.users.findById(payload.sub);
        if (!user) throw ApiError.unauthorized('User not found');

        return issueTokens(user);
    },

    async me(userId: string): Promise<PublicUser> {
        const repos = getRepositories();
        const user = await repos.users.findById(userId);
        if (!user) throw ApiError.notFound('User not found');
        return toPublic(user);
    },
};