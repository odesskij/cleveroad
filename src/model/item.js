'use strict';

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , User = require('./user')
    , domain = require('../config').domain;

var Item = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    file: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: function () {
            return new Date();
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

Item.virtual('created_at').get(function () {
    return Math.round(this.createdAt.getTime() / 1000);
});

Item.virtual('user_id').get(function () {
    return this.user && this.user.id ? this.user.id : undefined;
});

Item.virtual('image').get(function () {
    if(!this.file) {
        return;
    }
    return domain + '/images/' + this.file;
});

module.exports = mongoose.model('Item', Item);

