var resourceful = require('resourceful');
resourceful.use('memory');

var User = resourceful.define( 'user' );

User.string( 'email', {
    format: 'email'
});

User.string( 'username', {
    required: true
});

User.string( 'password', {
    format: 'password'
});

User.method( 'findByUsername', function( username, done ) {

    User.find( { "username": username }, function(error, user) {

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

module.exports = User;

