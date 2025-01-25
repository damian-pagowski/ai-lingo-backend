const fp = require('fastify-plugin');


module.exports = fp(async (fastify, opts) => {
    fastify.register(require('fastify-jwt'), {
        secret: process.env.JWT_SECRET || 'supersecretkey'
    });

    fastify.decorate("authenticate", async (req, reply) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
              reply.status(401).send({ message: 'Invalid token' });
            }
            const token = authHeader.split(' ')[1];
            const decoded = fastify.jwt.verify(token);
            req.user = decoded;
          } catch (err) {
            reply.status(401).send({ message: 'Invalid or expired token' });
          }
    });
});