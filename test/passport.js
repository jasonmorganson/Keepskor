
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe('app passport', function(){

    describe('should have', function() {
        it('main passport object', function() {
            expect(app.passport).to.exist;
            expect(app.passport).to.equal(require('passport'));
        });
        it('should be authStrategy', function() {
            expect(app.authStrategy).to.equal(app.passport);
        });
        it('serializeUser', function() {
            expect(app.passport.serializeUser).to.exist;
        });
        it('deserializeUser', function() {
            expect(app.passport.deserializeUser).to.exist;
        });
    });

    describe('should return', function() {
        it('username from serializeUser', function() {
            var username = "test";
            var user = { username: username };

            app.passport.serializeUser(function(user, result) {
                assert.equal(username, result);
            });
        });
        it('user from deserializeUser', function() {
            var username = "test";

            app.resources.User.create({
                email:    "test@test.com",
                username: username,
                password: "password"
            }, function(err, user) {

                app.passport.deserializeUser(function(username, result) {
                    assert.instanceOf(result, app.resources.User);
                    asset.equal(user, result);
                });
            });
        });
    });
})

