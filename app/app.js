
var flatiron = require('flatiron'),
    io = require('socket.io-client'),
    app = flatiron.app;

module.exports = app;


app.socket = io.connect( 'http://pong.keepskor.com:9090' );

var Player = require('./resources/player');

var user = Player.new({
    "username": "test_user",
    "password": "secret",
    "email": "some@email.com"
});

user.save();

app.use(require('./config'));
app.use(require('./logger'));
app.use(require('./server'));
app.use(require('./routes'));
app.use(require('./passport'));

app.start( app.config.get("http:port"), function(error) {

    if(error) {
        app.log.error( error.message || "Could not start properly, exiting" );
        return process.exit(1);
    }

    var addr = app.server.address();
    app.log.info( "Listening on http://" + addr.address + ':' + addr.port );
});

app.socket.on( 'news', function(data) {
    app.log.info("News from Keepskor:");
    app.log.info(data);
});

app.socket.on( 'server_response', function(data) {
    app.log.info("Server response from Keepskor:");
    app.log.info(data);
});
