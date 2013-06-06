
var http = require('http'),
    chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should(),
    request = require('request');

var app = require('../../app/app.js');

var host = 'http://localhost',
    port = 8888,
    server = host + ':' + port;

describe('the login route', function(){

    before(function() {
        app.start(port);
    });

    describe('should respond with success', function() {
        it('on a valid request', function(done) {
            // Register valid user
            request.post(server + '/register', { form: {
                email: "test@test.com",
                username: "test_user",
                password: "password"
                }}, function(err, res, body) {
                assert.equal(res.statusCode, 302);
                request.post(server + '/login', { form: {
                    username: "test_user",
                    password: "password"
                    }}, function(err, res, body) {
                    assert.equal(res.statusCode, 302);
                    done();
                });
            });
        });
    });

    describe('should respond with unauthorized (401)', function() {
        it('when POST is empty', function(done) {
            request.post(server + '/login', {
                /* Empty POST */
            }, function(err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('when username is missing', function(done) {
            request.post(server + '/login', {
                password: "1234"
            }, function(err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
        it('when password is missing', function(done) {
            request.post(server + '/login', {
                username: "test_user"
            }, function(err, res, body) {
                assert.equal(res.statusCode, 401);
                done();
            });
        });
    });

    after(function(done) {
        app.server.close();
        done();
    });
})

