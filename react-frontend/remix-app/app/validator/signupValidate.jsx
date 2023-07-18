const Joi = require("joi")

export const signupSchema = Joi.object({
    username : Joi.string()
    .alphanum()
    .min(5)
    .max(20)
    .required(),

    email : Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .required(),

    phone : Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),

    password : Joi.string()
    .min(8)
    .max(128)
    .required(),

}).options({ abortEarly: false })