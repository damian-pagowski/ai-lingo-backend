const Joi = require("joi");

const userPreferencesSchema = Joi.object({
  level: Joi.string().required(),
  goals: Joi.array().items(Joi.string()).required(),
  domains: Joi.array().items(Joi.string()).required(),
});

module.exports = {
  userPreferencesSchema,
};
