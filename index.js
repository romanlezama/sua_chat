var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use( '/Adminica2', express.static( '/var/www/html/Adminica2' ) );
app.use( '/static', express.static( __dirname+'/static' ) );
app.get('/', function(req, res){
	res.sendFile( __dirname + '/index.html' );
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(8080, function(){
	console.log('listening on *:8080');
});