const Joi = require('joi');

const validateRequest = (schema) => {
    return async (request, reply) => {
        const { error } = schema.validate(request.body, { abortEarly: false });

        if (error) {
            return reply.status(400).send({
                error: 'Validation failed',
                details: error.details.map((err) => err.message)
            });
        }
    };
};

module.exports = validateRequest;