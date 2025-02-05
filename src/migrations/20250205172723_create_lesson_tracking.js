exports.up = function(knex) {
    return knex.schema.createTable("lesson_tracking", function(table) {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.date("date").notNullable();
      table.integer("lessons_completed").defaultTo(0);
      table.integer("completion_percentage").defaultTo(0);
  
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
  
      table.unique(["user_id", "date"]); // Ensure only one entry per user per day
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("lesson_tracking");
  };