var cachedCSV = require('../cached_csv');

module.exports = function(url) {
  url = url || process.env.MEMBERS_CSV;
  return cachedCSV(encodeURIComponent(url), url);
};
