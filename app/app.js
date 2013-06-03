var flatiron = require('flatiron'),
    app = flatiron.app;

module.exports = app;

app.use(require('./config'));
app.use(require('./logger'));
app.use(require('./server'));
app.use(require('./routes'));
app.use(require('./passport'));

app.start( app.config.get("http:port"), function(error) {

    if(error) {
        app.log.error( error.message || "Could not start properly, exiting" );
        return process.exit(1);
    }

    var addr = app.server.address();
    app.log.info( "Listening on http://" + addr.address + ':' + addr.port );
});

