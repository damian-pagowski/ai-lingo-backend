const {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");
const { lessonSchema } = require("../schemas/lessonSchema");
const validateRequest = require("../middleware/validateRequest");
const authorizeRoles = require("../middleware/authorizeRoles");

module.exports = async function (fastify) {
  fastify.get("/lessons", { preHandler: [fastify.authenticate] }, getLessons);
  fastify.get(
    "/lessons/:id",
    { preHandler: [fastify.authenticate] },
    getLessonById
  );
  fastify.post(
    "/lessons",
    {
      preHandler: [
        fastify.authenticate,
        authorizeRoles(["admin"]),
        validateRequest(lessonSchema),
      ],
    },
    createLesson
  );
  fastify.put(
    "/lessons/:id",
    {
      preHandler: [
        fastify.authenticate,
        authorizeRoles(["admin"]),
        validateRequest(lessonSchema),
      ],
    },
    updateLesson
  );
  fastify.delete(
    "/lessons/:id",
    { preHandler: [fastify.authenticate, authorizeRoles(["admin"])] },
    deleteLesson
  );
};
