var moment = require('moment');

module.exports = function(member) {
  member.start_date = moment(member.start_date, 'M/D/YYYY');
  return member;
};
