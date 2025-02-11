const {
  submitAnswers,
  getUserProgress,
  getRankings,
} = require("../controllers/progressController");
const {
  getLessonTracking,
} = require("../controllers/lessonTrackingController");

module.exports = async function (fastify) {
  fastify.get(
    "/lesson-tracking",
    { preValidation: [fastify.authenticate] },
    getLessonTracking
  );
  fastify.post(
    "/submit-answers",
    { preHandler: [fastify.authenticate] },
    submitAnswers
  );
  fastify.get(
    "/progress",
    { preHandler: [fastify.authenticate] },
    getUserProgress
  );

  fastify.get("/ranking", { preHandler: [fastify.authenticate] }, getRankings);
};
