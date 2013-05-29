var request = require('request');
var io = require('socket.io-client');
var socket = io.connect('http://pong.keepskor.com:9090');

var playerKey = '';

request.post('http://pong.keepskor.com/api/player', function(error, response, body) {
    if(!error && response.statusCode == 200) {
        playerKey = body;
        console.log("Player Key:");
        console.log(playerKey)
    } else {
        console.log('error:' + response.statusCode);
        console.log(body);
    }
});





socket.on('connecting', function() {
    console.log("Connecting...");
});

socket.on('connect', function() {
    console.log("Connected");

    socket.on('server_response', function(data) {
        console.log(data);
    });

    socket.on('anything', function(data) {
        console.log(data);
    });

    socket.on('kschat', function(data) {
        console.log("kschat: " + data);
    });

    socket.on('room_chat', function(data) {
        console.log(data);
    });

    socket.on('player_events', function(data) {
        console.log(data);
    });

    socket.on('room_events', function(data) {
        console.log(data);
    });

    socket.on('send', function(data) {
        console.log(data);
    });

    socket.on('news', function(data) {
        console.log(data);
        socket.emit('my other event', {my: 'data'});
    });

    socket.on('event', function(data) {
        console.log(data);
    });

    var payload = '{"p":"'+playerKey+'","u": "test","m": "test"}';
    console.log(payload);
    payload = JSON.parse(payload);
    console.log(payload);
    socket.emit('room_chat', payload );

    socket.emit('message', {

    });

    socket.emit('room_events', {eventName:'move'}, function(data) {
        console.log(data);
    });

    socket.emit('send', {
        'a':playerKey,
        'b':'!smove newroom',
        'r': 'room'
    });

    var verb = {
        'a': playerKey,
        'b': 'register test pass',
        'r': 'lobby'
    }

    socket.emit('player_events', {
    }, function(data) {
        console.log(data);
    });
});
