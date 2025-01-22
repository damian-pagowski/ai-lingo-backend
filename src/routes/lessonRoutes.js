const { createLesson, getLessons, getLessonById, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { lessonSchema } = require('../schemas/lessonSchema');
const validateRequest = require('../middleware/validateRequest');

module.exports = async function (fastify) {
    fastify.get('/lessons', getLessons);
    fastify.get('/lessons/:id', getLessonById);
    fastify.post('/lessons', { preHandler: [fastify.authenticate] }, createLesson);
    fastify.put('/lessons/:id', { preHandler: [fastify.authenticate] }, updateLesson);
    fastify.delete('/lessons/:id', { preHandler: [fastify.authenticate] }, deleteLesson);
};