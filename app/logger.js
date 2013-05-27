exports.attach = function() {

var package = require('../package.json');


    var app = this;

    app.Exceptional.API_KEY = app.config.get("exceptional:api_key");

    app.nodefly.profile(
        app.config.get("nodefly:key"),
        package.name
    );

    app.use(app.flatiron.plugins.log);

    var logger = app.log.get('default');

    logger.transports.console.colorize = true;
    logger.transports.console.prettyPrint = true;

    logger.add( app.winston.transports.File, {
        level: 'info',
        name: 'file.info',
        filename: 'log/info.log'
    });

    logger.add( app.winston.transports.File, {
        level: 'warn',
        name: 'file.warn',
        filename: 'log/warnings.log'
    });

    logger.add( app.winston.transports.File, {
        level: 'error',
        name: 'file.error',
        filename: 'log/errors.log'
    });

    logger.add( app.winston.transports.File, {
        handleExceptions: true,
        name: 'file.exceptions',
        filename: 'log/exceptions.log'
    });

    logger.add( app.winston.transports.Papertrail,
        app.config.get('papertrail')
    );

    logger.transports.Papertrail.on( 'error', function(error) {
        if(logger) { logger.error(error); }
    });

    logger.transports.Papertrail.on( 'connect', function(message) {
        if(logger) { logger.info(message); }
    });

    process.addListener( 'uncaughtException', function(err) {
        app.Exceptional.handle(err);
    });
};
