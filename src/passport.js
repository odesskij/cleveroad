'use strict';

var _ = require('lodash')
    , passport = require('passport')
    , HTTPHeaderTokenStrategy = require('passport-http-header-token').Strategy
    , mongoose = require('./mongoose')
    , config = require('./config');

passport.use(new HTTPHeaderTokenStrategy(
    function (token, done) {
        mongoose.UserModel.findOne({token: token}, function (err, user) {
            if(err) {
                return done(err);
            }
            if(!user) {
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

module.exports = passport;