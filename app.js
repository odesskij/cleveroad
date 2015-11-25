'use strict';

var express = require('express')
    , path = require('path')
    , logger = require('morgan')
    , log4js = require('log4js')
    , cookieParser = require('cookie-parser')
    , HTTPStatus = require('http-status')
    , bodyParser = require('body-parser')
    , passport = require('./src/passport')
    , index = require('./src/controller/index')
    , apiUser = require('./src/controller/api.user')
    , apiItem = require('./src/controller/api.item');

log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'file', filename: 'app/logs/cheese.log', category: 'cheese', "backups": 3}
    ]
});


var log = log4js.getLogger('cheese');

log.setLevel(log4js.levels.TRACE);

log.trace('Entering cheese testing');
log.debug('Got cheese.');
log.info('Cheese is Gouda.');
log.warn('Cheese is quite smelly.');
log.error('Cheese is too ripe!');
log.fatal('Cheese was breeding ground for listeria.');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if(process.env.NODE_ENV === 'dev') {

    app.use(log4js.connectLogger(log, {level: log4js.levels.ALL}));
}


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
