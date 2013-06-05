var errs = require('errs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

exports.attach = function() {

    var app = this;

    app.passport = passport;
    app.authStrategy = passport;

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

            app.log.debug("Authenticate locally with " + username + " and " + password);

            app.resources.User.find({ username: username }, function(err, user){

                if (err) {
                    app.log.error(errs.merge(err, "There was an error finding user"));
                    return done(err);
                }

                console.log(user);
                if (!user) {
                    app.log.debug("Unknown user: " + username);
                    return done(null, false, { message: "Unknown user " + username });
                }

                if (user.password != password) {
                    app.log.warn("Invalid password for " + username);
                    return done(null, false, { message: "Invalid password" });
                }

                app.log.debug("Authenticated");
                return done(null, user);
            });
        }
    ));
};
