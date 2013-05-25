exports.attach = function (options) {

    var app = this,
        flatiron = require('flatiron'),
        winston = require('winston'),
        Papertrail = require('winston-papertrail').Papertrail;

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

};
