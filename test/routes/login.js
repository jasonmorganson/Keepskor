
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../../app/app.js');

var host = 'http://localhost',
    port = 8888,
    server = host + ':' + port;

describe('the login route', function(){

    before(function() {
        app.start(port);
    });

    describe('should respond with error', function() {
        it('when username is missing');
        it('when email is missing');
        it('when password is missing');
    });

    describe('should respond with success', function() {
        it('on a valid request');
    });

    after(function(done) {
        app.server.close();
        done();
    });
})

