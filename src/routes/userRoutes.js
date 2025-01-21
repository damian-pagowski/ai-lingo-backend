const { userSchema } = require('../schemas/userSchema');
const validateRequest = require('../middleware/validateRequest');
const { createUser, getUsers } = require('../controllers/userController');

module.exports = async function (fastify) {
    fastify.post('/users', { preHandler: validateRequest(userSchema) }, createUser);
    fastify.get('/users', getUsers);
};