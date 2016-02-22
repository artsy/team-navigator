var _ = require('lodash');

module.exports = function(members) {
  return _.uniq(_.flatten(_.pluck(members, 'product_teams')))
    .map(function(team) {
      return {
        name: team,
        subteams: [
          {
            members: _.filter(members, function(member) {
              return _.include(member.product_teams, team);
            })
          }
        ]
      }
    });
};
