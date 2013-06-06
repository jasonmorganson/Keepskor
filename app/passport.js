var errs = require('errs'),
    hash = require('node_hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

require('../lib/common');

exports.attach = function() {

    var app = this;

    app.passport = passport;
    app.authStrategy = passport;

    app.http.before.push( function(req, res) {

        // Pass flatiron connections to passport
        passport.initialize()(req, res, function() {
            req.isAuthenticated = res.req.isAuthenticated;
            req.isUnauthenticated = res.req.isUnauthenticated;
            req.login = req.logIn = res.req.login;
            req.logout = req.logOut = res.req.logout;
            res.emit('next');
        });
    });

    app.http.before.push( function(req, res) {

        // Pass flatiron connections to passport
        passport.session()(req, res, function() {
            res.emit('next');
        });
    });

    app.passport.serializeUser(function(user, done) {
        app.log.debug("Serialize", user);
        done(null, user.username);
    });

    app.passport.deserializeUser(function(username, done) {
        app.log.debug("Deserialize", username);
        app.resources.User.find({ username: username }, function(err, user) {
            done(err, user);
        });
    });

    app.passport.use(new LocalStrategy(

        function(username, password, done) {

            username = username.toLowerCase();

            app.log.debug("Authenticate locally with " + username + " and " + password);

            // FIXME: User.get() is what we want here, but it wasn't working.
            //app.resources.User.get(username, function(err, user){
            app.resources.User.find({ username: username }, function(err, user){

                // User.find() returns an array, so take first one.
                user = user ? user[0] : null;

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

                app.log.debug("Authenticated");
                return done(null, user);
            });
        }
    ));
};
