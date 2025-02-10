const { getDashboard } = require("../controllers/dashboardController");

module.exports = async function (fastify) {
  fastify.get(
    "/dashboard",
    { preValidation: [fastify.authenticate] },
    getDashboard
  );
};
