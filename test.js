var request = require('request');
var io = require('socket.io-client');
var socket = io.connect('http://pong.keepskor.com:9090');

var token = '';
var playerKey = '';

var url = "http://pong.keepskor.com/api/player";

var headers = {};
    headers["Cookie"] = "ks_a";
    headers["Origin"] = "";
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

var jar = request.jar();

var cookie = request.cookie("test=t");

jar.add(cookie);

var options = {
    url: url,
    jar: jar,
    headers: headers
}


request.post(options, function(error, response, body) {
    if(!error && response.statusCode == 200) {
//        console.log(response);
console.log("_disableCookies:" + response._disableCookies);
        console.log(response.cookieJar);
//          console.log(response.jar.get({ url: url }));
//        console.log(response.headers);
        console.log(response.headers['set-cookie']);
        token = response.headers['x-request-id'];
        playerKey = body;
        console.log("Token: " + token);
        console.log("Player Key: " + playerKey);
        request.get('http://pong.keepskor.com/api/player', function(error, response, body) {
//            console.log(response.headers);
        });
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
        'b': 'login',
        'r': 'lobby',
        's': token
    }

    console.log(JSON.stringify(verb));
    console.log(verb);

    socket.emit('send', verb, function(data) {
        console.log(data);
    });

    socket.emit('my other event', { my: verb });
});
