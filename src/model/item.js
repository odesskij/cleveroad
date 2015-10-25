'use strict';

var mongoose = require('mongoose')
    , idGenerator = require('../id_generator')
    , passwordEncoder = require('../password_encoder')
    , Schema = mongoose.Schema;

var Item = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: function(){
            return new Date();
        }
    }
});
module.exports = mongoose.model('Item', Item);

