var express = require('express')
    , _ = require('lodash')
    , authenticate = require('../authenticate')
    , errorResponse = require('../error_response')
    , validator = require('../validator')
    , User = require('../mongoose').UserModel
    , router = express.Router();

/*
 * http POST 127.0.0.1:3000/api/login email=odesskij1992@gmail.com password=password
 */
router.post('/login',
    function (req, res) {
        validator('login', req.body, function (err, value) {
            User.findOne(_.pick(value, [ 'email' ]), function (er, user) {
                if(err || er || !user || !(user && user.verifyPassword(value.password))) return errorResponse(req, res, [
                    {
                        "field": "password",
                        "message": "Wrong email or password"
                    }
                ]);
                res.json(_.pick(user, [ 'token' ]));
            });
        });
    }
);
/*
 * http POST 127.0.0.1:3000/api/register email=odesskij1992@gmail.com password=password phone=+380661514285 name=Vladimir
 */
router.post('/register',
    function (req, res) {
        validator('user.create', req.body, function (err, value) {
            if(err) return errorResponse(req, res, err);
            var u = new User(_.pick(value, [ 'email', 'password', 'phone', 'name' ]));
            u.save(function (err, user) {
                //TODO:
                if(err) return errorResponse(req, res, err);
                res.json(_.pick(user, [ 'token' ]))
            });
        });
    }
);

/*
 * http GET 127.0.0.1:3000/api/me "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c"
 */
router.get('/me', authenticate(function (req, res) {
        res.json(_.pick(req.user, [ 'id', 'phone', 'name', 'email' ]));
    })
);

/*
 * http PUT 127.0.0.1:3000/api/me "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" phone=+380951514285 name=Odesskij
 * http PUT 127.0.0.1:3000/api/me "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" current_password=password new_password=password1
 */
router.put('/me', authenticate(function (req, res) {
        validator('user.update', _.pick(req.body, [ 'phone', 'name', 'email', 'current_password', 'new_password' ]), function (err, value) {
            if(err) return errorResponse(req, res, err);
            if(value.current_password && value.new_password) {
                if(!req.user.verifyPassword(value.current_password)) {
                    return errorResponse(req, res, [ {
                        "field": 'current_password',
                        "message": 'Wrong current password'
                    } ]);
                }
                value.password = value.new_password;
            }
            User.findOne({_id: req.user._id}, function (err, user) {
                _.extend(user, _.pick(value, [ 'phone', 'name', 'email', 'password' ]));
                user.save(function(err, user){
                    res.json(_.pick(user, [ 'id', 'phone', 'name', 'email' ]));
                });
            });
        });
    })
);

/*
 * http GET 127.0.0.1:3000/api/user/562cb3ebbe29115723a0c21a "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c"
 */
router.get('/user/:id', authenticate(function (req, res) {
        User.findOne({_id: req.params.id}, function (err, user) {

            if(err || !user) {
                res.status(404).send();
                return;
            }

            res.json(_.pick(user, [ 'id', 'phone', 'name', 'email' ]));
        });
    })
);

/*
 * http GET 127.0.0.1:3000/api/user "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" name==Odesskij
 * http GET 127.0.0.1:3000/api/user "Authorization: Token 268a4392c8ea194b6654960a5290e6bba332e91c" email==gmail
 */
router.get('/user', authenticate(function (req, res) {
        var query = {};
        _.each(_.pick(req.query, ['name', 'email']), function(value, property){
            query[property] = new RegExp(value, 'i')
        });
        User.find(query, function(err, users){
            res.json(_.map(users, function(user){
                return _.pick(user, [ 'id', 'phone', 'name', 'email' ]);
            }));
        });
    })
);

module.exports = router;
