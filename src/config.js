'use strict';

var _ = require('lodash')
    , env = process.env.NODE_ENV || 'dev';

var config = {
    dev: {
        domain: 'http://127.0.0.1:3000',
        mongodb: {
            host: 'localhost',
            port: 27017,
            database: 'cleveroad_dev'
        },
        fileUploads: __dirname + '/../public/images'
    },
    test: {
        domain: 'http://127.0.0.1:3000',
        mongodb: {
            host: 'localhost',
            port: 27017,
            database: 'cleveroad_test'
        },
        fileUploads: __dirname + '/../public/images'
    }
}[ env ];

_.extend(module.exports, config, {
    env: env
});