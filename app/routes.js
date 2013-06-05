var fs = require('fs'),
    errs = require('errs'),
    plates = require('plates'),
    director = require('director');

exports.attach = function() {

    var app = this;

    app.use(require('./server'));

    app.http.router = app.router;

    app.http.router.before(app.requireAuth);

    app.unauthorized = new director.http.Router()
        .configure({
            async: true,
            strict: false
        });

    app.http.router.notfound = function(callback) {
        app.log.warn("Not Found: " + this.req.url);
        var headers = req.headers || { 'Content-Type': 'text/html' };
        this.res.writeHead(404, headers);
        this.res.end("Not Found");
        callback(OK, this.req, this.res);
    };

    app.http.onError = function(err, req, res) {
        if(err) {
            var status = err.status || 500;
            var headers = err.headers || { 'Content-Type': 'text/html' };
            var body = err.message || err.body.error || "Error";
            app.log.error(body);
            res.writeHead(status, headers);
            res.end(body);
        }
    };

    app.http.router.get( '/', function() {

        var username = this.req.user ? this.req.user.username : "Unknown";
        var template = fs.readFileSync( './app/templates/index.html', 'utf-8' );

        this.res.writeHead(200, { 'Content-Type': 'text/html' } );
        this.res.end( plates.bind( template, { user: username } ) );
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
