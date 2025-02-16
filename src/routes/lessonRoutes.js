const {
  generateCustomLesson,
  generateLessonsWithAI,
  generateInitialLesson,
  getLessons,
  getLessonById,
  deleteLesson,
  flagLesson,
} = require("../controllers/lessonController");
const authorizeRoles = require("../middleware/authorizeRoles");

module.exports = async function (fastify) {
  fastify.get("/lessons", { preHandler: [fastify.authenticate] }, getLessons);
  fastify.get(
    "/lessons/:id",
    { preHandler: [fastify.authenticate] },
    getLessonById
  );

  fastify.post(
    "/create-lesson",
    { preHandler: fastify.authenticate },
    generateCustomLesson
  );

  fastify.post(
    "/create-initial-lesson",
    { preHandler: fastify.authenticate },
    generateInitialLesson
  );
  fastify.post(
    "/create-ai-lesson",
    { preHandler: fastify.authenticate },
    generateLessonsWithAI
  );
  fastify.delete(
    "/lessons/:id",
    { preHandler: [fastify.authenticate, authorizeRoles(["admin"])] },
    deleteLesson
  );
  fastify.get("/flag-lesson/:lessonId", { preHandler: [fastify.authenticate] }, flagLesson);
};
