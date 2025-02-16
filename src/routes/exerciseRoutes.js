const {
getExercise,
gradeExercise,
  voteExercise
} = require("../controllers/exerciseController");

module.exports = async function (fastify) {
  fastify.get("/exercise/:id", { preHandler: [fastify.authenticate] }, getExercise);
  fastify.post("/exercise/:id", { preHandler: [fastify.authenticate] }, gradeExercise);
  fastify.post("/vote-exercise", { preHandler: [fastify.authenticate] }, voteExercise);
};
