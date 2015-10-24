'use strict';

module.exports = function(req, res, err){
    res.status(422);
    res.json(err);
};