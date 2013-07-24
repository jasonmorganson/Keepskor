var errs = require('errs'),
    util = require('util'),
    hash = require('node_hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

    app.passport.PlayerStrategy = new LocalStrategy(

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
    });
};
