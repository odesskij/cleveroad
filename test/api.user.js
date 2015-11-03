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

    describe('/register', function () {
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

        it('should /register without error', function (done) {
            request
                .post('/register')
                .send(valid)
                .expect('Content-Type', /json/)
                .expect(HTTPStatus.OK)
                .end(done);
        });

        _.each([ 'email', 'password', 'phone', 'name' ], function (property) {
            it('should /register return error with invalid ' + property, function (done) {
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


    it('/api/login', function (done) {
        done();
    });
});