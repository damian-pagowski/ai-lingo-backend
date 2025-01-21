const db = require('../db');

const createUser = async (request, reply) => {
    const { name, email } = request.body;
    try {
        const [id] = await db('users').insert({ name, email });
        const newUser = {
            id,
            name,
            email
        };
        reply.send(newUser);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to add user' });
    }
};

const getUsers = async (request, reply) => {
    try {
        const users = await db('users').select('*');
        reply.send(users);
    } catch (err) {
        reply.status(500).send({ error: 'Failed to fetch users' });
    }
};

module.exports = {
    createUser,
    getUsers
};