'use strict';

var _ = require('lodash');

_.extend(module.exports, {
    domain: 'http://127.0.0.1:3000',
    mongodb: {
        host: 'localhost',
        database: 'cleveroad'
    },
    fileUploads: __dirname + '/../public/images'
});