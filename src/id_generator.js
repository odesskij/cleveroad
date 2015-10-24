'use strict';

var crypto = require('crypto');
function idGenerator(bytes) {
    return crypto.randomBytes(bytes || 20).toString('hex');
}
module.exports = idGenerator;