
var flatiron = require('flatiron'),
    app = flatiron.app;

module.exports = app;

app.flatiron = flatiron;
app.connect = require('connect');
app.winston = require('winston');
app.Papertrail = require('winston-papertrail').Papertrail,
app.Exceptional = require('exceptional-node').Exceptional;
app.nodefly = require('nodefly');

app.use(require('./config'));
app.use(require('./logger'));
app.use(require('./server'));

app.start( app.config.get("http:port"), function(error) {

    if(error) {
        app.log.error( error.message || "Could not start properly, exiting" );
        return process.exit(1);
    }

    var addr = app.server.address();
    app.log.info( "Listening on http://" + addr.address + ':' + addr.port );
});
