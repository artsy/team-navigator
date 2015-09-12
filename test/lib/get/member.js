var sinon = require('sinon');
var rewire = require('rewire');
var get = {
  member: rewire('../../../lib/get/member')
};

describe('get.member', function() {
  describe('cannot return a member', function() {
    beforeEach(function() {
      this.cached = function(key, cb) {
        cb(null, sinon.stub());

        return {
          catch: sinon.stub()
            .yields('myError')
        };
      };

      this.getTeam = function() {
        return {
          then: function(cb) {
            // Return an empty array of "members"
            cb([]);
          }
        };
      };

      get.member.__set__('cached', this.cached);
      get.member.__set__('getTeam', this.getTeam);
    });

    it('rejects properly when it there is no member to return', function(done) {
      get.member('missing')
        .catch(function(e) {
          e.should.equal('myError');
          done();
        });
    });
  });
});
