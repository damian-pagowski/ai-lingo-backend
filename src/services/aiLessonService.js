const db = require("../db");
const { NotFoundError } = require("../errors/customErrors");
const { generateLessonsPrompt } = require("../utils/aiUtils");

const generateLessonsWithAI = async (userId) => {
  const userPreferences = await db("user_preferences").where({ user_id: userId }).first();
  if (!userPreferences) {throw new NotFoundError("User preferences not found.");}

  const level = userPreferences.current_level;
  const goal = JSON.parse(userPreferences.learning_goal).join(", ");
  const areas = JSON.parse(userPreferences.focus_areas).join(", ");

  const prompt = await generateLessonsPrompt(level, goal, areas);
  
  console.log("Generated AI Prompt:", prompt);

  const aiResponse = `{
    "title": "Deutschunterricht: Reisen und Arbeit",
    "content": "In dieser Lektion werden wir über Reisen und Arbeit sprechen.",
    "difficulty": "intermediate",
    "status": "not_started",
    "exercises": [
      { "question": "Was ist dein Traumreiseziel?", "type": "fill_in_the_blank", "correct_answer": "Italien" },
      { "question": "Welche Sprachen sprichst du für die Arbeit?", "type": "multiple_choice", "options": ["Englisch", "Spanisch"], "correct_answer": "Englisch" }
    ]
  }`;

  console.log("AI Response:", aiResponse);

  const lesson = JSON.parse(aiResponse);

  const [lessonId] = await db("lessons").insert({
    title: lesson.title,
    content: lesson.content,
    difficulty: lesson.difficulty,
    user_id: userId,
    status: "not_started",
    created_at: new Date(),
  });

  for (const exercise of lesson.exercises) {
    await db("exercises").insert({
      lesson_id: lessonId,
      question: exercise.question,
      type: exercise.type,
      options: JSON.stringify(exercise.options || []),
      correct_answer: exercise.correct_answer,
    });
  }

  return { lessonId, title: lesson.title, difficulty: lesson.difficulty, status: "not_started" };
};

module.exports = { generateLessonsWithAI };