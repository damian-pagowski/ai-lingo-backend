/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("lesson_exercises", (table) => {
      table.increments("id").primary();
      table.integer("lesson_id").unsigned().notNullable();
      table.integer("exercise_id").unsigned().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
  
      // Foreign keys
      table
        .foreign("lesson_id")
        .references("id")
        .inTable("lessons")
        .onDelete("CASCADE");
  
      table
        .foreign("exercise_id")
        .references("id")
        .inTable("exercises")
        .onDelete("CASCADE");
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("lesson_exercises");
  };