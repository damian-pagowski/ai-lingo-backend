/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Clear existing data to prevent duplicates
    await knex("lesson_exercises").del();
    await knex("lessons").del();
  
    // Insert initial lesson
    const lessonId = await knex("lessons").insert(
      {
        id: 1,
        title: "Erste Schritte: Begrüßung und Alltag",
        content:
          "Willkommen zu deiner ersten Deutschstunde! In dieser Lektion lernst du, wie du dich vorstellen, einfache Fragen stellen und auf alltägliche Gespräche reagieren kannst.",
        difficulty: "beginner",
        user_id: 1,
        created_at: new Date(1738200000000).toISOString(),
        status: "not_started",
      },
      ["id"]
    );
  
    // Assign first 10 exercises to this lesson
    const exercises = Array.from({ length: 10 }, (_, index) => ({
      lesson_id: lessonId[0], // Ensure the inserted lesson ID is used
      exercise_id: index + 1, // Exercises 1-10
    }));
  
    await knex("lesson_exercises").insert(exercises);
  };