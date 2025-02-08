exports.up = async function(knex) {
    await knex.schema.alterTable("lessons", (table) => {
      table.integer("user_id").notNullable().defaultTo(1); // ✅ Add user_id (assuming default 1)
      table.string("difficulty").notNullable().defaultTo("beginner"); // ✅ Add difficulty with default
      table.timestamp("updated_at").defaultTo(knex.fn.now()).alter(); // ✅ Ensure updated_at is a timestamp
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.alterTable("lessons", (table) => {
      table.dropColumn("user_id");
      table.dropColumn("difficulty");
    });
  };