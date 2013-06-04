var fs = require('fs'),
    plates = require('plates'),
    director = require('director');

exports.attach = function() {

    var app = this;

    var user = "test";
    var template = fs.readFileSync( "./app/templates/index.html", 'utf-8' );

    app.use(require('./server'));

    app.router.before(app.requireAuth);

    app.unauthorized = new director.http.Router().configure({
        async: true,
        strict: false
    });

    app.router.notfound = function(callback) {
        this.res.writeHead(404, { 'Content-Type': 'text/html' });
        this.res.end("Not Found");
        app.log.warn("Not Found: " + this.req.url);
        callback(OK, this.req, this.res);
    };

    app.http.onError  = function(err, req, res) {
        if(err) {
            app.log.error(err);
            var status = err.status || '500';
            var body = err.body.error || 'Error';
            res.writeHead(status, { 'Content-Type': 'text/html' });
            res.end(body);
        }
    };

    app.router.get( '/', function() {

        self = this;
        req = self.req;
        res = self.res;
        username = req.user ? req.user.username : "Unknown";

        app.log.info("req.user" + req.user);

        res.writeHead( 200, { 'Content-Type': 'text/html' } );

        res.end( plates.bind( template, { "user": username } ) );
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
