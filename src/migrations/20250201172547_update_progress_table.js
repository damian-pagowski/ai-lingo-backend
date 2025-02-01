/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('progress', (table) => {
      table.json('answers').nullable(); // Store user's answers as JSON
      table.integer('score').defaultTo(0); // Store the score for the lesson
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.alterTable('progress', (table) => {
      table.dropColumn('answers');
      table.dropColumn('score');
    });
  };