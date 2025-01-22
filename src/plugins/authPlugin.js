const fp = require('fastify-plugin');


module.exports = fp(async (fastify, opts) => {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.JWT_SECRET || 'supersecretkey'
    });

    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.status(401).send({ error: 'Unauthorized' });
        }
    });
});