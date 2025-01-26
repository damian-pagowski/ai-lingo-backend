const { ValidationError } = require('../errors/customErrors');

const validateRequest = (schema) => {
    return async (request, _reply) => {
        const { error } = schema.validate(request.body, { abortEarly: false });

        if (error) {
            throw new ValidationError('Validation failed', error.details.map((err) => err.message));
        }
    };
};

module.exports = validateRequest;