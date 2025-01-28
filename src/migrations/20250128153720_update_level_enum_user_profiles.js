/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('user_profiles', (table) => {
      table
        .enum('level', ['none', 'beginner', 'intermediate', 'advanced'])
        .notNullable()
        .defaultTo('none')
        .alter();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    await knex.schema.alterTable('user_profiles', (table) => {
      table
        .enum('level', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
        .notNullable()
        .defaultTo('A1')
        .alter();
    });
  };