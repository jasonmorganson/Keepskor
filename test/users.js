
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe('http users', function(){

    describe('should have', function() {
        it('authStrategy', function() {
            expect(app.authStrategy).to.exist;
            expect(app.authStrategy.authenticate).to.exist;
        });
        it('requireAuth', function() {
            expect(app.requireAuth).to.exist;
        });
    });
})

