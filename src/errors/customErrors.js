class AppError extends Error {
    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found', details = null) {
        super(message, 404, details);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Invalid input data', details = null) {
        super(message, 400, details);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access', details = null) {
        super(message, 401, details);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden', details = null) {
        super(message, 403, details);
    }
}

class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', details = null) {
        super(message, 500, details);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    DatabaseError,
};