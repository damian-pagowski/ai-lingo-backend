const { userSchema } = require('../schemas/userSchema');
const validateRequest = require('../middleware/validateRequest');
const { createUser, getUsers } = require('../controllers/userController');
const authorizeRoles = require('../middleware/authorizeRoles');
const { updateUserRole } = require('../controllers/userController');

module.exports = async function (fastify) {
    fastify.post('/users', { preHandler: validateRequest(userSchema) }, createUser);
    fastify.get('/users', getUsers);
    fastify.put('/users/:id/role', {
        preHandler: [fastify.authenticate, authorizeRoles(['admin'])]
    }, updateUserRole);
};