const Joi = require('joi');

const lessonSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    content: Joi.string().min(20).required(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    user_id: Joi.number().integer().required()
});

module.exports = {
    lessonSchema
};