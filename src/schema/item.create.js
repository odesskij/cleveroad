'use strict';

var Joi = require('joi');

var schema = Joi.object().keys({
    title: Joi.string().required(),
    price: Joi.string().required()
});

module.exports = schema;