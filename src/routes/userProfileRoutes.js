const { getUserProfile, createUserProfile, updateUserProfile } = require('../controllers/userProfileController');

module.exports = async function (fastify) {
    fastify.get('/profile', { preHandler: fastify.authenticate }, getUserProfile);
    fastify.post('/profile', { preHandler: fastify.authenticate }, createUserProfile);
    fastify.put('/profile', { preHandler: fastify.authenticate }, updateUserProfile);
};