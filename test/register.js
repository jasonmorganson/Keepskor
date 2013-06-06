
var http = require('http'),
    request = require('request'),
    chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

var host = 'http://localhost',
    port = 8888,
    server = host + ':' + port;

describe('when registering', function(){

    before(function() {
        app.start(port);
    });

    describe('a new player', function() {
        describe('should succeed', function() {
            it('with a valid player');
            it('when username is missing');
            it('when password is missing');
        });
        describe('should fail', function() {
            it('when email is missing');
        });
    });

    describe('an existing player', function() {
        describe('should return player', function() {
            it('when a valid player is attempting to register');
        });
    });

    after(function(done) {
        app.server.close();
        done();
    });
});

