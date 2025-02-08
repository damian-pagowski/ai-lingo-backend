exports.up = async function(knex) {
    // Step 1: Rename existing table (temporary backup)
    await knex.schema.renameTable("lessons", "lessons_backup");
  
    // Step 2: Create new table with the updated CHECK constraint
    await knex.schema.createTable("lessons", (table) => {
      table.increments("id").primary();
      table.integer("user_id").notNullable();
      table.string("title").notNullable();
      table.text("content").notNullable();
      table.string("difficulty").notNullable();
      table.string("status").notNullable().checkIn(["not_started", "in_progress", "completed", "flagged"]); // ✅ Fixed constraint
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  
    // Step 3: Copy data from the old table to the new one
    await knex.raw(`
      INSERT INTO lessons (id, user_id, title, content, difficulty, status, created_at)
      SELECT id, user_id, title, content, difficulty, status, created_at FROM lessons_backup;
    `);
  
    // Step 4: Drop the old table
    await knex.schema.dropTable("lessons_backup");
  };
  
  exports.down = async function(knex) {
    // Step 1: Rename the current table back to "lessons_backup"
    await knex.schema.renameTable("lessons", "lessons_backup");
  
    // Step 2: Recreate the original table with the old CHECK constraint
    await knex.schema.createTable("lessons", (table) => {
      table.increments("id").primary();
      table.integer("user_id").notNullable();
      table.string("title").notNullable();
      table.text("content").notNullable();
      table.string("difficulty").notNullable();
      table.string("status").notNullable().checkIn(["not_started", "in_progress", "completed"]); // Reverting to old constraint
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  
    // Step 3: Restore data from the backup table
    await knex.raw(`
      INSERT INTO lessons (id, user_id, title, content, difficulty, status, created_at)
      SELECT id, user_id, title, content, difficulty, status, created_at FROM lessons_backup;
    `);
  
    // Step 4: Drop the backup table
    await knex.schema.dropTable("lessons_backup");
  };