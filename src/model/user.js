'use strict';

var mongoose = require('mongoose')
    , idGenerator = require('../id_generator')
    , Schema = mongoose.Schema;
var User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    }
});

User.pre('save', function (next) {
    this.token = idGenerator();
    next();
});

module.exports = mongoose.model('User', User);

