const db = require("../db");
const {
  NotFoundError,
  DatabaseError,
  ValidationError,
} = require("../errors/customErrors");
const { getProgress } = require("../services/progressService");

const getUserProgress = async (req, reply) => {
  const userId = req.user.id;
  const progressData = await getProgress(userId);
  reply.send(progressData);
};

const submitAnswers = async (request, reply) => {
  try {
    const userId = request.user.id;
    const { lessonId, answers } = request.body;

    if (!lessonId || !answers || typeof answers !== "object") {
      throw new ValidationError("Invalid request data", { lessonId, answers });
    }

    const lesson = await db("lessons").where({ id: lessonId }).first();
    if (!lesson) {
      throw new NotFoundError("Lesson not found", { lessonId });
    }

    const exercises = await db("exercises")
      .join(
        "lesson_exercises",
        "exercises.id",
        "=",
        "lesson_exercises.exercise_id"
      )
      .where("lesson_exercises.lesson_id", lessonId)
      .select(
        "exercises.id",
        "exercises.question",
        "exercises.type",
        "exercises.correct_answer",
        "exercises.difficulty",
        "exercises.topic"
      );

    if (!exercises.length) {
      throw new NotFoundError("Exercises not found for the given lesson", {
        lessonId,
      });
    }

    let correctCount = 0;
    const topicScores = {};
    const topicMaxScores = {};
    const topicExerciseCount = {};

    const results = exercises.map((exercise) => {
      const userAnswer = answers[exercise.id];
      const isCorrect = userAnswer
        ? userAnswer.trim().toLowerCase() ===
          exercise.correct_answer.toLowerCase()
        : false;

      if (isCorrect) {
        correctCount++;
      }

      if (!topicScores[exercise.topic]) {
        topicScores[exercise.topic] = 0;
        topicMaxScores[exercise.topic] = 0;
        topicExerciseCount[exercise.topic] = 0;
      }

      topicScores[exercise.topic] += isCorrect
        ? Math.round(exercise.difficulty * 100)
        : 0;
      topicMaxScores[exercise.topic] += Math.round(exercise.difficulty * 100);
      topicExerciseCount[exercise.topic]++;

      return {
        exerciseId: exercise.id,
        question: exercise.question,
        userAnswer,
        correctAnswer: exercise.correct_answer,
        isCorrect,
        difficulty: exercise.difficulty,
        topic: exercise.topic,
      };
    });

    const topicProgress = {};
    for (const topic in topicScores) {
      topicProgress[topic] =
        topicMaxScores[topic] > 0
          ? Math.round((topicScores[topic] / topicMaxScores[topic]) * 100)
          : 0;
    }

    const totalExercises = exercises.length;
    const scorePercentage = Math.round((correctCount / totalExercises) * 100);

    await db("progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      overall_score: scorePercentage,
      topic_progress: JSON.stringify(topicProgress),
      max_topic_score: JSON.stringify(topicMaxScores),
      completed: true,
      created_at: new Date(),
    });

    await db("lessons").where({ id: lessonId }).update({ status: "completed" });

    // Send response
    reply.send({
      lessonId,
      score: scorePercentage,
      totalQuestions: totalExercises,
      correctAnswers: correctCount,
      topicProgress,
      results,
    });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to process answers", err.message);
  }
};

module.exports = {
  getUserProgress,
  submitAnswers,
};
