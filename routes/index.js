var express = require('express');
var router = express.Router();
var socket = require("socket.io");
const server = require('../bin/www');


/* GET home page. */
router.get('/', function(req, res, next) {
  //process.stderr.write('wow!');
  res.render('u_drawing', { title: 'Express' });
});


router.get('/me', function(req, res, next) {
  res.render('me', { title: 'this is my page' });
});

router.get('/json', function(req, res, next) {
  console.log("json");
  res.json({
    0:info[0],
    1:info[1],
    2:info[2],
    3:info[3],
    4:info[4],
    5:info[5],
    6:info[6],
    7:info[7],
    8:info[8],
    9:info[9]      
  });
});

module.exports = router;
