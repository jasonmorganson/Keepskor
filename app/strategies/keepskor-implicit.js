var util = require('util'),
    passport = require('passport');

function KeepskorImplicitStrategy() {

    var self = this;

    passport.Strategy.call(this);

    self.name = 'keepskor-implicit';
}

util.inherits(KeepskorImplicitStrategy, passport.Strategy);

KeepskorImplicitStrategy.prototype.authenticate = function(req) {

    // TODO: Implement this strategy
    //
    // For now just pass the buck
    this.pass();
};

exports.Strategy = KeepskorImplicitStrategy;
