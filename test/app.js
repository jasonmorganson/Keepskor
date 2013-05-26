var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

var app = require('../app/app.js');

describe( 'app', function(){

    it( 'is expected to be ok (exist and be truthy) first and foremost', function() {
        expect(app).to.be.ok;
    })
})

