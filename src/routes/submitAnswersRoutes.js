const { submitAnswers } = require("../controllers/submitAnswersController");

module.exports = async function (fastify) {
  fastify.post(
    "/submit-answers",
    { preHandler: [fastify.authenticate] },
    submitAnswers
  );
};
