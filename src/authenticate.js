'use strict';

var passport = require('passport');

module.exports = function (action) {
    return function (req, res, next) {
        passport.authenticate('http-header-token',  function (err, user) {
            if(err) {
                return next(err);
            }
            if(!user) {
                res.status(401);
                return res.send();
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
