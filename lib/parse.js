var moment = require('moment');

module.exports = function(member) {
  member.id = member.email ? member.email.replace('@', '') : undefined;
  member.initials = member.name ? member.name.match(/\b[A-Z]/g, '').join('') : undefined;
  member.start_date = moment(member.start_date, 'M/D/YYYY');

  return member;
};
