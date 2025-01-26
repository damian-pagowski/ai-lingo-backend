const fp = require("fastify-plugin");
const { UnauthorizedError } = require("../errors/customErrors");

module.exports = fp(async (fastify, _opts) => {
  fastify.register(require("fastify-jwt"), {
    secret: process.env.JWT_SECRET || "supersecretkey",
  });

  fastify.decorate("authenticate", async (req, _reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization token missing or invalid");
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = fastify.jwt.verify(token);
      req.user = decoded;
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired token", err.message);
    }
  });
});
