var _ = require('lodash');

var groupMap = function(collection, key, fn) {
  return _.map(_.groupBy(collection, key), fn);
};

module.exports = function(members) {
  var teams, subteams;

  teams = groupMap(members, 'team', function(subteams, team) {
    subteams = groupMap(subteams, 'subteam', function(members, subteam) {
      return {
        subteam: subteam,
        members: members
      };
    });

    return {
      team: team,
      subteams: _.sortBy(subteams, 'rank')
    };
  });

  teams = _.sortBy(teams, 'rank');

  return teams;
}
