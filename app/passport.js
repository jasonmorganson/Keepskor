var Player = require('./models/player');
var LocalStrategy = require('passport-local').Strategy;

exports.attach = function() {

    var app = this;

    app.passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    app.passport.deserializeUser(function(username, done) {
        Player.findByUsername( username, function(error, user) {
            done(error, user);
        });
    });

    app.passport.use(new LocalStrategy( function(username, password, done) {

        Player.findByUsername( username, function(error, user) {

            if (error) {
                return done(error);
            }
            if (!user) {
                return done(null, false, { message: 'Unknown user ' + username });
            }
            if (user.password != password) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        })
    }));
};
