
var blanket = require("blanket")({
   "pattern": "/app/"
});

var mocha = require('mocha'),
    chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var Context = mocha.Context,
    Suite = mocha.Suite,
    Test = mocha.Test;

