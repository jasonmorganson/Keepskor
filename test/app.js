var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

var host = 'http://localhost',
    port = 8888,
    server = host + ':' + port;

describe('app', function(){

    describe('starting', function() {
        it('should start', function(done) {
            app.start(port, done);
        });
        it('is expected to be ok', function() {
            expect(app).to.be.ok;
        })
        it('should stop', function(done) {
            app.server.close();
            done();
        });
    });

    describe('configured', function() {
        it('to use couchdb resourceful engine', function() {
            assert.equal(app.config.get('resourceful:engine'), 'couchdb');
        });
    });
})

