const db = require("../db");
const { DatabaseError, NotFoundError } = require("../errors/customErrors");
const { generateLessonsPrompt } = require("../utils/aiUtils");

const getLessons = async (request, reply) => {
  const {
    page = 1,
    limit = 10,
    difficulty,
    sort = "created_at",
    order = "desc",
  } = request.query;
  try {
    let query = db("lessons").select("*");
    if (difficulty) {
      query = query.where("difficulty", difficulty);
    }
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);
    query = query.orderBy(sort, order);
    const lessons = await query;
    reply.send(lessons);
  } catch (err) {
    throw new DatabaseError("Failed to fetch lessons", err.message);
  }
};

const getLessonById = async (req, reply) => {
  const { id } = req.params;

  try {
    const lesson = await db("lessons").where({ id }).first();

    if (!lesson) {
      throw new NotFoundError("Lesson not found", { lessonId: id });
    }

    const exercises = await db("exercises")
      .join("lesson_exercises", "exercises.id", "lesson_exercises.exercise_id")
      .where("lesson_exercises.lesson_id", id)
      .select(
        "exercises.id",
        "exercises.question",
        "exercises.type",
        "exercises.options",
        "exercises.correct_answer"
      );

    reply.send({ ...lesson, exercises });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to fetch lesson", err.message);
  }
};

const deleteLesson = async (request, reply) => {
  const { id } = request.params;
  try {
    const deletedRows = await db("lessons").where({ id }).del();
    if (!deletedRows) {
      throw new NotFoundError("Lesson not found", { lessonId: id });
    }
    reply.send({ message: "Lesson deleted successfully" });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to delete lesson", err.message);
  }
};

const generateInitialLesson = async (req, reply) => {
  try {
    const userId = req.user.id;

    const lesson = {
      title: "Erste Schritte: Begrüßung und Alltag",
      content:
        "Willkommen zu deiner ersten Deutschstunde! In dieser Lektion lernst du, wie du dich vorstellen, einfache Fragen stellen und auf alltägliche Gespräche reagieren kannst.",
      difficulty: "beginner",
      user_id: userId,
      created_at: new Date().toISOString(),
      status: "not_started",
    };

    const lessonId = await db("lessons").insert(lesson);

    const exercises = Array.from({ length: 10 }, (_, index) => ({
      lesson_id: lessonId[0],
      exercise_id: index + 1,
    }));

    reply.send({
      lessonId: lessonId[0],
      title: lesson.title,
      content: lesson.content,
      difficulty: lesson.difficulty,
      status: lesson.status,
      exercises,
    });
  } catch (err) {
    throw new DatabaseError("Failed to generate Initial lesson", err.message);
  }
};

const generateCustomLesson = async (req, reply) => {
  try {
    const userId = req.user.id;

    const userPreferences = await db("user_preferences")
      .where({ user_id: userId })
      .first();

    if (!userPreferences) {
      throw new NotFoundError("User preferences not found", { userId });
    }

    const focusAreas = JSON.parse(userPreferences.focus_areas);

    const userProgress = await db("progress")
      .where({ user_id: userId })
      .select("topic_progress");

    let avgScore = 0;
    const topicScores = {};

    if (userProgress.length > 0) {
      let totalScore = 0;
      let count = 0;
      userProgress.forEach(({ topic_progress }) => {
        const progress = JSON.parse(topic_progress);
        for (const [topic, score] of Object.entries(progress)) {
          if (!topicScores[topic]) {
            topicScores[topic] = { total: 0, count: 0 };
          }
          topicScores[topic].total += score;
          topicScores[topic].count++;
          totalScore += score;
          count++;
        }
      });

      avgScore = count ? Math.round(totalScore / count) : 0;
    }

    let difficultyRange;
    const allowedTypes = ["multiple_choice"];

    if (avgScore < 50) {
      difficultyRange = [0, 0.4]; // Easy
    } else if (avgScore < 75) {
      difficultyRange = [0.4, 0.7]; // Medium
    } else {
      difficultyRange = [0.7, 1]; // Hard
      allowedTypes.push("fill_in_the_blank");
    }

    const exercises = await db("exercises")
      .whereIn("topic", focusAreas)
      .whereBetween("difficulty", difficultyRange)
      .whereIn("type", allowedTypes)
      .orderByRaw("RANDOM()") //shuffle exercises
      .limit(10);

    if (exercises.length === 0) {
      throw new NotFoundError("No exercises found matching user criteria", {
        userId,
        focusAreas,
        difficultyRange,
      });
    }

    const [lessonId] = await db("lessons").insert({
      user_id: userId,
      title: `Individuelle Lektion für ${userPreferences.current_level} Lerner`,
      content: `Diese Lektion basiert auf deinem Fortschritt und deinen Interessen: ${focusAreas.join(
        ", "
      )}.`,
      difficulty:
        avgScore < 50
          ? "beginner"
          : avgScore < 75
          ? "intermediate"
          : "advanced",
      status: "not_started",
      created_at: new Date(),
    });

    const lessonExercises = exercises.map((exercise) => ({
      lesson_id: lessonId,
      exercise_id: exercise.id,
    }));

    await db("lesson_exercises").insert(lessonExercises);

    reply.send({
      lessonId,
      title: `Individuelle Lektion für ${userPreferences.current_level} Lerner`,
      content: `Diese Lektion basiert auf deinem Fortschritt und deinen Interessen: ${focusAreas.join(
        ", "
      )}.`,
      difficulty:
        avgScore < 50
          ? "beginner"
          : avgScore < 75
          ? "intermediate"
          : "advanced",
      status: "not_started",
      exercises,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to generate custom lesson", err.message);
  }
};

const generateLessonsWithAI = async (request, reply) => {
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

module.exports = {
  generateCustomLesson,
  generateLessonsWithAI,
  getLessons,
  getLessonById,
  generateInitialLesson,
  deleteLesson,
};
