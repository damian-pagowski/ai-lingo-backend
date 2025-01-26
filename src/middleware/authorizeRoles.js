const { UnauthorizedError, ForbiddenError } = require('../errors/customErrors');

module.exports = (roles) => {
    return async (request, reply) => {
        try {
            await request.jwtVerify();
            if (!request.user) {
                throw new UnauthorizedError('User authentication failed');
            }
            if (!roles.includes(request.user.role)) {
                throw new ForbiddenError('Access denied: insufficient permissions');
            }
        } catch (err) {
            if (err.message.includes('No Authorization token')) {
                throw new UnauthorizedError('No authentication token provided');
            }
            if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
                throw err;
            }
            throw new ForbiddenError('Unauthorized access attempt');
        }
    };
};