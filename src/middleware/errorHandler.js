const { AppError } = require("../errors/customErrors");

const errorHandler = (error, request, reply) => {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      error: true,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  } else if (error.validation) {
    reply.status(400).send({
      error: true,
      message: "Validation error",
      details: error.validation.map((err) => err.message),
    });
  } else {
    request.log.error("Unexpected Error:", error);
    reply.status(500).send({
      error: true,
      message: error.message,
    });
  }
};

module.exports = errorHandler;
