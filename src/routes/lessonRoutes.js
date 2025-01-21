const { createLesson, getLessons, getLessonById, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { lessonSchema } = require('../schemas/lessonSchema');
const validateRequest = require('../middleware/validateRequest');

module.exports = async function (fastify) {
    fastify.post('/lessons', { preHandler: validateRequest(lessonSchema) }, createLesson);
    fastify.get('/lessons', getLessons);
    fastify.get('/lessons/:id', getLessonById);
    fastify.put('/lessons/:id', { preHandler: validateRequest(lessonSchema) }, updateLesson);
    fastify.delete('/lessons/:id', deleteLesson);
};