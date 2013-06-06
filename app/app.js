var errs = require('errs'),
    flatiron = require('flatiron'),
    httpUsers = require('flatiron-http-users'),
    restful = require('restful'),
    resourceful = require('resourceful');

var app = module.exports = flatiron.app;

app.use(require('./config'));
app.use(require('./logger'));
app.use(require('./server'));

app.use(flatiron.plugins.resourceful, app.config.get('resourceful'));

// HTTP user resources and routes
app.use(httpUsers);

// Expose all resources as restful routers
app.use(restful);

app.use(require('./passport'));
app.use(require('./routes'));

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

