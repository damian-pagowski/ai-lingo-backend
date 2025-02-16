const fastify = require('fastify')({ logger: true });
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); 
const lessonRoutes = require('./routes/lessonRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');

const progressRoutes = require('./routes/progressRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const authPlugin = require('./plugins/authPlugin');
const corsPlugin =  require('./plugins/cors');
const errorHandler = require('./middleware/errorHandler');
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

require('dotenv').config();
// plugins
fastify.register(authPlugin);
fastify.register(corsPlugin);

// routes
fastify.register(userRoutes);
fastify.register(authRoutes)
fastify.register(lessonRoutes);
fastify.register(progressRoutes);
fastify.register(userProfileRoutes);
fastify.register(userPreferencesRoutes);
fastify.register(dashboardRoutes);
fastify.register(exerciseRoutes);

// middlewares
fastify.setErrorHandler(errorHandler);


// start server
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info('Server running on http://localhost:3000');

});