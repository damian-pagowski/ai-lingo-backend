const db = require("../db");
const { NotFoundError, DatabaseError } = require("../errors/customErrors");

const getLessonTracking = async (req, reply) => {
    try {
      const userId = req.user.id;
      const today = new Date().toISOString().split("T")[0];
  
      const user = await db("user_preferences").where({ user_id: userId }).first();
      if (!user) {
        throw new NotFoundError("User profile not found");
      }
      const dailyCommitment = user.daily_lesson_commitment || 1;
  
      const completedLessons = await db("progress")
        .where({ user_id: userId })
        .andWhereRaw("DATE(updated_at) = ?", [today])
        .countDistinct("lesson_id as count")
        .first();
  
      const lessonsCompleted = completedLessons.count || 0;
      const completionPercentage = Math.min(
        Math.round((lessonsCompleted / dailyCommitment) * 100),
        100
      );
  
      reply.send({
        lessonsCompleted,
        dailyCommitment,
        completionPercentage,
      });
    } catch (err) {
      throw new DatabaseError("Failed to fetch lesson tracking", err.message);
    }
  };

module.exports = { getLessonTracking };