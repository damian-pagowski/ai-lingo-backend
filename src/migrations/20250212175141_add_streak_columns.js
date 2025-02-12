exports.up = function (knex) {
    return knex.schema.table("user_profiles", function (table) {
      table.integer("current_streak").defaultTo(0);
      table.integer("longest_streak").defaultTo(0);
      table.date("last_completed_date").nullable();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table("user_profiles", function (table) {
      table.dropColumn("current_streak");
      table.dropColumn("longest_streak");
      table.dropColumn("last_completed_date");
    });
  };
  