'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    title: Joi.string().optional(),
    price: Joi.string().optional()
});

module.exports = schema;