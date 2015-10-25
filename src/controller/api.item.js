var express = require('express')
    , router = express.Router()
    , _ = require('lodash')
    , authenticate = require('../authenticate')
    , errorResponse = require('../error_response')
    , validator = require('../validator')
    , Item = require('../mongoose').ItemModel
    , upload = require('../upload_storage').single('file');


var serialize = function (item) {
    return _.extend(_.pick(item, [
        'id',
        'created_at',
        'title',
        'price',
        'image',
        'user_id' ]), {
        'user': _.pick(item.user, [
            'id',
            'phone',
            'name',
            'email'
        ])
    });
};

/*
 * http GET 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" title==lorem
 * http GET 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" order_by==price
 * http GET 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" order_type==asc order_by==price
 * http GET 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" order_type==asc order_by==price title==^magni
 */
router.get('/item', authenticate(function (req, res) {
        validator('item.search', _.pick(req.query, [ 'title', 'user_id', 'order_by', 'order_type' ]), function (err, value) {
            if(err) return errorResponse(req, res, err);
            var query = {};
            var sort = {};
            _.each(_.pick(value, [ 'title' ]), function (value, property) {
                query[ property ] = new RegExp(value, 'i')
            });

            sort[ value.order_by ] = value.order_type === 'desc' ? -1 : 1;

            Item.find(query).sort(sort).populate('user').exec(function (err, items) {
                res.json(_.map(items, function (item) {
                    return serialize(item);
                }));
            });
        });
    })
);

/*
 * http GET 127.0.0.1:3000/api/item/562cf36f7692dafd35ea9e87 "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c"
 */
router.get('/item/:id', authenticate(function (req, res) {
        Item.findOne({_id: req.params.id}).populate('user').exec(function (err, item) {
            if(err || !item) return res.status(404).send();
            res.json(serialize(item));
        });
    })
);

/*
 * http PUT 127.0.0.1:3000/api/item/562cf36f7692dafd35ea9e87 "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" price=100 title="hello, node!"
 */
router.put('/item/:id', authenticate(function (req, res) {
        validator('item.update', _.pick(req.body, [ 'title', 'price' ]), function (err, value) {
            if(err) return errorResponse(req, res, err);
            Item.findOne({_id: req.params.id}).populate('user').exec(function (err, item) {
                if(err || !item || (item && item.user_id !== req.user.id)) return res.status(403).send();
                _.extend(item, value);
                item.save(function (err, item) {
                    res.json(serialize(item));
                });
            });
        });
    })
);

/*
 * http DELETE 127.0.0.1:3000/api/item/562cf36f7692dafd35ea9e87 "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c"
 */
router.delete('/item/:id', authenticate(function (req, res) {
        Item.findOne({_id: req.params.id}, function (err, item) {
            if(err || (item && item.user_id !== req.user.id)) return res.status(403).send();
            if(!item) return res.status(404).send();
            item.remove(function (err) {
                return res.status(200).send();
            });
        });
    })
);

/*
 * http POST 127.0.0.1:3000/api/item "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c"
 */
router.post('/item', authenticate(function (req, res) {
        validator('item.create', _.pick(req.body, [ 'title', 'price' ]), function (err, value) {
            if(err) return errorResponse(req, res, err);

            _.extend(value, {
                user: req.user
            });

            var item = new Item(value);
            item.save(function (err, item) {
                if(err) return res.status(403).send();

                res.json(serialize(item));
            });
        });
    })
);

/*
 * http -f POST 127.0.0.1:3000/api/item/562cf36f7692dafd35ea9e87/image "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" file@~/me.jpg
 */
router.post('/item/:id/image', authenticate(function (req, res) {
        Item.findOne({_id: req.params.id}).populate('user').exec(function (err, item) {
            if(err || !item) return res.status(404).send();
            if(req.user.id !== item.user.id) return res.status(403).send();

            upload(req, res, function (err) {
                if(err) return res.status(403).send();
                _.extend(item, {
                    file: req.file.filename
                });
                item.save(function(err, item){
                    if(err) return res.status(403).send();
                    res.json(serialize(item));
                });
            });
        });
    })
);

module.exports = router;
