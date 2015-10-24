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
            User.findOne(_.pick(value, [ 'email', 'password' ]), function (er, user) {
                if(err || er || !user) return errorResponse(req, res, [
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
 * http GET 127.0.0.1:3000/api/me "Authorization: Token a13f34bcebb2ec010f4c31b577282745ecd5e64e"
 */
router.get('/me', authenticate(function (req, res) {
        res.json(_.pick(req.user, [ 'id', 'phone', 'name', 'email' ]));
    })
);

/*
 * http PUT 127.0.0.1:3000/api/me "Authorization: Token a13f34bcebb2ec010f4c31b577282745ecd5e64e"
 */
router.put('/me', authenticate(function (req, res) {
        validator('user.update', _.pick(req.body, [ 'phone', 'name', 'email', 'current_password', 'new_password' ]), function (err, value) {
            if(err) return errorResponse(req, res, err);

            if(value.current_password && value.new_password) {
                if(value.current_password !== req.user.password) {
                    return errorResponse(req, res, [ {
                        "field": 'current_password',
                        "message": 'Must be valid.'
                    } ]);
                }
                value.password = value.new_password;
            }
            User.update({_id: req.user._id}, _.pick(value, [ 'phone', 'name', 'email', 'password' ]), {upsert: true}, function (err, user) {
                res.json(_.pick(req.user, [ 'id', 'phone', 'name', 'email' ]));
            });
        });
    })
);

/*
 * http GET 127.0.0.1:3000/api/user/562bf63160c2bfb011ac191e "Authorization: Token a13f34bcebb2ec010f4c31b577282745ecd5e64e"
 */
router.get('/user/:id', authenticate(function (req, res) {
        User.findOne({_id: req.params.id}, function(err, user){

            if(err || !user){
                res.status(404).send();
                return ;
            }

            res.json(_.pick(user, [ 'id', 'phone', 'name', 'email' ]));
        });
    })
);

module.exports = router;
