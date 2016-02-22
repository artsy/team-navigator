var team = require('./team');

module.exports = {
  team: function() {
    return team(process.env.MEMBERS_CSV);
  },
  staff: function() {
    return team(process.env.STAFF_CSV);
  },
  teams: require('./teams'),
  member: require('./member'),
};
