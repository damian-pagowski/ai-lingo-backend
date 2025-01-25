const {
  addProgress,
  getProgressByUser,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");
const { progressSchema } = require("../schemas/progressSchema");
const validateRequest = require("../middleware/validateRequest");
const { getProgressByLesson } = require("../controllers/progressController");
const authorizeRoles = require("../middleware/authorizeRoles");

module.exports = async function (fastify) {
  fastify.post(
    "/progress",
    { preHandler: [fastify.authenticate, validateRequest(progressSchema)] },
    addProgress
  );
  fastify.get(
    "/progress/:id",
    { preHandler: [fastify.authenticate] },
    getProgressByUser
  );
  fastify.put(
    "/progress/:id",
    { preHandler: [fastify.authenticate, validateRequest(progressSchema)] },
    updateProgress
  );
  fastify.delete(
    "/progress/:id",
    { preHandler: [fastify.authenticate] },
    deleteProgress
  );
  fastify.get(
    "/progress/lesson/:lessonId",
    {
      preHandler: [fastify.authenticate, authorizeRoles(["admin", "teacher"])],
    },
    getProgressByLesson
  );
};
