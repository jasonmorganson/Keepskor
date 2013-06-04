var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe('app', function(){

    describe('starting', function() {
        it('should start', function(done) {
            app.start(8888, done);
        });
        it('is expected to be ok', function() {
            expect(app).to.be.ok;
        })
    });

    describe('configured', function() {
        it('to use couchdb resourceful engine', function() {
            assert.equal(app.config.get('resourceful:engine'), 'couchdb');
        });
    });
})

