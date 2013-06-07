
var http = require('http'),
    request = require('request'),
    chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../../app/app.js');

var host = 'http://localhost',
    port = 8888,
    server = host + ':' + port;

describe('the register route', function(){

    before(function() {
        app.start(port);
    });

    describe('should respond with bad request (400)', function() {
        it('when POST is empty', function(done) {
            request.post(server + '/register', {
                /* Empty POST */
            }, function(err, res, body) {
                assert.equal(res.statusCode, 400);
                done();
            });
        });
    });

    describe('should respond with an redirect (302)', function() {
    });

    describe('should respond with an error (500)', function() {
        it('when email is missing', function(done) {
            request.post(server + '/register', function(err, res, body) {
                assert.equal(res.statusCode, 500);
                done();
            }).form({
                username: "test_user",
                password: "password"
            });
        });
        it('when username is missing', function(done) {
            request.post(server + '/register', function(err, res, body) {
                assert.equal(res.statusCode, 500);
                done();
            }).form({
                email: "test1@test.com",
                password: "1234"
            });
        });
        it('when password is missing', function(done) {
            request.post(server + '/register', function(err, res, body) {
                assert.equal(res.statusCode, 500);
                done();
            }).form({
                email: "test2@test.com",
                username: "test_user"
            });
        });
    });

    describe('should respond with successful redirect', function() {
        it('on a valid request', function(done) {
            var randomNum = Math.floor(Math.random() * 100) + 1;
            request.post(server + '/register', function(err, res, body) {
                assert.equal(res.statusCode, 302);
                done();
            }).form({
                email: "test" + randomNum + "@test.com",
                username: "test" + randomNum,
                password: "password"
            });
        });
    });

    after(function(done) {
        app.server.close();
        done();
    });
})

