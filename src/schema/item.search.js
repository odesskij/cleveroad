'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    title: Joi.string().optional(),
    order_by: Joi.string().optional(),
    order_type: Joi.string().optional()
});

module.exports = schema;