module.exports = (roles) => {
    return async (request, reply) => {
        if (!request.user || !roles.includes(request.user.role)) {
            return reply.status(403).send({ error: 'Access denied' });
        }
    };
};