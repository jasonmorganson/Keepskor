var util = require('util'),
    passport = require('passport');

function KeepskorExplicitStrategy() {

    var self = this;

    passport.Strategy.call(this);

    self.name = 'keepskor-explicit';
}

util.inherits(KeepskorExplicitStrategy, passport.Strategy);

KeepskorExplicitStrategy.prototype.authenticate = function(req) {

    // TODO: Implement this strategy
    //
    // For now just pass the buck
    this.pass();
};

exports.Strategy = KeepskorExplicitStrategy;
