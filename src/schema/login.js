'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});

module.exports = schema;