/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable("exercises", (table) => {
      table.string("level").notNullable().defaultTo("beginner"); // beginner, intermediate, advanced
      table.integer("difficulty").notNullable().defaultTo(50); // Scale: 1-100
      table.string("topic").notNullable().defaultTo("general"); // work, travel, daily_life, etc.
      table.integer("times_used").notNullable().defaultTo(0); // Tracks usage frequency
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.alterTable("exercises", (table) => {
      table.dropColumn("level");
      table.dropColumn("difficulty");
      table.dropColumn("topic");
      table.dropColumn("times_used");
    });
  };