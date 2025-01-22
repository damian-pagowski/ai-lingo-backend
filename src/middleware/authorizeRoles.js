module.exports = (roles) => {
    return async (request, reply) => {
        try {
            await request.jwtVerify();
            if (!request.user || !roles.includes(request.user.role)) {
                return reply.status(403).send({ error: 'Access denied' });
            }
        } catch (err) {
            reply.status(401).send({ error: 'Unauthorized' });
        }
    };
};