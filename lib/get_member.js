var _ = require('lodash');
var getTeam = require('./get_team');
var cached = require('./cached');

module.exports = function(id) {
  return cached(id, function(resolve, reject) {
    getTeam().then(function(members) {
      var member = _.find(members, function(member) {
        return id === member.email.replace('@', '');
      });

      resolve(member);
    });
  });
};
