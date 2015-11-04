'use strict';

var passport = require('passport')
    , HTTPStatus = require('http-status');

module.exports = function (action) {
    return function (req, res, next) {
        passport.authenticate('http-header-token', function (err, user) {
            if(err) {
                return next(err);
            }
            if(!user) {
                return res
                    .status(HTTPStatus.UNAUTHORIZED)
                    .send();
            }
            req.logIn(user, {session: false}, function (err) {
                if(err) {
                    return next(err);
                }
                return action(req, res, next);
            });
        }, {session: false})(req, res, next);
    }
};
