/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.alterTable('progress', (table) => {
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Add created_at with default value
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.alterTable('progress', (table) => {
        table.dropColumn('created_at'); // Remove column on rollback
    });
};