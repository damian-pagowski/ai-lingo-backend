/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("user_preferences", (table) => {
    table.renameColumn("level", "current_level");
    table.renameColumn("goals", "learning_goal");
    table.renameColumn("domains", "focus_areas");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("user_preferences", (table) => {
    table.renameColumn("current_level", "level");
    table.renameColumn("learning_goal", "goals");
    table.renameColumn("focus_areas", "domains");
  });
};
