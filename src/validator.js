'use strict';

var Joi = require('joi')
    , _ = require('lodash');

module.exports = function (schema, json, cb) {
    schema = require('./schema/' + schema);
    return Joi.validate(json, schema, function (err, value) {
        var error = _.map(err ? err.details : [], function (e) {
            return {
                field: e.path,
                message: e.message
            }
        });
        cb.call(null, _.isEmpty(error) ? undefined : error, value);
    });
};