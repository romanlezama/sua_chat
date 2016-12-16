var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use( '/Adminica2', express.static( '/var/www/html/Adminica2' ) );
app.use( '/static', express.static( __dirname+'/static' ) );
app.get('/', function(req, res){
	res.sendFile( __dirname + '/index.html' );
});

var usernames = {}; // Nombres de usuarios que están actualmente conectados al chat
io.on('connection', function(socket){
	//Cuando el cliente emite 'sendchat', éste es escuchado y ejecutado
	socket.on( 'sendchat', function( data ){
		// Llamamos al cliente para ejecutar 'updatechat' con dos parámetros
		io.sockets.emit( 'updatechat', socket.username, data );
	} );
	// Cuando el cliente agrega un usuario, éste es escuchado y ejecutado
	socket.on( 'adduser', function( username ){
		// Almacenamos el nombre de usuario en la sesión del socket para este cliente
		socket.username = username;
		// Agrega los nombres de usuarios de los clientes a la lista global
		usernames[ username ] = username;
		// Le avisa al cliente que se acaba de conectar
		socket.emit( 'updatechat', 'SERVER', 'Ahora estás conectado' );
		// Mostramos a todos los clientes que una persona se conectó
		socket.broadcast.emit( 'updatechat', 'SERVER', username + ' se ha conectado' );
		// Actualiza la lista de usuarios en el chat
		io.sockets.emit( 'updateusers', usernames );
	} );
	// Cuando un usuario se desconecta, realizar lo siguiente
	socket.on( 'disconnect', function(){
		// Elimina el nombre de usuarios de la lista global de usuarios
		delete usernames[ socket.username ];
		// Actualiza la lista de usuarios en el chat
		io.sockets.emit( 'updateusers', usernames );
		// Avisamos a los demás usuarios que una persona abandonó el chat
		socket.broadcast.emit( 'updatechat', 'SERVER', socket.username + ' se ha desconectado' );
	} );
  /*socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });*/
});

http.listen(8081, function(){
	console.log('listening on *:8081');
});