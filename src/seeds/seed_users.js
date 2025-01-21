const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
    await knex('users').del(); 

    const hashedPassword = await bcrypt.hash('password123', 10);

    await knex('users').insert([
        { name: 'Alice', email: 'alice@example.com', password: hashedPassword },
        { name: 'Bob', email: 'bob@example.com', password: hashedPassword }
    ]);
};