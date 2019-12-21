var express = require('express');
var router = express.Router();
var socket = require("socket.io");
const server = require('../bin/www');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('control', { title: 'Express' });
});


router.get('/me', function(req, res, next) {
  res.render('me', { title: 'this is my page' });
});

module.exports = router;
