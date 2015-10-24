'use strict';

var _ = require('lodash')
    , chalk = require('chalk');

module.exports = function (channel) {
    var prefix = chalk.black.bgYellow(channel + ': ');
    return function () {
        var args = _.toArray(arguments);
        args.unshift(prefix);
        console.log.apply(console, args)
    }
};