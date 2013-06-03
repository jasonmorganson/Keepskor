var fs = require('fs'),
    plates = require('plates'),
    director = require('director');

exports.attach = function() {

    var app = this;

    var user = "test";
    var template = fs.readFileSync( "./app/templates/index.html", 'utf-8' );

    app.use(require('./server'));

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
