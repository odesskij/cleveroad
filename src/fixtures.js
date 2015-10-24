#!/usr/bin/env node

var mongoose = require('./mongoose')
    , _ = require('lodash')
    , crypto = require('crypto')
    , faker = require('faker')
    , log = require('./log')('FIXTURES');

function idGenerator(bytes) {
    return crypto.randomBytes(bytes || 20).toString('hex');
}


module.exports = function () {
    var User = mongoose.UserModel;
    User.remove({}, function () {
        _.each(_.range(0, 20), function () {
            var model = new User({
                email: faker.internet.email(),
                token: idGenerator()
            });
            model.save(function (err, model) {
                if(err) return log(err);
                log('User ' + model.email + ':' + model.token);
            });
        });
    });

    _.delay(function () {
        mongoose.connection.close();
    }, 3000);
};