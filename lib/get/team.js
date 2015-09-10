var cachedCSV = require('../cached_csv');

module.exports = function() {
  return cachedCSV('team', process.env.MEMBERS_CSV);
};
