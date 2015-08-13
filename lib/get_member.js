var _ = require('lodash');
var Q = require('q');
var getTeam = require('./get_team');

module.exports = function(id) {
  return Q.promise(function(resolve, reject) {
    getTeam().then(function(members) {
      var member = _.find(members, function(member) {
        return id === member.email.replace('@', '');
      });

      resolve(member);
    });
  });
}
