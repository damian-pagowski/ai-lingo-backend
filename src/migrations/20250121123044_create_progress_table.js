exports.up = function (knex) {
    return knex.schema.createTable('progress', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('lesson_id').unsigned().references('id').inTable('lessons').onDelete('CASCADE');
        table.boolean('completed').defaultTo(false);
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('progress');
};