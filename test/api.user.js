'use strict';

var _ = require('lodash')
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
    var request = supertest(require('../app'));
    this.timeout(1000);
    this.slow(50);

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
                .post('/api/register')
                .send(valid)
                .expect('Content-Type', /json/)
                .expect(HTTPStatus.OK)
                .end(done);
        });

        _.each([ 'email', 'password', 'phone', 'name' ], function (property) {
            it('should return error with invalid ' + property, function (done) {
                var data = _.extend({}, valid, _.pick(invalid, [ property ]));
                request
                    .post('/api/register')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.UNPROCESSABLE_ENTITY)
                    .expect(function (res) {
                        res.body.should.match([ {field: property} ]);
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
                .post('/api/login')
                .send(req)
                .expect('Content-Type', /json/)
                .expect(HTTPStatus.OK)
                .expect(function (res) {
                    res.body.should.match({
                        token: user.token
                    });
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
                    .post('/api/login')
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
        });
    });

    describe('/api/me', function () {
        var user = {
            email: 'user@example.com',
            password: 'password',
            name: 'User aka user',
            token: '43c5fdfa6874652521ccd5f3df460b72bc18cfd3'
        };
        before(function (done) {
            var u = new User(user);
            u.save(done);
        });

        describe('GET /api/me', function () {
            it('should return user', function (done) {
                request
                    .get('/api/me')
                    .set('Authorization', 'Token ' + user.token)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.OK)
                    .expect(function (res) {
                        res.body.should.match({
                            id: function (it) {
                                it.should.be.a.String().and.not.be.empty()
                            },
                            name: user.name,
                            email: user.email
                        });
                    })
                    .end(done);
            });

            it('should fail with invalid Authorization Token', function (done) {
                request
                    .get('/api/me')
                    .set('Authorization', 'Token invalid_token')
                    .expect(HTTPStatus.UNAUTHORIZED)
                    .expect(function (res) {
                        res.body.should.be.empty();
                    })
                    .end(done);
            });

            it('should fail without Authorization Token', function (done) {
                request
                    .get('/api/me')
                    .expect(HTTPStatus.UNAUTHORIZED)
                    .expect(function (res) {
                        res.body.should.be.empty();
                    })
                    .end(done);
            });

            it('​unauthorized with invalid token', function (done) {
                request
                    .get('/api/me')
                    .set('Authorization', 'Token fake_token')
                    .expect(HTTPStatus.UNAUTHORIZED)
                    .expect(function (res) {
                        res.body.should.be.empty();
                    })
                    .end(done);
            });
        });

        describe('PUT /api/me', function () {
            var user = {
                email: 'user@example.com',
                password: 'password',
                phone: '+380661514000',
                name: 'User aka user',
                token: '43c5fdfa6874652521ccd5f3df460b72bc18cfd3'
            };

            var updatedUser = {
                email: 'foo@bar.com',
                phone: '+380951514000',
                name: 'Foo bar'
            };
            beforeEach(function (done) {
                User.remove().then(function () {
                    var u = new User(user);
                    return u.save();
                }).then(function () {
                    done();
                });
            });

            it('should be updated', function (done) {
                request
                    .put('/api/me')
                    .set('Authorization', 'Token ' + user.token)
                    .send(updatedUser)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.OK)
                    .expect(function (res) {
                        res.body.should.match({
                            id: function (it) {
                                it.should.be.a.String().and.not.be.empty()
                            },
                            phone: updatedUser.phone,
                            name: updatedUser.name
                        });
                    })
                    .end(done);
            });

            _.each([ 'phone', 'name', 'email' ], function (property) {
                it('property ' + property + ' should be optional', function (done) {
                    var req = _.omit(updatedUser, [ property ]);
                    request
                        .put('/api/me')
                        .set('Authorization', 'Token ' + user.token)
                        .send(req)
                        .expect('Content-Type', /json/)
                        .expect(HTTPStatus.OK)
                        .expect(function (res) {
                            res.body.should.match(_.extend({
                                    id: function (it) {
                                        it.should.be.a.String().and.not.be.empty()
                                    }
                                }, req
                            ));
                        })
                        .end(done);
                });
            });

            it('update password', function (done) {
                var req = _.extend({}, updatedUser, {
                    new_password: 'my_new_password',
                    current_password: user.password
                });
                request
                    .put('/api/me')
                    .set('Authorization', 'Token ' + user.token)
                    .send(req)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.OK)
                    .expect(function (res) {
                        res.body.should.match(_.extend({
                                id: function (it) {
                                    it.should.be.a.String().and.not.be.empty()
                                }
                            },
                            updatedUser
                        ));
                    })
                    .end(done);
            });

            it('current_password is required if new_password not empty', function (done) {
                var req = _.extend({}, updatedUser, {
                    new_password: 'my_new_password'
                });
                request
                    .put('/api/me')
                    .set('Authorization', 'Token ' + user.token)
                    .send(req)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.UNPROCESSABLE_ENTITY)
                    .expect(function (res) {
                        res.body.should.match([ {
                            field: function (it) {
                                it.should.be.a.String();
                            },
                            message: function (it) {
                                it.should.be.a.String();
                            }
                        } ]);
                    })
                    .end(done);
            });

            it('check current_password', function (done) {
                var req = _.extend({}, updatedUser, {
                    new_password: 'my_new_password',
                    current_password: 'fake password'
                });
                request
                    .put('/api/me')
                    .set('Authorization', 'Token ' + user.token)
                    .send(req)
                    .expect('Content-Type', /json/)
                    .expect(HTTPStatus.UNPROCESSABLE_ENTITY)
                    .expect(function (res) {
                        res.body.should.match([ {
                            field: 'current_password',
                            message: 'Wrong current password'
                        } ]);
                    })
                    .end(done);
            });

            it('​unauthorized without invalid token', function (done) {
                request
                    .put('/api/me')
                    .send(updatedUser)
                    .set('Authorization', 'Token fake_token')
                    .expect(HTTPStatus.UNAUTHORIZED)
                    .expect(function (res) {
                        res.body.should.be.empty();
                    })
                    .end(done);
            });
        });
    });
});