var package = require('../package.json'),
    Papertrail = require('winston-papertrail').Papertrail,
    Exceptional = require('exceptional-node').Exceptional,
    nodefly = require('nodefly');

exports.attach = function() {



    var app = this;

    app.papertrail = Papertrail;
    app.exceptional = Exceptional;
    app.nodefly = nodefly;

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
        level: 'error',
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
        app.log.error(err);
    });

    process.addListener( 'uncaughtException', function(err) {
        app.Exceptional.handle(err);
    });
};
