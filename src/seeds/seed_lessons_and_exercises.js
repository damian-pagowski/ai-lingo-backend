exports.seed = async function (knex) {
  // Clear existing data to prevent duplicate entries
  await knex('lesson_exercises').del();
  await knex('exercises').del();
  await knex('lessons').del();

  // Insert lessons and capture inserted IDs
  const lessonIds = await knex('lessons')
    .insert([
      { title: 'Intro to Spanish', content: 'Welcome to Spanish learning!', difficulty: 'beginner', user_id: 1 },
      { title: 'Spanish Greetings', content: 'Learn how to greet in Spanish.', difficulty: 'beginner', user_id: 1 },
      { title: 'Spanish Numbers', content: 'Learn how to count in Spanish.', difficulty: 'beginner', user_id: 1 },
    ])
    .returning('id');

  // Insert exercises and capture inserted IDs
  const exerciseIds = await knex('exercises')
    .insert([
      {
        question: 'What is the Spanish word for "hello"?',
        type: 'multiple_choice',
        options: JSON.stringify(['Hola', 'Adiós', 'Gracias']),
        correct_answer: 'Hola',
      },
      {
        question: 'How do you say "goodbye" in Spanish?',
        type: 'multiple_choice',
        options: JSON.stringify(['Hola', 'Adiós', 'Gracias']),
        correct_answer: 'Adiós',
      },
      {
        question: 'Complete the phrase: Buenos ____',
        type: 'fill_in_the_blank',
        options: null,
        correct_answer: 'días',
      },
    ])
    .returning('id');

  // Relate lessons to exercises (assign unique exercises to each lesson)
  for (const lessonId of lessonIds) {
    for (const exerciseId of exerciseIds) {
      await knex('lesson_exercises').insert({
        lesson_id: lessonId.id,
        exercise_id: exerciseId.id,
      });
    }
  }
};