exports.up = function (knex) {
    return knex.schema.createTable('lessons', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.string('difficulty').notNullable().defaultTo('beginner');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('lessons');
};