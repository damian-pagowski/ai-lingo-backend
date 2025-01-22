const { addProgress, getProgressByUser, updateProgress, deleteProgress } = require('../controllers/progressController');
const { progressSchema } = require('../schemas/progressSchema');
const validateRequest = require('../middleware/validateRequest');
const { getProgressByLesson } = require('../controllers/progressController');
const authorizeRoles = require('../middleware/authorizeRoles');

module.exports = async function (fastify) {
    fastify.post('/progress', { preHandler: validateRequest(progressSchema) }, addProgress);
    fastify.get('/progress/:userId', getProgressByUser);
    fastify.put('/progress/:id', { preHandler: validateRequest(progressSchema) }, updateProgress);
    fastify.delete('/progress/:id', deleteProgress);
    fastify.get('/progress/lesson/:lessonId', {
        preHandler: [fastify.authenticate, authorizeRoles(['admin', 'teacher'])]
    }, getProgressByLesson);
};
