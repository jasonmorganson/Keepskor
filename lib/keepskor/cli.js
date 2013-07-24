var prompt = require('prompt'),
    optimist = require('optimist'),
    Keepskor = require('./keepskor');

var io = require('socket.io-client');
var socket = io.connect('http://pong.keepskor.com:9090');

var display = {
    raw: false,
    msg: true,
    json: false
};

var verb = {
    r: 'lobby'
};

// Prompt customizations.
prompt.message = "keepskor".yellow;
prompt.delimiter = '>'.red;

// Overide with command line options.
prompt.overide = optimist.argv;

console.log("");
console.log("Keepskor CLI".yellow);
console.log("============".red);
console.log("");
console.log("This tool provides a command line interface with the");
console.log("Keepskor".yellow + " server. It sends raw commands directly to");
console.log("the server over a " + "socket.io".blue + " channel.");
console.log("");
console.log("USAGE".inverse);
console.log("       Enter a verb and then follow the server instructions.");
console.log("");
console.log("NOTE:".underline);
console.log("       Verbs should start with " + "!".green + ", but it will");
console.log("       be added automatically if omitted.");
console.log("");
console.log("COMMANDS".inverse);
console.log("");
console.log("       " + "exit".magenta + " or " + "quit".magenta + " will leave the prompt");
console.log("       " + "key".magenta + " prints the player key");
console.log("       " + "raw".magenta + " toggles raw output display from the server");
console.log("       " + "msg".magenta + " toggles formatted message display");
console.log("       " + "json".magenta + " toggles json parsed output display");
console.log("       " + "[*]".magenta + " anything else will be sent to the server");
console.log("");
console.log("");
console.log("");


socket.on('connecting', function() {
    console.log("Connecting...");
});

socket.on('connect', function() {

    console.log("Connected");

    socket.on('server_response', function(data) {

        var output = '';
        if (display.raw)
            console.log(data);
        if (display.msg)
            output += data.response.msg;
        if (display.json)
            output += JSON.stringify(data);

        console.log(output);
        loop();
    });

    Keepskor.getPlayerKey(function(err, key) {
        if (err) throw err;
        verb.a = key;
        prompt.start();
        loop();
    });
});



var input = "server";
function loop() {

    prompt.get(input, function(err, result) {

        // Save the full command.
        var command = result[input];

        // Prepend "!" to command if not present.
        command = command.charAt(0) == '!' ? command : '!' + command;

        // Get the first word (which
        // is assumed to be the verb).
        input = result[input].split(' ')[0];

        switch(input) {

        case 'exit':
        case 'quit':
            process.exit(0);
            break;
        case 'raw':
        case 'msg':
        case 'json':
            display[input] = !display[input];
            console.log("Toggled " + input + " display " + (display[input] ? "on" : "off"));
            loop();
            break;
        case 'key':
            console.log("Player key: " + verb.a);
            loop();
            break;
        default:
            verb.b = command;
            socket.emit('send', verb);
            break;
        }
    });
}
