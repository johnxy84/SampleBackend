'use strict';

const Joi = require('joi');

let validator = {
    registerValidationSchema: Joi.object().keys({
            firstname: Joi.string().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
            lastname: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().regex(/^[0-9]{11,11}$/).required(),
    }),
    
    loginValidationSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    }),
    
    emailValidatorSchema: Joi.object().keys({
        email: Joi.string().email().required(),
    }),

    passwordValidator: Joi.object().keys({
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }),

}

module.exports = validator;