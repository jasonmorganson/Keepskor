var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

exports.attach = function() {

    var app = this;

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        app.resources.Player.findByUsername( username, function(error, user) {
            done(error, user);
        });
    });

    passport.use(new LocalStrategy( function(username, password, done) {

        app.resources.Player.findByUsername( username, function(error, user) {

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
