var flatiron = require('flatiron'),
    connect = require('connect'),
    passport = require('passport');

exports.attach = function() {

    var app = this;

    var handleError = function(err, req, res) {
        app.log.error(err);
        var status = err.status || '404';
        var body = err.body.error || app.render('404') || 'Not Found';
        res.writeHead(status, { 'Content-Type': 'text/html' });
        res.end(body);
    };

    app.use(flatiron.plugins.http, {
        onError: handleError
    });


    app.http.before.push(connect.cookieParser('secret'));
    app.http.before.push(connect.session());
    app.http.before.push(passport.initialize());
    app.http.before.push(passport.session());
    app.http.before.push(connect.static('public'));

};
