const fp = require('fastify-plugin');
const cors =require('@fastify/cors');

module.exports = fp(async (fastify, opts) => {
  fastify.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = ['http://localhost:5173']; //TODO use variable maybe
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
});