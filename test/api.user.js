var should = require('should')
    , request = require('supertest');

describe('API User', function () {
    var url = 'http://localhost:3020/api';

    it('/register', function (done) {
        request(url)
            .post('/register')
            .send({
                email: 'tomfun1990@gmail.com',
                password: 'password',
                phone: '+380661514285',
                name: 'Grisha'
            })
            .expect(200)
            .end(function (err, res) {
                if(err) {
                    done(err);
                    return;
                }
                done();
            });
    });


    it('/login', function (done) {
        done();
    });


});