/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Remove lesson_id from exercises table
    await knex.schema.alterTable("exercises", (table) => {
      table.dropColumn("lesson_id");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.alterTable("exercises", (table) => {
      table.integer("lesson_id").unsigned().references("id").inTable("lessons").onDelete("CASCADE");
    });
  };