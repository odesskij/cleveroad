'use strict';

var path = require('path')
    , idGenerator = require('./id_generator')
    , fileUploads = require('./config')[ 'fileUploads' ]
    , multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, fileUploads)
    },
    filename: function (req, file, cb) {
        var ext = path.parse(file.originalname)[ 'ext' ];
        cb(null, idGenerator() + (ext ? ext : ''))
    }
});

module.exports = multer({storage: storage});