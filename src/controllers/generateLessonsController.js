const db = require("../db");
const { DatabaseError, NotFoundError } = require("../errors/customErrors");
const { generateLessonsPrompt } = require("../utils/aiUtils");

const generateLessons = async (request, reply) => {
  try {
    const userId = request.user.id;

    // user preferences
    const userPreferences = await db("user_preferences")
      .where({ user_id: userId })
      .first();
    if (!userPreferences) {
      throw new NotFoundError("User preferences not found.");
    }

    const level = userPreferences.current_level;
    const goal = JSON.parse(userPreferences.learning_goal).join(", ");
    const areas = JSON.parse(userPreferences.focus_areas).join(", ");

    // create AI prompt string
    const prompt = await generateLessonsPrompt(level, goal, areas);

    console.log("Generated AI Prompt:", prompt); // Debugging log

    // Call AI API
    // TODO - to save tokens
    // const aiResponse = await generate(prompt);
    const aiResponse = `{
  "title": "Deutschunterricht: Reisen und Arbeit",
  "content": "In dieser Lektion werden wir über Reisen und Arbeit sprechen. Wir konzentrieren uns darauf, wie man in verschiedenen Situationen kommuniziert.",
  "difficulty": "intermediate",
  "status": "not_started",
  "exercises": [
    {
      "question": "Was ist dein Traumreiseziel?",
      "type": "fill_in_the_blank",
      "options": null,
      "correct_answer": "Mein Traumreiseziel ist Italien."
    },
    {
      "question": "Welche Sprachen sprichst du für die Arbeit?",
      "type": "multiple_choice",
      "options": ["Englisch", "Spanisch", "Französisch"],
      "correct_answer": "Englisch"
    }
  ]
}`;
    console.log("AI Response:", aiResponse);

    // Parse AI Response
    const lesson = JSON.parse(aiResponse);

    // Insert lesson into the database
    const [lessonId] = await db("lessons").insert({
      title: lesson.title,
      content: lesson.content,
      difficulty: lesson.difficulty,
      user_id: userId,
      status: "not_started",
      created_at: new Date(),
    });

    // Insert exercises to DB
    for (const exercise of lesson.exercises) {
      if (!exercise.question || !exercise.type || !exercise.correct_answer) {
        continue;
      }

      await db("exercises").insert({
        lesson_id: lessonId,
        question: exercise.question,
        type: exercise.type,
        options: JSON.stringify(exercise.options || []),
        correct_answer: exercise.correct_answer,
      });
    }

    reply.status(201).send({
      message: "Lessons generated successfully",
      lessons: lesson,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to generate lesson", err.message);
  }
};

module.exports = { generateLessons };
