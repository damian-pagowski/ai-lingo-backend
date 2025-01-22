const fastify = require('fastify')({ logger: true });
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const authPlugin = require('./plugins/authPlugin');

// plugins
fastify.register(authPlugin);

// routes
fastify.register(userRoutes);
fastify.register(authRoutes)
fastify.register(lessonRoutes);
fastify.register(progressRoutes);

// start server
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log('Server running on http://localhost:3000');
});