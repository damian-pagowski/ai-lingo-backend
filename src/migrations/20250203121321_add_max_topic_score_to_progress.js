/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable("progress", (table) => {
      table.json("max_topic_score").notNullable().defaultTo("{}"); // 🔹 New column
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function(knex) {
    await knex.schema.alterTable("progress", (table) => {
      table.dropColumn("max_topic_score");
    });
  };