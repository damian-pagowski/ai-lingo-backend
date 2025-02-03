const db = require("../db");
const {
  NotFoundError,
  DatabaseError,
  ValidationError,
} = require("../errors/customErrors");

const getProgress = async (req, reply) => {
  try {
    const userId = req.user.id;

    const progressRecords = await db("progress")
      .where({ user_id: userId })
      .select("overall_score", "topic_progress", "max_topic_score"); 

    if (!progressRecords.length) {
      throw new NotFoundError("No progress data found for the user", {
        userId,
      });
    }

    let totalScore = 0;
    let totalLessons = 0;
    const topicScores = {};

    progressRecords.forEach(
      ({ overall_score, topic_progress, max_topic_score }) => {
        totalScore += overall_score;
        totalLessons++;

        const topicData = JSON.parse(topic_progress); 
        const maxTopicData = JSON.parse(max_topic_score);

        for (const [topic, topicScore] of Object.entries(topicData)) {
          if (!topicScores[topic]) {
            topicScores[topic] = { total: 0, count: 0, maxTotal: 0 }; 
          }
          topicScores[topic].total += topicScore;
          topicScores[topic].count++;
          topicScores[topic].maxTotal += maxTopicData[topic] || 0;
        }
      }
    );

    const overallScore = totalLessons
      ? Math.round(totalScore / totalLessons)
      : 0;

    const topicAverages = {};
    for (const [topic, data] of Object.entries(topicScores)) {
      const percentage =
        data.maxTotal > 0 ? Math.round((data.total / data.maxTotal) * 100) : 0; 
      topicAverages[topic] = {
        score: data.total,
        maxScore: data.maxTotal, 
        percentage, 
      };
    }

    reply.send({
      overallScore,
      topicScores: topicAverages,
    });
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to fetch user progress", err.message);
  }
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
  getProgress,
  submitAnswers,
};
