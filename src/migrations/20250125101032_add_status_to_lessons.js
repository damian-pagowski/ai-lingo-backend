exports.up = function (knex) {
    return knex.schema.alterTable('lessons', (table) => {
      table.enum('status', ['not_started', 'in_progress', 'completed']).defaultTo('not_started').notNullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('lessons', (table) => {
      table.dropColumn('status');
    });
  };