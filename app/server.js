var flatiron = require('flatiron'),
    connect = require('connect'),
    passport = require('passport');

exports.attach = function() {

    var app = this;

    app.use(flatiron.plugins.http);

    app.http.before.push(connect.cookieParser('secret'));
    app.http.before.push(connect.session());
    app.http.before.push(connect.static('public'));

};
