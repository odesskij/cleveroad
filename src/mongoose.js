'use strict';

var mongoose = require('mongoose')
    , _ = require('lodash')
    , path = require('path')
    , glob = require('glob')
    , config = require('./config')
    , log = require('./log')('mongodb');

mongoose.connect('mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database);
var db = mongoose.connection;

db.on('error', function (err) {
    log('Error --', err);
});

db.once('open', function () {
    log('Connected.');
});

_.each(glob.sync(__dirname + '/model/*.js'), function (file) {
    var name = path.parse(file).name
        , exp = _.capitalize(name) + 'Model';
    module.exports[ exp ] = require(file);

    log(exp, 'exported.')
});

_.extend(module.exports, {
    connection: mongoose.connection
});