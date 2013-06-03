var util = require('util'),
    httpUsers = require('flatiron-http-users'),
    io = require('socket.io-client'),
    socket = io.connect( 'http://pong.keepskor:9090' );

exports.resource = function(app) {

    var Player =
    app.resources.Player =
    app.define('Player', function() {

        var self = this;

        var User = app.resources.User;
        this.parent('User');

        this.string( 'phone' );

        this.string( 'playerKey', {
            description: "Unique key identifying the player",
            message: "",
            default: "51a5319005652a676900027a"
        });

        this.string( 'twitterKey', {
            description: "Twitter authorization key",
            message: "Combined authToken and authKey, separated by a colon. Provided by Twitter."
        });

        this.string( 'facebookKey', {
            description: "Facebook authorization key",
            message: "Authorization key generated from OAuth handshake with Facebook"
        });


        this.method( 'findByUsername', function( username, done ) {

            this.find( { "username": username }, function(error, user) {

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
    });
};
