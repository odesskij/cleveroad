'use strict';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
var User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('User', User);

