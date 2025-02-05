exports.up = function(knex) {
    return knex.schema.alterTable("user_profiles", function(table) {
      table.integer("daily_lesson_commitment").defaultTo(1);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable("user_profiles", function(table) {
      table.dropColumn("daily_lesson_commitment"); 
    });
  };