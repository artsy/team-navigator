var _ = require('lodash');
var Q = require('q');
var parse = require('../parse');
var cachedCSV = require('../cached_csv');

module.exports = function() {
  return cachedCSV('team', process.env.MEMBERS_CSV);
};
