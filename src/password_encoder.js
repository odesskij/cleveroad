'use strict';

var crypto = require('crypto');

module.exports = function (password, salt) {
    return crypto.createHash('sha512').update(password + salt).digest('hex').substr(0, 32)
};