'use strict';

var should = require('should')
    , _ = require('lodash')
    , supertest = require('supertest')
    , HTTPStatus = require('http-status')
    , mongoose = require('../src/mongoose')
    , User = mongoose.UserModel;


before(function (done) {
    User.remove({}).then(function () {
        done();
    });
});
describe('API User', function () {
    var request = supertest('http://localhost:30001/api');
    this.timeout(1000);

    describe('/api/register', function () {
        var valid = {
            email: 'odesskij1992@gmail.com',
            password: 'password',
            phone: '+380661514285',
            name: 'Vladimir Odesskij'
        };

        var invalid = _.extend({}, valid, {
            email: 'not_email',
            password: '',
            phone: 'not_phone',
            name: ''
        });

        it('should save without error', function (done) {
            request
                .post('/register')
                .send(valid)
                .expect('Content-Type', /json/)
                .expect(HTTPStatus.OK)
                .end(done);
        });

        _.each([ 'email', 'password', 'phone', 'name' ], function (property) {
            it('should return error with invalid ' + property, function (done) {
                var data = _.extend({}, valid, _.pick(invalid, [ property ]));
                request
                    .post('/register')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.UNPROCESSABLE_ENTITY)
                    .expect(function (res) {
                        res.body.should.match([ {field: property} ])
                    })
                    .end(done);
            });
        });
    });


    describe('/api/login', function () {
        var user = {
            email: 'foo@bar.com',
            password: 'foobar',
            name: 'Foo Bar',
            token: '268a4392c8ea194b6654960a5290e6bba332e91c'
        };

        var invalid = {
            email: 'bar@foo.com',
            password: 'trust_me'
        };

        before(function (done) {
            var u = new User(user);
            u.save(done);
        });

        it('should be success', function (done) {
            var req = _.pick(user, [ 'email', 'password' ]);
            request
                .post('/login')
                .send(req)
                .expect('Content-Type', /json/)
                .expect(HTTPStatus.OK)
                .expect(function (res) {
                    res.body.should.match({
                        token: user.token
                    })
                })
                .end(done);
        });

        _.each([ 'email', 'password' ], function (property) {
            it('should be fail with invalid ' + property, function (done) {
                var req = _.extend({},
                    _.pick(user, [ 'email', 'password' ]),
                    _.pick(invalid, [ property ])
                );

                request
                    .post('/login')
                    .send(req)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.UNPROCESSABLE_ENTITY)
                    .expect(function (res) {
                        res.body.should.match([ {
                            field: 'password',
                            message: function (msg) {
                                msg.should.be.String()
                            }
                        } ]);
                    })
                    .end(done);
            });
        })
    });
});