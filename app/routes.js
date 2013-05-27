var fs = require('fs');

exports.attach = function() {

    var app = this;

    var user = "test";
    var template = fs.readFileSync( "./public/index.html", 'utf-8' );

    app.router.get( '/hey', function() {
        this.res.writeHead( 200, { "Content-Type": "text/html" } );
        this.res.end( app.plates.bind( template, { "user": user } ) );
    });
};
