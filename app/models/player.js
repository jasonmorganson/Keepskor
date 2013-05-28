var resourceful = require('resourceful');
resourceful.use('memory');

var Player = resourceful.define( 'player' );

Player.string( 'email', {
    format: 'email'
});

Player.string( 'phone' );

Player.string( 'username', {
    required: true
});

Player.string( 'password', {
    format: 'password'
});

Player.string( 'token', {
    description: "",
    message: "",
    default: ""
});

Player.string( 'key', {
    description: "",
    message: "",
    default: ""
});

Player.string( 'playerKey', {
    description: "Unique key identifying the player",
    message: "",
    default: ""
});

Player.string( 'twitterKey', {
    description: "Twitter authorization key",
    message: "Combined authToken and authKey, separated by a colon. Provided by Twitter."
});

Player.string( 'facebookKey', {
    description: "Facebook authorization key",
    message: "Authorization key generated from OAuth handshake with Facebook"
});




Player.method( 'usernameExists', function( username, done ) {

    app.socket.emit( 'server_response', {
        'a': this.key,
        'b': '!usernamecheck',
        'r': 'lobby',
        's': this.token
    })},

    { "properties": {

        "username": {
            "type": "string",
            "required": true
        }
    }}
);

Player.method( 'findByUsername', function( username, done ) {

    Player.find( { "username": username }, function(error, user) {

        if (error) {
            return done(error, null);
        }
        else if (user) {
            return done(null, user[0]);
        }
        else {
            return done(null, null);
        }
    })},

    { "properties": {

        "username": {
            "type": "string",
            "required": true
        }
    }}
);

module.exports = Player;

