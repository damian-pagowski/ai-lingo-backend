const { userSchema } = require("../schemas/userSchema");
const validateRequest = require("../middleware/validateRequest");
const { createUser, getUsers } = require("../controllers/userController");
const authorizeRoles = require("../middleware/authorizeRoles");
const { updateUserRole } = require("../controllers/userController");

module.exports = async function (fastify) {
  fastify.post(
    "/users",
    {
      preHandler: [
        fastify.authenticate,
        authorizeRoles(["admin"]),
        validateRequest(userSchema),
      ],
    },
    createUser
  );
  fastify.get(
    "/users",
    { preHandler: [fastify.authenticate, authorizeRoles(["admin"])] },
    getUsers
  );
  fastify.put(
    "/users/:id/role",
    {
      preHandler: [
        fastify.authenticate,
        authorizeRoles(["admin"]),
        validateRequest(userSchema),
      ],
    },
    updateUserRole
  );
};
