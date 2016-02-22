var _ = require('lodash');
var moment = require('moment');

module.exports = function(member) {
  member.id = member.email ? member.email.replace('@', '') : undefined;
  member.initials = member.name ? member.name.match(/\b[A-Z]/g, '').join('') : undefined;
  member.start_date = moment(member.start_date, 'M/D/YYYY');

  if (_.negate(_.isEmpty)(member.product_team)) {
    member.product_teams = member.product_team.split(',').map(function(name) {
      return name.trim();
    });
  } else {
    member.product_teams = [];
  }

  return member;
};
