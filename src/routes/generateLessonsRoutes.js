const { generateLessons } = require('../controllers/generateLessonsController');

module.exports = async function (fastify, _opts) {
  fastify.post('/generate-lessons', { preHandler: fastify.authenticate }, generateLessons);
};