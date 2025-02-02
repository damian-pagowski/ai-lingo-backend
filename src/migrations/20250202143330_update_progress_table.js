/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable("progress", (table) => {
      table.float("overall_score").notNullable().defaultTo(0); // Stores overall score (0-100)
      table.json("topic_progress").notNullable().defaultTo("{}"); // JSON object storing per-topic scores
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    await knex.schema.alterTable("progress", (table) => {
      table.dropColumn("overall_score");
      table.dropColumn("topic_progress");
    });
  };