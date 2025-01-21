const { registerUser, loginUser } = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../schemas/authSchema');
const validateRequest = require('../middleware/validateRequest');

module.exports = async function (fastify) {
    fastify.post('/register', { preHandler: validateRequest(registerSchema) }, registerUser);
    fastify.post('/login', { preHandler: validateRequest(loginSchema) }, loginUser);
};