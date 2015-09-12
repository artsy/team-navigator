var _ = require('lodash');
var getTeam = require('./team');
var cached = require('../cached');

module.exports = function(id) {
  return cached(id, function(resolve, reject) {
    getTeam().then(function(members) {
      var member = _.find(members, function(member) {
        if (!member.email) return reject();

        return id === member.email.replace('@', '');
      });

      if (!member) return reject();

      resolve(member);
    });
  });
};
