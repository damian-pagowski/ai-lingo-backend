const db = require("../db");
const {
  NotFoundError,
  ValidationError,
  DatabaseError,
} = require("../errors/customErrors");

const submitAnswers = async (request, reply) => {
  try {
    const userId = request.user.id;
    const { lessonId, answers } = request.body;

    if (!lessonId || !answers || typeof answers !== "object") {
      throw new ValidationError("Invalid request data", { lessonId, answers });
    }

    // Fetch lesson and exercises
    const lesson = await db("lessons").where({ id: lessonId }).first();
    if (!lesson) {
      throw new NotFoundError("Lesson not found", { lessonId });
    }

    const exercises = await db("exercises")
      .whereIn("id", Object.keys(answers))
      .select(
        "id",
        "question",
        "type",
        "correct_answer",
        "difficulty",
        "topic"
      );

    if (!exercises.length) {
      throw new NotFoundError("Exercises not found for the given lesson", {
        lessonId,
      });
    }

    // Initialize scoring
    let correctCount = 0;
    const topicScores = {};
    const topicExerciseCount = {};

    const results = exercises.map((exercise) => {
      const userAnswer = answers[exercise.id];
      const isCorrect =
        userAnswer.trim().toLowerCase() ===
        exercise.correct_answer.toLowerCase();

      if (isCorrect) {
        correctCount++;
      }

      // Calculate topic-based scoring
      if (!topicScores[exercise.topic]) {
        topicScores[exercise.topic] = 0;
        topicExerciseCount[exercise.topic] = 0;
      }

      topicScores[exercise.topic] += isCorrect ? exercise.difficulty : 0;
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

    // Calculate weighted topic progress
    const topicProgress = {};
    for (const topic in topicScores) {
      topicProgress[topic] = Math.round(
        (topicScores[topic] / topicExerciseCount[topic]) * 100
      );
    }

    // Calculate overall score
    const totalExercises = exercises.length;
    const scorePercentage = Math.round((correctCount / totalExercises) * 100);

    // Store progress in DB
    await db("progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      overall_score: scorePercentage,
      topic_progress: JSON.stringify(topicProgress),
      completed: true,
      created_at: new Date(),
    });

    // Update lesson status to "completed"
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

module.exports = { submitAnswers };
