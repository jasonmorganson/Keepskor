
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe('server', function(){

    describe('should be', function() {
        it('listening', function() {
            expect(app.server.address()).to.exist;
            expect(app.server.address().address).to.not.be.undefined;
            expect(app.server.address().port).to.not.be.undefined;
        });
    });
})

