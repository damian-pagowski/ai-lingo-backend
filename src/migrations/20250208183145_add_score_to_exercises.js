exports.up = function(knex) {
    return knex.schema.table("exercises", function(table) {
      table.integer("score").defaultTo(0); // ✅ Adds score column with default 0
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table("exercises", function(table) {
      table.dropColumn("score"); // ✅ Rollback: Removes score column
    });
  };