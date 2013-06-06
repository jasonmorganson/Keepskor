var fs = require('fs'),
    errs = require('errs'),
    plates = require('plates'),
    director = require('director');

exports.attach = function() {

    var app = this;

    app.use(require('./server'));

    app.http.router = app.router;

    app.unauthorized = new director.http.Router()
        .configure({
            async: true,
            strict: false
        });

    var ensureAuthentication = function() {

        var self = this,
            req = this.req,
            res = this.res;

        function next() {
            self.res.emit('next');
        }

        app.log.debug("Ensuring authentication");

        app.passport.authenticate('local')(req, res, next);
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

        self = this;
        req = self.req;
        res = self.res;

        function next() { res.emit('next'); }

        app.passport.authenticate( 'local', function(error, user) {

            if (error) { res.end("SERVER ERROR\n") }
            if (!user) { res.end("false") }
            else {

                req.logIn( user, function(error) {

                    if (error) { throw error }

                    res.writeHead( 200, {
                        'Content-Type': 'text/html',
                        'Authentication': JSON.stringify(req._passport.session)});

                    res.end("true");
                });

            }
        })(this.req, this.res, next);
    });
};
