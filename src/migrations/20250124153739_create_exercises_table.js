exports.up = function (knex) {
    return knex.schema
      .createTable('exercises', (table) => {
        table.increments('id').primary();
        table.string('question').notNullable();
        table.string('type').notNullable(); // 'multiple_choice', 'fill_in_the_blank'
        table.text('options'); // JSON for MCQs
        table.string('correct_answer').notNullable();
      })
      .createTable('lesson_exercises', (table) => {
        table.integer('lesson_id').unsigned().notNullable();
        table.integer('exercise_id').unsigned().notNullable();
        table.primary(['lesson_id', 'exercise_id']);
        table.foreign('lesson_id').references('lessons.id').onDelete('CASCADE');
        table.foreign('exercise_id').references('exercises.id').onDelete('CASCADE');
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('lesson_exercises').dropTable('exercises');
  };