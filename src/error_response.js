'use strict';

var HTTPStatus = require('http-status');

module.exports = function(req, res, err){
    res.status(HTTPStatus.UNPROCESSABLE_ENTITY);
    res.json(err);
};