var fs = require('fs'),
    errs = require('errs'),
    plates = require('plates'),
    director = require('director');

exports.attach = function() {

    var app = this;

    app.use(require('./server'));
    app.use(require('./passport'));

    app.http.router = app.router;

    app.unauthorized = new director.http.Router()
        .configure({
            async: true,
            strict: false
        });

    var allowUnauthorizedRoutes = function(req, res) {
        if (!app.unauthorized.dispatch(req, res)) {
            res.emit('next');
        }
    };

    app.http.before.push(allowUnauthorizedRoutes);

    var ensureAuthentication = function() {
debugger;
        var req = this.req,
            res = this.res;

        if (req.isAuthenticated()) {
            res.emit('next');

        } else if (req.isUnauthenticated()) {
            doAuthentication(req, res, function() {
                res.emit('next');
            });
        }
    };

    app.http.router.before(ensureAuthentication);

    var doAuthentication = function(req, res, callback) {

        app.passport.authenticate(
            ['keepskor-explicit',
             'keepskor-implicit',
             'local']
        )(req, res, function() {
            callback();
        });
    };

    app.http.router.notfound = function(callback) {

        var req = this.req,
            res = this.res,
            headers = req.headers || { 'Content-Type': 'text/html' };
            NotFound = new director.http.NotFound;

        NotFound.message += ': ' + req.url;
        res.writeHead(404, headers);
        res.end(NotFound);
        callback(NotFound, req, res);
    };

    var onError = app.http.onError = function(err, req, res) {

        var status = err.status || 500,
            headers = err.headers || { 'Content-Type': 'text/html' },
            body = err.message || err.body.error || "Error";

        if(err) {

            if (err.status >= 500) { app.log.error(body); }
            else if (err.status >= 400) { app.log.warn(body); }
            else { app.log.debug(body); }

            res.writeHead(status, headers);
            res.end(body);
        }
    };

    app.http.router.get( '/', function() {

        var req = this.req,
            res = this.res;

        var headers = req.headers || { 'Content-Type': 'text/html' };
        var username = req.user ? req.user.username : "Unknown";
        var body = fs.readFileSync( './app/templates/header.html', 'utf-8' );
        var loginForm = fs.readFileSync( './app/templates/login.html', 'utf-8' );
        var twitterForm = fs.readFileSync( './app/templates/twitter.html', 'utf-8' );
        var facebookForm = fs.readFileSync( './app/templates/facebook.html', 'utf-8' );
        var logoutForm = fs.readFileSync( './app/templates/logout.html', 'utf-8' );
        var footer = fs.readFileSync( './app/templates/footer.html', 'utf-8' );
        // TODO: These are loaded synchronously here so they refresh while
        // under development, but they should be cached in production.

        body = plates.bind(body, { user: username } );

        if (req.isAuthenticated()) {
            body += logoutForm;
        } else if (req.isUnauthenticated()) {
            body += loginForm;
        }

        if (!req.isAuthenticatedWithTwitter()) {
            body += twitterForm;
        }

        if (!req.isAuthenticatedWithFacebook()) {
            body += facebookForm;
        }

        body += footer;

        res.writeHead(200, headers);
        res.end(body);
    });

    app.http.router.post( '/login', function() {

        var req = this.req,
            res = this.res;

        if (req.isAuthenticated()) {
            res.redirect('/');
        }

        else if (req.isUnauthenticated()) {

            app.passport.authenticate(
                ['keepskor-explicit',
                 'keepskor-implicit',
                 'local']
            )(req, res, function() {
                res.redirect('/');
            });
        }
    });

    app.http.router.post( '/logout', function() {
    // FIXME: It looks like flatiron http-users and passport are
    // colliding on the user store in the session, which is preventing
    // the user object from being removed from the session and logging
    // out the user in passports terms.

        var req = this.req,
            res = this.res;

        req.logout();
        res.redirect('/');
    });

    app.http.router.post( '/register', function() {

        var req = this.req,
            res = this.res;

        if (!req.body) {
            return onError(new director.http.BadRequest, req, res);
        }

        var player = {
            id:       req.body.username,
            email:    req.body.email,
            username: req.body.username,
            password: req.body.password
        };

        app.log.debug("Request to register a player received");
        app.log.silly(player);

        app.resources.User.available(player.username, function(err, isAvailable) {

            if (err || !isAvailable) {
                return onError(errs.merge(err || {}, "Username is not available"), req, res);
            }

            else {

                app.resources.User.create(player, function(err, player) {

                    if (err) {
                        err = errs.merge(err, "Error creating player");
                        return onError(err, req, res);
                    }

                    player.save(function(err, player) {

                        if (err) {
                            err = errs.merge(err, "Error saving player");
                            return onError(err, req, res);
                        }

                        app.log.debug("Player created and saved");
                        app.log.silly(player);

                        app.passport.authenticate('local')(req, res, function() {
                            res.redirect('/');
                        });
                    });
                });
            }
        });
    });

    app.http.router.get( '/twitter-login', function() {

        var req = this.req,
            res = this.res;

        app.log.debug("Received request to authenticate with Twitter");

        app.passport.authenticate('twitter')(req, res, function() {
            return res.emit('next');
        });
    });

    app.http.router.get( '/twitter-token', function() {

        var req = this.req,
            res = this.res;

        app.log.debug("Received authentication response from Twitter");

        app.passport.authenticate('twitter')(req, res, function() {
            app.log.debug("Authenticated with Twitter");
            res.emit('next');
            res.redirect('/');
        });
    });
};
