var _ = require('lodash');
var parse = require('./parse');

var groupMap = function(collection, key, fn) {
  return _.map(_.groupBy(collection, key), fn);
};

module.exports = function(members, teams) {
  var subteams;

  teams = groupMap(members, 'team', function(subteams, team) {
    subteams = groupMap(subteams, 'subteam', function(members, subteam) {
      return {
        subteam: subteam,
        members: members
      };
    });

    return _.extend({ name: team }, _.findWhere(teams, { name: team }), {
      subteams: _.sortBy(subteams, 'rank')
    });
  });

  teams = _.sortBy(teams, 'rank');

  return teams;
};
