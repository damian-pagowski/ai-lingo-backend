const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../errors/customErrors");
const { fetchExercises } = require("./exerciseService");
const {
  beautifySnakeCaseCollection,
  capitalize,
} = require("../utils/formatter.js");
const getUserPreferences = async (userId) => {
  const preferences = await db("user_preferences")
    .where({ user_id: userId })
    .first();
  if (!preferences) {
    throw new NotFoundError("User preferences not found");
  }
  return {
    focusAreas: JSON.parse(preferences.focus_areas),
    level: preferences.current_level,
  };
};

const getUserProgress = async (userId) => {
  const progress = await db("progress")
    .where({ user_id: userId })
    .select("topic_progress");
  if (progress.length === 0) {
    return { avgScore: 0, topicScores: {} };
  }

  let totalScore = 0,
    count = 0;
  const topicScores = {};

  progress.forEach(({ topic_progress }) => {
    const parsedProgress = JSON.parse(topic_progress);
    for (const [topic, score] of Object.entries(parsedProgress)) {
      if (!topicScores[topic]) {
        topicScores[topic] = { total: 0, count: 0 };
      }
      topicScores[topic].total += score;
      topicScores[topic].count++;
      totalScore += score;
      count++;
    }
  });

  return {
    avgScore: count ? Math.round(totalScore / count) : 0,
    topicScores,
  };
};

const determineLessonDifficulty = (avgScore) => {
  if (avgScore < 50) {
    return {
      difficulty: "easy",
      range: [0, 0.4],
      types: ["multiple_choice"],
    };
  }
  if (avgScore < 75) {
    return {
      difficulty: "medium",
      range: [0.4, 0.7],
      types: ["multiple_choice"],
    };
  }
  return {
    difficulty: "hard",
    range: [0.7, 1],
    types: ["multiple_choice", "fill_in_the_blank"],
  };
};

const createLesson = async (userId) => {
  const { focusAreas, level } = await getUserPreferences(userId);
  const { avgScore } = await getUserProgress(userId);
  const { difficulty, range, types } = determineLessonDifficulty(avgScore);
  const exercises = await fetchExercises(focusAreas, range, types);
  if (exercises.length === 0) {
    throw new NotFoundError("No exercises found");
  }

  const [lessonId] = await db("lessons").insert({
    user_id: userId,
    title: `Individuelle Lektion für ${level} Lerner`,
    content: `Diese Lektion basiert auf deinem Fortschritt und deinen Interessen: ${beautifySnakeCaseCollection(
      focusAreas
    )}.`,
    difficulty,
    status: "not_started",
    created_at: new Date(),
  });

  await db("lesson_exercises").insert(
    exercises.map((ex) => ({ lesson_id: lessonId, exercise_id: ex.id }))
  );

  return {
    lessonId,
    title: `Lektion für ${level}`,
    content: `Diese Lektion basiert auf ${beautifySnakeCaseCollection(focusAreas)}`,
    difficulty: capitalize(difficulty),
    status: "not_started",
    exercises,
  };
};

const generateInitialLesson = async (userId) => {
  const lesson = {
    title: "Erste Schritte: Begrüßung und Alltag",
    content: "Willkommen zu deiner ersten Deutschstunde!",
    difficulty: "beginner",
    user_id: userId,
    created_at: new Date().toISOString(),
    status: "not_started",
  };

  const exercises = await fetchExercises(
    ["daily_life", "work", "traveling", "social_interactions"],
    [0, 0.4],
    ["multiple_choice"]
  );
  if (exercises.length === 0) {
    throw new NotFoundError("No exercises found");
  }

  const lessonId = await db("lessons").insert(lesson);
  return { lessonId: lessonId[0], exercises, ...lesson };
};

const getLessonsForUser = async (
  userId,
  page,
  limit,
  difficulty,
  sort,
  order
) => {
  let query = db("lessons")
    .select("*")
    .where("user_id", userId)
    .whereNot("status", "flagged");

  if (difficulty) {
    query = query.where("difficulty", difficulty);
  }
  return query
    .orderBy(sort, order)
    .limit(limit)
    .offset((page - 1) * limit);
};

const getLessonById = async (lessonId) => {
  const lesson = await db("lessons").where({ id: lessonId }).first();
  if (!lesson) {
    throw new NotFoundError("Lesson not found");
  }

  const exercises = await db("exercises")
    .join("lesson_exercises", "exercises.id", "lesson_exercises.exercise_id")
    .where("lesson_exercises.lesson_id", lessonId)
    .select(
      "exercises.id",
      "exercises.question",
      "exercises.type",
      "exercises.options",
      "exercises.correct_answer"
    );

  return { ...lesson, exercises };
};

const flagLesson = async (userId, lessonId) => {
  const lesson = await db("lessons").where({ id: lessonId }).first();
  if (!lesson) {
    throw new NotFoundError("Lesson not found");
  }
  if (lesson.user_id !== userId) {
    throw new UnauthorizedError(
      "You do not have permission to flag this lesson"
    );
  }

  await db("lessons").where({ id: lessonId }).update({ status: "flagged" });
};

const deleteLesson = async (lessonId) => {
  const deletedRows = await db("lessons").where({ id: lessonId }).del();
  if (!deletedRows) {
    throw new NotFoundError("Lesson not found");
  }
};

module.exports = {
  getLessonsForUser,
  deleteLesson,
  getLessonById,
  flagLesson,
  getUserPreferences,
  getUserProgress,
  generateInitialLesson,
  createLesson,
};
