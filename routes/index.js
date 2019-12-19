var express = require('express');
var router = express.Router();
var socket = require("socket.io");
const server = require('../bin/www');

//var io = socket(server);
var io = require('socket.io').listen(server);


io.on("connection",function(socket){
  console.log("made socket connection",socket.id);

  socket.on("chat",function(data){
      io.sockets.emit("chat",data);
      console.log(data);
  });

  socket.on("typing",function(data){
      socket.broadcast.emit("typing",data)
  })
}); 




/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('control', { title: 'Express' });
});


router.get('/me', function(req, res, next) {

  res.render('me', { title: 'this is my page' });
});



module.exports = router;
