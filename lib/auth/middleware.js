var self;
var _ = require('lodash');
var privilegedUserIds = process.env.PRIVILEGED_USER_IDS;
var apiToken = process.env.API_TOKEN;

module.exports = self = {
  validArtsyEmail: function(email) {
    return (/@artsymail.com$/.test(email) || /@artsy.net$/.test(email));
  },

  authenticateWithUser: function(req) {
    return (!!req.user && self.validArtsyEmail(req.user.email));
  },

  authenticateWithToken: function(req) {
    return (!!apiToken && (req.headers['x-api-token'] === apiToken));
  },

  authenticateOrLogin: function(req, res, next) {
    if (self.authenticateWithUser(req) || self.authenticateWithToken(req)) return next();
    res.redirect('/login');
  },

  localUser: function(req, res, next) {
    res.locals.user = req.user;
    next();
  },

  deemPrivileged: function(req, res, next) {
    if(req.user){
      req.user.privileged = _.contains(
        privilegedUserIds.split(','),
        req.user.id
      );
    }
    next();
  }
};
