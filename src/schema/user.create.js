'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    phone: Joi.string().regex(/^\+380\d{9}$/).optional()
});

module.exports = schema;