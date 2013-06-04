
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe('server', function(){

    describe('should have', function() {
        it('http router', function() {
            expect(app.http.router).to.exist;
        });
    });
    describe('should be', function() {
        it('using the config plugin', function() {
            expect(app.config).to.exist;
        });
        it('using the log plugin', function() {
            expect(app.log).to.exist;
        });
        it('using the http plugin', function() {
            expect(app.http).to.exist;
        });
        it('using the resourceful plugin', function() {
            expect(app.resources).to.exist;
            expect(app.define).to.exist;
        });
        it('listening', function() {
            expect(app.server.address()).to.exist;
            expect(app.server.address().address).to.not.be.undefined;
            assert.isNumber(app.server.address().port);
        });
    });
})

