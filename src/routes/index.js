var express = require('express')
    , passport = require('passport')
    , router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login',
    passport.authenticate('http-header-token', {session: false}),
    function (req, res) {
        res.json({
            email: req.user.email
        });
    }
);

module.exports = router;
