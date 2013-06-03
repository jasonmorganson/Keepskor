var flatiron = require('flatiron');

exports.attach = function() {

    var app = this,
        env = process.env.NODE_ENV || 'development';

    app.use(flatiron.plugins.config);

    app.config
        .env()
        .argv()
        .file( 'config/config.json' )
        .file( 'env', 'config/' + env + '.json' )
        .defaults({
            'http': {
                'port': 80
            }
        });
};
