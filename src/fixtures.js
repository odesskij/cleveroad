#!/usr/bin/env node

var mongoose = require('./mongoose')
    , _ = require('lodash')
    , faker = require('faker')
    , log = require('./log')('FIXTURES');


module.exports = function () {
    var User = mongoose.UserModel;
    User.remove({}, function () {
        _.each(_.range(0, 20), function () {
            var model = new User({
                email: faker.internet.email(),
                password: faker.internet.password(),
                phone: faker.phone.phoneNumber(),
                name: faker.name.firstName()
            });
            model.save(function (err, model) {
                if(err) return log(err);
                log('User ', model.toObject({}));
            });
        });
    });

    _.delay(function () {
        mongoose.connection.close();
    }, 3000);
};