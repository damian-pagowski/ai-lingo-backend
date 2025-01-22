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

const updateUserRole = async (request, reply) => {
    const { id } = request.params;
    const { role } = request.body;

    try {
        const updatedRows = await db('users').where({ id }).update({ role });

        if (!updatedRows) {
            return reply.status(404).send({ error: 'User not found' });
        }

        reply.send({ id, role });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to update user role' });
    }
};

module.exports = {
    createUser,
    getUsers,
    updateUserRole
};