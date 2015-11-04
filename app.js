var express = require('express')
    , path = require('path')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , HTTPStatus = require('http-status')
    , bodyParser = require('body-parser')
    , passport = require('./src/passport')
    , index = require('./src/controller/index')
    , apiUser = require('./src/controller/api.user')
    , apiItem = require('./src/controller/api.item');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use('/', index);
app.use('/api', apiUser);
app.use('/api', apiItem);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = HTTPStatus.NOT_FOUND;
    next(err);
});

if(app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
