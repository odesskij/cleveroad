'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    title: Joi.string().default('.*'),
    order_by: Joi.string().only(['price', 'created_at']).default('created_at'),
    order_type: Joi.string().only(['asc', 'desc']).default('desc')
});

module.exports = schema;