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

    var verb = {
        'a': playerKey,
        'b': 'register test pass',
        'r': 'lobby'
    }

    console.log(verb);

    socket.emit('server_response', verb, function(data) {
        console.log(data);
    });
});
