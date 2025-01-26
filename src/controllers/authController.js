const db = require('../db');
const bcrypt = require('bcrypt');
const { DatabaseError, UnauthorizedError } = require('../errors/customErrors');

const registerUser = async (request, reply) => {
    const { name, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [id] = await db('users').insert({ name, email, password: hashedPassword });
        reply.send({ id, name, email });
    } catch (err) {
        throw new DatabaseError('Failed to register user', err.message);
    }
};

const loginUser = async (request, reply) => {
    const { email, password } = request.body;
    const user = await db('users').where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = request.server.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role  
    });

    reply.send({ token });
};

module.exports = {
    registerUser,
    loginUser
};