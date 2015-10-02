var _ = require('lodash');
var moment = require('moment');

var groupMap = function(collection, key, fn) {
  return _.map(_.groupBy(collection, key), fn);
};

var parse = function(member) {
  member.start_date = moment(member.start_date, 'M/D/YYYY');
  return member;
};

module.exports = function(members, teams) {
  var subteams;

  teams = groupMap(members, 'team', function(subteams, team) {
    subteams = groupMap(subteams, 'subteam', function(members, subteam) {
      return {
        subteam: subteam,
        members: _.map(members, parse)
      };
    });

    return _.extend({}, _.findWhere(teams, { name: team }), {
      subteams: _.sortBy(subteams, 'rank')
    });
  });

  teams = _.sortBy(teams, 'rank');

  return teams;
};
