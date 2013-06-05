
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js'),
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

    after(function(done) {
        app.server.close();
        done();
    });
})

