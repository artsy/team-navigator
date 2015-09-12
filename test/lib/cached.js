var sinon = require('sinon');
var rewire = require('rewire');
var cached = rewire('../../lib/cached');

describe('cached', function() {
  describe('does not have cached data', function() {
    beforeEach(function() {
      this.cache = {
        get: sinon.stub().yields(null, null),
        set: sinon.stub()
      };
      cached.__set__('cache', this.cache);
    });

    it('caches the data yielded by the callback', function(done) {
      var cache = this.cache;

      cached('key', function(resolve, reject) {
        cache.set.called.should.be.false();

        resolve({ fresh: true });

        cache.set.called.should.be.true();
        cache.set.args[0][0].should.equal('key');
        cache.set.args[0][1].should.equal('{"fresh":true}');

        done();
      });
    });
  });

  describe('has cached data', function() {
    beforeEach(function() {
      this.cache = { get: sinon.stub().yields(null, '{ "cached": true }') };
      cached.__set__('cache', this.cache);
    });

    it('returns cached data', function(done) {
      var promise = cached('key', function() {
        // Never hits this because get returns data
        false.should.be.true();
      });

      this.cache.get.called.should.be.true();
      this.cache.get.args[0][0].should.equal('key');

      promise.then(function(data) {
        data.cached.should.be.true();
        done();
      });
    });
  });
});
