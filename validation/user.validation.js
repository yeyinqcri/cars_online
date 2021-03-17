const Joi = require("joi");

//joi schema

const schema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  userName: Joi.string().min(3).required(),
  email: Joi.string().email(),
  password: Joi.string().required(),
  password: Joi.string().min(3).max(8).required().strict(),
  confirmPassword:Joi.string().valid(Joi.ref('password')).required().strict().error(()=>new Error('"passwords" must be same')),
  file: Joi.string().required(),
});

module.exports = schema;
