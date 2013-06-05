var errs = require('errs'),
    flatiron = require('flatiron'),
    httpUsers = require('flatiron-http-users'),
    resourceful = require('resourceful'),
    app = flatiron.app;

module.exports = app;

app.use(require('./config'));
app.use(require('./logger'));
app.use(require('./server'));
app.use(require('./routes'));
app.use(require('./passport'));

app.use(flatiron.plugins.resourceful, app.config.get('resourceful'));

// HTTP user resources and routes
app.use(httpUsers);


app.on('init', function(err) {

    app.log.verbose("Initialized");
});

app.start(app.config.get("http:port"), function(err) {

    if(err) {
        throw errs.merge(err, "Could not start properly, exiting");
    }

    var addr = app.server.address();
    app.log.info( "Listening on http://" + addr.address + ':' + addr.port );
});

