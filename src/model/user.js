'use strict';

var mongoose = require('mongoose')
    , idGenerator = require('../id_generator')
    , passwordEncoder = require('../password_encoder')
    , Schema = mongoose.Schema;
var User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        set: function (email) {
            return email.toLowerCase()
        }
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        set: function (password) {
            return passwordEncoder(password, this.salt)
        },
        required: true
    },
    salt: {
        type: String,
        required: true,
        default: function(){
            return idGenerator();
        }
    },
    token: {
        type: String,
        required: true,
        default: function(){
            return idGenerator();
        }
    }
});


User.methods.verifyPassword = function (plainPassword) {
    return this.password === passwordEncoder(plainPassword, this.salt);
};

module.exports = mongoose.model('User', User);

