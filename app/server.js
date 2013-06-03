var flatiron = require('flatiron'),
    connect = require('connect'),
    passport = require('passport');

exports.attach = function() {

    var app = this;

    app.use(flatiron.plugins.http, {

        onError: function(error) {
            this.res.writeHead(404);
            this.res.end();
        }
    });


    app.http.before.push(connect.cookieParser('secret'));
    app.http.before.push(connect.session());
    app.http.before.push(passport.initialize());
    app.http.before.push(passport.session());
    app.http.before.push(connect.static('public'));

};
