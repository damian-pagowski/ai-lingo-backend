const { createLesson } = require("../services/lessonService");
const db = require("../db");
const { getProgress } = require("../services/progressService");

const { DatabaseError, NotFoundError } = require("../errors/customErrors");

const getDashboard = async (request, reply) => {
  try {
    const userId = request.user.id;

    // Fetch user profile and commitment
    const userProfile = await db("user_profiles")
      .where({ user_id: userId })
      .first();

    if (!userProfile) {
      throw new NotFoundError("User profile not found", { userId });
    }

    const dailyCommitment = userProfile.daily_lesson_commitment || 1;

    // Get today's lessons
    const today = new Date().toISOString().split("T")[0];

    const existingLessons = await db("lessons")
      .where("user_id", userId)
      .andWhere("created_at", ">=", `${today} 00:00:00`)
      .andWhere("created_at", "<=", `${today} 23:59:59`);

    const completedLessonsCount = existingLessons.filter(
      (lesson) => lesson.status === "completed"
    ).length;

    const lessonsToCreate = dailyCommitment - existingLessons.length;

    // Generate missing lessons
    if (lessonsToCreate > 0) {
      for (let i = 0; i < lessonsToCreate; i++) {
        await createLesson(userId);
      }
    }

    // Fetch user progress
    const progress = await getProgress(userId);

    // Send everything in a single response
    reply.send({
      user: { ...userProfile, completedLessonsCount },
      progress,
    });
  } catch (err) {
    throw new DatabaseError("Failed to fetch dashboard data", err.message);
  }
};

module.exports = {
  getDashboard,
};
