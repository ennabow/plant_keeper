export class ApiError extends Error {
    public readonly status: number;
    public readonly details?: unknown;
    public readonly isOperational = true;

    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }

    static badRequest(msg: string, details?: unknown): ApiError {
        return new ApiError(400, msg, details);
    }
    static unauthorized(msg = 'Unauthorized'): ApiError {
        return new ApiError(401, msg);
    }
    static forbidden(msg = 'Forbidden'): ApiError {
        return new ApiError(403, msg);
    }
    static notFound(msg = 'Not found'): ApiError {
        return new ApiError(404, msg);
    }
    static conflict(msg: string, details?: unknown): ApiError {
        return new ApiError(409, msg, details);
    }
}