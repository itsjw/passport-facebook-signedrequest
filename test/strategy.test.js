/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , FacebookSignedRequestStrategy = require('../lib/strategy');

console.log(FacebookSignedRequestStrategy);
describe('Strategy', function() {
    
  describe('constructed', function() {
    var strategy = new FacebookSignedRequestStrategy({
        appId: 'ABC123',
        appSecret: 'secret'
      },
      function() {});
    
    it('should be named facebook', function() {
      expect(strategy.name).to.equal('facebookSignedRequest');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new FacebookSignedRequestStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })

});
