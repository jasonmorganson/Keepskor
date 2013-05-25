exports.attach = function (options) {

    var app = this,
        flatiron = require('flatiron'),
        package = require('../package.json');

    require('nodefly').profile(
        app.config.get("nodefly:key"),
        package.name
    );

    var winston = require('winston'),
        Papertrail = require('winston-papertrail').Papertrail,
        Exceptional = require('exceptional-node').Exceptional;

    Exceptional.API_KEY = app.config.get("exceptional:api_key");

    app.use(flatiron.plugins.log);

    var logger = app.log.get('default');

    logger.transports.console.colorize = true;
    logger.transports.console.prettyPrint = true;

    logger.add( winston.transports.File, {
        level: 'info',
        name: 'file.info',
        filename: 'log/info.log'
    });

    logger.add( winston.transports.File, {
        level: 'warn',
        name: 'file.warn',
        filename: 'log/warnings.log'
    });

    logger.add( winston.transports.File, {
        level: 'error',
        name: 'file.error',
        filename: 'log/errors.log'
    });

    logger.add( winston.transports.File, {
        handleExceptions: true,
        name: 'file.exceptions',
        filename: 'log/exceptions.log'
    });

    logger.add( winston.transports.Papertrail,
        app.config.get('papertrail')
    );

    logger.transports.Papertrail.on( 'error', function(err) {
        logger && logger.error(err);
    });

    logger.transports.Papertrail.on( 'connect', function(message) {
        logger && logger.info(message);
    });

    process.addListener( 'uncaughtException', function(err) {
        Exceptional.handle(err);
    });
};
