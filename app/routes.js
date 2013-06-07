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

        var req = this.req,
            res = this.res;

        if (req.isAuthenticated()) {
            res.emit('next');
        }

        app.passport.authenticate('local')(req, res, function() {
            res.emit('next');
            res.redirect('/');
        });
    };

    app.http.router.before(ensureAuthentication);

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

    app.unauthorized.get( '/', function() {

        var req = this.req,
            res = this.res;

        var headers = req.headers || { 'Content-Type': 'text/html' };
        var username = req.user ? req.user.username : "Unknown";
        var template = fs.readFileSync( './app/templates/index.html', 'utf-8' );

        res.writeHead(200, headers);
        res.end(plates.bind(template, { user: username } ) );
    });

    app.http.router.post( '/login', function() {

        var req = this.req,
            res = this.res;

        if (!req.body) {
            return onError(new director.http.BadRequest, req, res);
        }

        var player = {
            email:    req.body.email,
            username: req.body.username,
            password: req.body.password
        };

        app.log.debug("Received request to login player", player);

        return res.redirect('/');
    });

    app.unauthorized.post( '/register', function() {

        var req = this.req,
            res = this.res;

        if (!req.body) {
            return onError(new director.http.BadRequest, req, res);
        }

        var player = {
            email:    req.body.email,
            username: req.body.username,
            password: req.body.password
        };

        app.log.debug("Request to register a player received");
        app.log.silly(player);

        app.resources.User.create(

            player, function(err, player) {

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

                    req.login(player, function(err) {

                        if (err) {
                            err = errs.merge(err, "Error logging in player");
                            return onError(err, req, res);
                        }

                        app.log.debug("Player logged in");

                        return res.redirect('/');
                    });
                });
            }
        );
    });
};
