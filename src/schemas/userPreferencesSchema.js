const Joi = require("joi");

const userPreferencesSchema = Joi.object({
  level: Joi.string().required(),
  goals: Joi.array().items(Joi.string()).required(),
  domains: Joi.array().items(Joi.string()).required(),
  daily_lesson_commitment: Joi.number().integer().min(1),
});

module.exports = {
  userPreferencesSchema,
};