/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function (knex) {
    // Create a new table with the updated schema
    await knex.schema.createTable('user_profiles_new', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('course_name').notNullable();
      table.string('level').notNullable(); // Remove the enum constraint for "level"
      table.string('progress').defaultTo('0/10').notNullable();
      table.integer('streak').defaultTo(0).notNullable();
      table.integer('current_lesson_id').defaultTo(1).notNullable();
      table.timestamps(true, true);
    });
  
    // Copy data from the old table to the new table
    await knex.raw(`
      INSERT INTO user_profiles_new (id, user_id, course_name, level, progress, streak, current_lesson_id, created_at, updated_at)
      SELECT id, user_id, course_name, level, progress, streak, current_lesson_id, created_at, updated_at
      FROM user_profiles
    `);
  
    // Drop the old table
    await knex.schema.dropTable('user_profiles');
  
    // Rename the new table to the original name
    await knex.schema.renameTable('user_profiles_new', 'user_profiles');
  };
  
  /**
   * @param {import('knex').Knex} knex
   * @returns {Promise<void>}
   */
  exports.down = async function (knex) {
    // Recreate the old table with the original schema
    await knex.schema.createTable('user_profiles_old', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('course_name').notNullable();
      table
        .enum('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
        .notNullable(); // Add back the enum constraint
      table.string('progress').defaultTo('0/10').notNullable();
      table.integer('streak').defaultTo(0).notNullable();
      table.integer('current_lesson_id').defaultTo(1).notNullable();
      table.timestamps(true, true);
    });
  
    // Copy data from the current table back to the old table
    await knex.raw(`
      INSERT INTO user_profiles_old (id, user_id, course_name, level, progress, streak, current_lesson_id, created_at, updated_at)
      SELECT id, user_id, course_name, level, progress, streak, current_lesson_id, created_at, updated_at
      FROM user_profiles
    `);
  
    // Drop the current table
    await knex.schema.dropTable('user_profiles');
  
    // Rename the old table to the original name
    await knex.schema.renameTable('user_profiles_old', 'user_profiles');
  };