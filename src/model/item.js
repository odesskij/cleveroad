'use strict';

var mongoose = require('mongoose')
    , idGenerator = require('../id_generator')
    , passwordEncoder = require('../password_encoder')
    , Schema = mongoose.Schema
    , User = require('./user');

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
    createdAt: {
        type: Date,
        required: true,
        default: function(){
            return new Date();
        }
    },
    user: User.schema
});

Item.virtual('created_at').get(function(){
    return Math.round(this.createdAt.getTime() / 1000);
});

Item.virtual('user_id').get(function(){
    return this.user.id;
});

module.exports = mongoose.model('Item', Item);

