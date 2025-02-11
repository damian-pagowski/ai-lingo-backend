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
      .join("lesson_exercises", "exercises.id", "lesson_exercises.exercise_id")
      .where("lesson_exercises.lesson_id", lessonId)
      .select("exercises.id", "exercises.question", "exercises.type", "exercises.correct_answer", "exercises.difficulty", "exercises.topic");

    if (!exercises.length) {
      throw new NotFoundError("Exercises not found for the given lesson", { lessonId });
    }

    const pointsPerQuestion = 100 / exercises.length; 
    let totalScore = 0;
    const topicScores = {}; 
    const topicMaxScores = {}; 

    const results = exercises.map((exercise) => {
      const userAnswer = answers[exercise.id]?.trim().toLowerCase();
      const isCorrect = userAnswer === exercise.correct_answer.toLowerCase();

      if (isCorrect) {totalScore += pointsPerQuestion;}

      // Track topic progress
      const topic = exercise.topic;
      if (!topicScores[topic]) {
        topicScores[topic] = 0;
        topicMaxScores[topic] = 0;
      }

      topicScores[topic] += isCorrect ? pointsPerQuestion : 0;
      topicMaxScores[topic] += pointsPerQuestion;

      return {
        exerciseId: exercise.id,
        question: exercise.question,
        userAnswer,
        correctAnswer: exercise.correct_answer,
        isCorrect,
        difficulty: exercise.difficulty,
        topic,
      };
    });

    const finalScore = Math.round(totalScore);

    await db("progress").insert({
      user_id: userId,
      lesson_id: lessonId,
      overall_score: finalScore,
      topic_progress: JSON.stringify(topicScores), 
      max_topic_score: JSON.stringify(topicMaxScores),
      completed: true,
      created_at: new Date(),
    });

    await db("lessons").where({ id: lessonId }).update({ status: "completed" });

    reply.send({
      lessonId,
      score: finalScore,
      totalQuestions: exercises.length,
      correctAnswers: Math.round((finalScore / 100) * exercises.length), 
      topicProgress: topicScores,
      results,
    });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to process answers", err.message);
  }
};


const getRankings = async (request, reply) => {
  try {
    const userId = request.user.id;
    const fetchRanking = async (timeFrame) => {
      let query = db("progress")
        .join("users", "progress.user_id", "users.id")
        .select("progress.user_id", "users.name")
        .sum("progress.overall_score as total_score")
        .groupBy("progress.user_id")
        .orderBy("total_score", "desc")
        .limit(10);

      if (timeFrame === "daily") {
        query = query.whereRaw("DATE(progress.updated_at) = DATE('now')");
      } else if (timeFrame === "weekly") {
        query = query.whereRaw("DATE(progress.updated_at) >= DATE('now', '-7 days')");
      }

      const ranking = await query;
      return ranking.map((user, index) => ({
        place: index + 1,
        name: user.name,
        score: user.total_score,
      }));
    };

    const dailyRanking = await fetchRanking("daily");
    const weeklyRanking = await fetchRanking("weekly");
    const allTimeRanking = await fetchRanking("all_time");

    const userScoreData = await db("progress")
      .where({ user_id: userId })
      .sum("overall_score as user_score")
      .first();

    const userScore = userScoreData?.user_score || 0;

    const userRankData = await db("progress")
      .join("users", "progress.user_id", "users.id")
      .select("progress.user_id")
      .sum("progress.overall_score as total_score")
      .groupBy("progress.user_id")
      .orderBy("total_score", "desc");

    const userRank = userRankData.findIndex((u) => u.user_id === userId) + 1;

    reply.send({
      dailyRanking,
      weeklyRanking,
      allTimeRanking,
      user: {
        rank: userRank || "Unranked",
        score: userScore,
      },
    });
  } catch (err) {
    throw new DatabaseError("Failed to fetch rankings", err.message);
  }
};

module.exports = {
  getRankings,
  getUserProgress,
  submitAnswers,
};
