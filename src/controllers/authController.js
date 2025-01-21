const db = require('../db');
const bcrypt = require('bcrypt');

const registerUser = async (request, reply) => {
    const { name, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [id] = await db('users').insert({ name, email, password: hashedPassword });
        reply.send({ id, name, email });
    } catch (err) {
        reply.status(500).send({ error: 'Failed to register user' });
    }
};

const loginUser = async (request, reply) => {
    const { email, password } = request.body;
    const user = await db('users').where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = request.server.jwt.sign({ id: user.id, email: user.email });
    reply.send({ token });
};

module.exports = {
    registerUser,
    loginUser
};