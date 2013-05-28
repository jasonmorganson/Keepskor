exports.attach = function() {

    var app = this;

    app.use(app.flatiron.plugins.http, {

        onError: function(error) {
            this.res.writeHead(404);
            this.res.end();
        }
    });

    app.http.before.push( app.connect.cookieParser('secret') );
    app.http.before.push( app.connect.session() );
    app.http.before.push( app.passport.initialize() );
    app.http.before.push( app.passport.session() );
    app.http.before.push( app.connect.static('public') );
};
