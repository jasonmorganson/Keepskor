var fs = require('fs'),
    plates = require('plates'),
    director = require('director');

exports.attach = function() {

    var app = this;

    app.use(require('./server'));

    app.router.before(app.requireAuth);

    app.unauthorized = new director.http.Router().configure({
        async: true,
        strict: false
    });

    app.router.notfound = function(callback) {
        app.log.warn("Not Found: " + this.req.url);
        this.res.writeHead(404, { 'Content-Type': 'text/html' });
        this.res.end("Not Found");
        callback(OK, this.req, this.res);
    };

    app.http.onError  = function(err) {
        if(err) {
            app.log.error(err);
            var status = err.status || 500;
            var body = err.body.error || "Error";
            this.res.writeHead(status, { 'Content-Type': 'text/html' });
            this.res.end(body);
        }
    };

    app.router.get( '/', function() {

        var username = this.req.user ? this.req.user.username : "Unknown";
        var template = fs.readFileSync( './app/templates/index.html', 'utf-8' );

        this.res.writeHead(200, { 'Content-Type': 'text/html' } );
        this.res.end( plates.bind( template, { user: username } ) );
    });

    app.router.post( '/login', function() {

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
