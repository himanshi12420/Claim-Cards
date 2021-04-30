const Joi = require('joi');

module.exports.userSchema = Joi.object({
    firstName: Joi.string().min(3).pattern(/^[a-zA-Z]+$/).required(),
    lastName: Joi.string().min(3).pattern(/^[a-zA-Z]+$/).required(),
    email: Joi.string().required(),
    contact: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    country: Joi.string().required(),
    password: Joi.string().required()
})