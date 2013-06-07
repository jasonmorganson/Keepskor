var errs = require('errs'),
    hash = require('node_hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

require('../lib/common');

exports.attach = function() {

    var app = this;

    app.passport = passport;
    app.authStrategy = passport;

    app.http.before.push(passport.initialize());

    app.http.before.push(passport.session());

    app.passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    app.passport.deserializeUser(function(username, done) {
        app.resources.User.find({ username: username }, function(err, user) {
            done(err, user[0]);
        });
    });

    app.passport.use(new LocalStrategy(

        function(username, password, done) {

            username = username.toLowerCase();

            app.log.debug("Authenticate locally with " + username + " and " + password);

            app.resources.User.get(username, function(err, user){

                if (!user || err && err.error === 'not_found') {
                    err = errs.merge(err || {}, "Unknown user " + username);
                    app.log.debug(err);
                    return done(null, false, err);
                }

                if (err) {
                    err = errs.merge(err, "There was an error finding user");
                    app.log.error(err);
                    return done(err);
                }

                // Perform one-way hash on incoming password with stored
                // salt to determine if login is correct.
                var checksum = hash.md5(password, user['password-salt']);

                if (user.password !== checksum) {
                    err = errs.create("Invalid password for " + username);
                    app.log.warn(err);
                    return done(null, false, err);
                }

                app.log.debug("Authenticated locally");
                return done(null, user);
            });
        }
    ));
};
