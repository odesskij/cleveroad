var express = require('express')
    , _ = require('lodash')
    , authenticate = require('../authenticate')
    , errorResponse = require('../error_response')
    , validator = require('../validator')
    , Item = require('../mongoose').ItemModel
    , router = express.Router();


/*
 * http GET 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" name==Odesskij
 * http GET 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" email==gmail
 */
router.get('/item', authenticate(function (req, res) {
        var query = {};
        //_.each(_.pick(req.query, ['name', 'email']), function(value, property){
        //    query[property] = new RegExp(value, 'i')
        //});
        Item.find(query, function(err, items){
            res.json(_.map(items, function(item){
                return _.pick(item, [ 'id', 'phone', 'name', 'email' ]);
            }));
        });
    })
);


module.exports = router;
