
var flatiron = require('flatiron'),
    app = flatiron.app;

app.flatiron = flatiron;
app.winston = require('winston');
app.Papertrail = require('winston-papertrail').Papertrail,
app.Exceptional = require('exceptional-node').Exceptional;
app.nodefly = require('nodefly');

app.use(require('./config'));
app.use(require('./logger'));

