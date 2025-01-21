const fastify = require('fastify')({ logger: true });
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const lessonRoutes = require('./routes/lessonRoutes');


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

fastify.get('/protected', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return { message: "You have access!" };
});

// routes
fastify.register(userRoutes);
fastify.register(authRoutes)
fastify.register(lessonRoutes);

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log('Server running on http://localhost:3000');
});