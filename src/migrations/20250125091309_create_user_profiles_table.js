exports.up = function(knex) {
    return knex.schema.createTable('user_profiles', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('course_name').notNullable();
      table.enum('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).notNullable();
      table.string('progress').notNullable().defaultTo('0/0'); // Example: '5/18'
      table.integer('streak').notNullable().defaultTo(0);
      table.integer('current_lesson_id').unsigned().notNullable().references('id').inTable('lessons').onDelete('SET NULL');
      table.timestamps(true, true); // Adds created_at and updated_at columns
  
      table.unique(['user_id']); // Ensure one profile per user
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_profiles');
  };