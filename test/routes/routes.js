
var http = require('http'),
    chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../../app/app.js'),
    director = require('director');

var host = 'http://localhost',
    port = 8888,
    server = host + ':' + port;

describe('routes', function(){

    before(function() {
        app.start(port);
    });

    describe('should include', function() {
        it('unauthorized', function() {
            expect(app.unauthorized).to.exist;
            assert.instanceOf(app.unauthorized, director.http.Router);
        });
        it('not found', function() {
            expect(app.http.router.notfound).to.exist;
        });
        it('error', function() {
            expect(app.http.onError).to.exist;
        });
        it('register', function() {
            app.http.router.routes.register.should.exist;
        });
        it('login', function() {
            app.http.router.routes.login.should.exist;
        });
    });

    describe('should respond', function() {
        it.skip('with 401 when not authorized', function(done) {
            http.get(server + '/users/notme', function(res) {
                assert.equal(401, res.statusCode);
                done();
            });
        });
        it('with 404 when not found', function(done) {
            http.get(server + '/not_found', function(res) {
                assert.equal(404, res.statusCode);
                done();
            });
        });
        //it.skip('with 500 on error');
    });

    after(function(done) {
        app.server.close();
        done();
    });
})

