const db = require("../db");
const { NotFoundError, DatabaseError } = require("../errors/customErrors");

const getProgress = async (userId) => {
  try {
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

    return { overallScore, topicScores: topicAverages };
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new DatabaseError("Failed to fetch user progress", err.message);
  }
};

const updateStreak = async (userId) => {
  try {
    const userProfile = await db("user_profiles")
      .where({ user_id: userId })
      .first();

    if (!userProfile) {
      throw new NotFoundError("User profile not found", { userId });
    }

    const lastLessonDate = userProfile.last_completed_date
      ? new Date(userProfile.last_completed_date)
      : null;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let newStreak = 1;
    let longestStreak = userProfile.longest_streak || 0;

    if (lastLessonDate) {
      if (lastLessonDate.toDateString() === yesterday.toDateString()) {
        newStreak = userProfile.current_streak + 1;
      }
      newStreak = userProfile.current_streak;
    }

    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    await db("user_profiles").where({ user_id: userId }).update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_completed_date: today,
    });

    return newStreak;
  } catch (error) {
    throw new DatabaseError("Failed to update streak", error.message);
  }
};

module.exports = { getProgress, updateStreak };
