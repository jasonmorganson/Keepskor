
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe('resources', function(){

    describe('should include', function() {
        it('User', function() {
            expect(app.resources.User).to.exist;
        });
    });

    describe('do not require', function() {
        describe('a username', function() {
            it('to create an new User', function(done) {
                app.resources.User.create({
                    email: "test@test.com"
                }, done);
            });
        });
        describe('a password', function() {
            it('to create an new User', function(done) {
                app.resources.User.create({
                    email: "test@test.com"
                }, done);
            });
        });
    });

    describe('require', function() {
        describe('an email', function() {
            it('to create an new User', function(done) {
                app.resources.User.create({
                    username: "test_user"
                }, function(err, user) {
                    err.should.not.be.null;
                    err.validate.valid.should.be.false;
                    done();
                });
            });
        });
    });
})

