/*
 * Controla el chat con el socket.io de NodeJS
 * @required jQuery
 * @required NodeJS con socket.io
 * @required jquery.nicescroll.js
 */
$( document ).ready( function(){
	// configuración del niceScroll para la lista de usuarios conectados
	$(".list-friends").niceScroll({
      cursorcolor: "#696c75",
      cursorwidth: "4px",
      cursorborder: "none"
    });
    // configuración del niceScroll para el área de chats
    $(".messages").niceScroll({
      cursorcolor: "#cdd2d6",
      cursorwidth: "4px",
      cursorborder: "none"
    });
    /*
     * Actualiza el tamaño del scroll y posiciona al usuario para que siempre 
     * esté visible el último mensaje enviado o recibido
     */
    var claerResizeScroll = function(){
    	$( "#m" ).val( "" );
    	$( ".messages" ).getNiceScroll( 0 ).resize();
    	return $( ".messages" ).getNiceScroll( 0 ).doScrollTop( 999999, 999 );
    };
    /*
     * Configuración y programación de los sockets de NodeJS y socket.io
     * Trabaja el envío y recepción de mensajes para los usuarios conectados
     */
    var socket = io();
    // Al conectarse al servidor, preguntamos por el nickname
    socket.on( 'connect', function(){
    	// Llamamos al servidor con la función 'adduser' y enviamos el parámetro
    	socket.emit( 'adduser', prompt( 'Ingrese un Nickname:' ) );
    } );
    // Escuchar cuando el servidor emite 'updatechat' para actualizar el cuerpo del chat
    socket.on( 'updatechat', function( username, data ){
    	$('#messages').append( '<li class="i">'+
			'<div class="head">'+
			'<span class="time">10:13 AM, Today</span>'+
			'<span class="name">'+username+'</span>'+
			'</div>'+
			'<div class="message">' + data + '</div>'+
		'</li>' );
		claerResizeScroll();
    } );
    // Escucha cuando el servidor emite un 'updateusers', esto actualiza la lista de usuarios
    socket.on( 'updateusers', function( data ){
    	//$( "#users" ).emit();
    	$.each( data, function( key, value ){
    		$( "#users" ).append( '<li>'+
				'<img src="https://lh3.googleusercontent.com/-OLaAp4ZKpbI/UfmuRpD2ORI/AAAAAAAAAL4/wqlxbk6nAgkpaAlgIATKHmf9G5UlAFGFQCEw/w140-h140-p/903890_604275102933777_594620786_o.jpg" width="50" height="50">'+
				'<div class="info">'+
				'<div class="user">'+key+'</div>'+
				'<div class="status on"> online</div>'+
				'</div>'+
			'</li>' );
    	} );
    } );
    // Cuando el cliente envía un mensaje
    $( "#miForm" ).submit( function(){
    	//var message = $( "#m" ).val();
    	// Llama al servidor para ejecutar 'sendchat' y enviar solo el parámetro
    	socket.emit( 'sendchat', $( "#m" ).val() );
    	$( "#m" ).val( '' );
    	claerResizeScroll();
    	return false;
    } );
    /*
    var socket = io();
    $( "#miForm" ).submit( function(){
    	socket.emit( 'chat message', $( '#m' ).val() );
    	$( '#m' ).val( '' );
		claerResizeScroll();
		return false;
    } );
    socket.on('chat message', function(msg){
		$('#messages').append( '<li class="i">'+
			'<div class="head">'+
			'<span class="time">10:13 AM, Today</span>'+
			'<span class="name">Román</span>'+
			'</div>'+
			'<div class="message">' + msg + '</div>'+
		'</li>' );
		claerResizeScroll();
    });
    */
} );