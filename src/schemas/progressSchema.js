const Joi = require('joi');

const progressSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    lesson_id: Joi.number().integer().required(),
    completed: Joi.boolean().required()
});

module.exports = {
    progressSchema
};