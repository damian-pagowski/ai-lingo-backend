const {
  getLessonsForUser,
  getLessonById,
  flagLesson,
  deleteLesson,
  generateInitialLesson,
  createLesson,
} = require("../services/lessonService");
const { DatabaseError } = require("../errors/customErrors");

const { voteExercise } = require("../services/exerciseService");
const { generateLessonsWithAI } = require("../services/aiLessonService");

const getLessons = async (req, reply) => {
  const {
    page = 1,
    limit = 10,
    difficulty,
  } = req.query;

  try {
    const userId = req.user.id;
    const lessons = await getLessonsForUser(
      userId,
      page,
      limit,
      difficulty,
      "created_at",
      "desc"
    );
    reply.send(lessons);
  } catch (err) {
    throw new DatabaseError("Failed to fetch lessons", err.message);
  }
};

const getLessonByIdHandler = async (req, reply) => {
  try {
    const lesson = await getLessonById(req.params.id);
    reply.send(lesson);
  } catch (err) {
    throw new DatabaseError("Failed to fetch lesson", err.message);
  }
};

const flagLessonHandler = async (req, reply) => {
  try {
    await flagLesson(req.user.id, req.params.lessonId);
    reply.send({ message: "Lesson flagged successfully" });
  } catch (err) {
    throw new DatabaseError("Failed to flag lesson", err.message);
  }
};

const deleteLessonHandler = async (req, reply) => {
  try {
    await deleteLesson(req.params.id);
    reply.send({ message: "Lesson deleted successfully" });
  } catch (err) {
    throw new DatabaseError("Failed to delete lesson", err.message);
  }
};

const generateInitialLessonHandler = async (req, reply) => {
  try {
    const lesson = await generateInitialLesson(req.user.id);
    reply.send(lesson);
  } catch (err) {
    throw new DatabaseError("Failed to generate initial lesson", err.message);
  }
};

const generateCustomLessonHandler = async (req, reply) => {
  try {
    const lesson = await createLesson(req.user.id);
    reply.send(lesson);
  } catch (err) {
    throw new DatabaseError("Failed to generate custom lesson", err.message);
  }
};

const generateLessonsWithAIHandler = async (req, reply) => {
  try {
    const lesson = await generateLessonsWithAI(req.user.id);
    reply.send(lesson);
  } catch (err) {
    throw new DatabaseError("Failed to generate lesson with AI", err.message);
  }
};

const voteExerciseHandler = async (req, reply) => {
  try {
    const { exerciseId, voteType } = req.body;
    const updatedExercise = await voteExercise(exerciseId, voteType);
    reply.send({
      message: `Exercise ${voteType}d successfully`,
      exerciseId: exerciseId,
      newScore: updatedExercise.score,
    });
  } catch (err) {
    throw new DatabaseError("Failed to process vote", err.message);
  }
};

module.exports = {
  flagLesson: flagLessonHandler,
  generateCustomLesson: generateCustomLessonHandler,
  generateLessonsWithAI: generateLessonsWithAIHandler,
  getLessons,
  getLessonById: getLessonByIdHandler,
  generateInitialLesson: generateInitialLessonHandler,
  deleteLesson: deleteLessonHandler,
  voteExercise: voteExerciseHandler,
};
