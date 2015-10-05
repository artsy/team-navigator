var sinon = require('sinon');
var rewire = require('rewire');
var middleware = rewire('../../../lib/auth/middleware');

describe('auth middleware', function() {
  describe('#validArtsyEmail', function() {
    it('returns true for artsy accounts, false for anything else', function() {
      middleware.validArtsyEmail('damon@artsymail.com').should.be.true();
      middleware.validArtsyEmail('damon@artsy.net').should.be.true();
      middleware.validArtsyEmail('damon@artsymail.net').should.be.false();
      middleware.validArtsyEmail('damon@something.net').should.be.false();
      middleware.validArtsyEmail('damon@artsy.com').should.be.false();
      middleware.validArtsyEmail('notanemail').should.be.false();
    });
  });

  describe('#authenticateWithUser', function() {
    it('returns true for users with valid artsy accounts, false for anything else', function() {
      middleware.authenticateWithUser({ user: { email: 'damon@artsymail.com' }}).should.be.true();
      middleware.authenticateWithUser({ user: { email: 'damon@no.com' }}).should.be.false();
      middleware.authenticateWithUser({ user: {} }).should.be.false();
      middleware.authenticateWithUser({}).should.be.false();
      middleware.authenticateWithUser('garbage').should.be.false();
    });
  });

  describe('#authenticateWithToken', function() {
    describe('without token set', function() {
      it('is always false', function() {
        middleware.authenticateWithToken({ headers: { 'x-api-token': 'xxx' } }).should.be.false();
        middleware.authenticateWithToken({ headers: {} }).should.be.false();
      });
    });

    describe('with token set', function() {
      beforeEach(function() {
        middleware.__set__('apiToken', 'xxx');
      });

      afterEach(function() {
        middleware.__set__('apiToken', null);
      });

      it('returns true for a valid token; false for anything else', function() {
        middleware.authenticateWithToken({ headers: { 'x-api-token': 'xxx' } }).should.be.true();
        middleware.authenticateWithToken({ headers: { 'x-api-token': 'yyy' } }).should.be.false();
        middleware.authenticateWithToken({ headers: { 'x-api-token': null } }).should.be.false();
        middleware.authenticateWithToken({ headers: {} }).should.be.false();
      });
    });
  });

  describe('#authenticateOrLogin', function() {
    describe('token', function() {
      beforeEach(function() {
        middleware.__set__('apiToken', 'xxx');
      });

      afterEach(function() {
        middleware.__set__('apiToken', null);
      });

      it('checks for the token then nexts or redirects', function() {
        var next, redirect;

        middleware.authenticateOrLogin(
          { headers: { 'x-api-token': 'xxx' } },
          { redirect: redirect = sinon.stub() },
          next = sinon.stub()
        );
        next.called.should.be.true();
        redirect.called.should.be.false();

        middleware.authenticateOrLogin(
          { headers: {} },
          { redirect: redirect = sinon.stub() },
          next = sinon.stub()
        );
        next.called.should.be.false();
        redirect.called.should.be.true();
      });
    });

    describe('valid user', function() {
      it('checks for the user then nexts', function() {
        var next, redirect;

        middleware.authenticateOrLogin(
          { user: { email: 'damon@artsymail.com' } },
          { redirect: redirect = sinon.stub() },
          next = sinon.stub()
        );
        next.called.should.be.true();
        redirect.called.should.be.false();

        middleware.authenticateOrLogin(
          { user: { email: 'no@gmail.com' } },
          { redirect: redirect = sinon.stub() },
          next = sinon.stub()
        );
        next.called.should.be.false();
        redirect.called.should.be.true();
      });
    });
  });

  describe('#deemPrivileged', function() {
    beforeEach(function() {
      middleware.__set__('privilegedUserIds', '2,4,6');
    });

    afterEach(function() {
      middleware.__set__('privilegedUserIds', null);
    });

    it('checks to see if the user ID is part of a group of priviledged IDs', function() {
      var req, next;

      req = { user: { id: '2' } };
      middleware.deemPrivileged(
        req,
        {},
        next = sinon.stub()
      );
      req.user.privileged.should.be.true();
      next.called.should.be.true();

      req = { user: { id: '99' } };
      middleware.deemPrivileged(
        req,
        {},
        next = sinon.stub()
      );
      req.user.privileged.should.be.false();
      next.called.should.be.true();
    });
  });
});
