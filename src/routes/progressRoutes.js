const {
  submitAnswers,
  getProgress,
} = require("../controllers/progressController");

module.exports = async function (fastify) {
  fastify.post(
    "/submit-answers",
    { preHandler: [fastify.authenticate] },
    submitAnswers
  );
  fastify.get(
    "/progress",
    { preHandler: [fastify.authenticate] },
    getProgress
  );
};
