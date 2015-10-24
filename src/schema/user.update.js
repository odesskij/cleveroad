'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    current_password: Joi.string().min(6).optional(),
    new_password: Joi.string().min(6).optional(),
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    phone: Joi.string().regex(/^\+380\d{9}$/).optional()
}).with('new_password', 'current_password');

module.exports = schema;