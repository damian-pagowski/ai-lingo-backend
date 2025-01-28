const {
  saveUserPreferences,
  getUserPreferences,
} = require("../controllers/userPreferencesController");
const validateRequest = require("../middleware/validateRequest");
const { userPreferencesSchema } = require("../schemas/userPreferencesSchema");

const userPreferencesRoutes = async (fastify) => {
  fastify.post(
    "/preferences",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest(userPreferencesSchema),
      ],
    },
    saveUserPreferences
  );

  fastify.get(
    "/preferences",
    { preHandler: [fastify.authenticate] },
    getUserPreferences
  );
};

module.exports = userPreferencesRoutes;
