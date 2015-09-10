var cachedCSV = require('../cached_csv');

module.exports = function() {
  return cachedCSV('teams', process.env.TEAMS_CSV);
};
