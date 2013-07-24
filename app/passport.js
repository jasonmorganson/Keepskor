var errs = require('errs'),
    hash = require('node_hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    KeepskorExplicitStrategy = require('./strategies/keepskor-explicit.js').Strategy;
    KeepskorImplicitStrategy = require('./strategies/keepskor-implicit.js').Strategy;
    TwitterStrategy = require('passport-twitter').Strategy;

require('../lib/common');

exports.attach = function() {

    var app = this;

    app.passport = passport;
    app.authStrategy = passport;

    app.http.before.push(passport.initialize({
        /* userProperty: 'player' */
    }));

    app.http.before.push(passport.session());

    app.http.before.push(function(req, res) {

        req.isAuthenticatedWithTwitter = function() {
            if (req && req._passport && req._passport.session) {
                return req._passport.session.twitter ? true : false;
            }
        };

        req.isAuthenticatedWithFacebook = function(req, res) {
            if (req && req._passport && req._passport.session) {
                return req._passport.session.facebook ? true : false;
            }
        };

        res.emit('next');
    });

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

    // FIXME: Pull in callback URL dynamically
    // tried using app.server.addresss, but its not initialized here yet
    app.passport.use(new TwitterStrategy({
        consumerKey: app.config.get('twitter:consumerKey'),
        consumerSecret: app.config.get('twitter:consumerSecret'),
        callbackURL: app.config.get('twitter:callbackURL'),
        passReqToCallback: true
    }, function(req, token, tokenSecret, profile, done) {

        if (req.isAuthenticated()) {

            var options = {};
            var username = req.user.username;
            options.token = {
                id: profile.id,
                provider: profile.provider,
                token: token
            };

            app.resources.User.addThirdPartyToken(username, options, function(err, token) {

                if (err) {
                    err = errs.merge(err, "There was an error adding Twitter token to user");
                    app.log.error(err);
                    return done(err, req.user);
                }
            });

            // Persist the twitter authentication in the session.
            req._passport.session.twitter = profile;

            return done(OK, req.user);

        } else if (req.isUnauthenticated()) {
            console.log("user has not logged in");
        }

        // TODO: Create new user if one is not present
    }));

    passport.use(new KeepskorExplicitStrategy());

    passport.use(new KeepskorImplicitStrategy());

};
