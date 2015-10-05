var _ = require('lodash');
var Q = require('q');
var parse = require('../parse');
var cachedCSV = require('../cached_csv');

module.exports = function() {
  return Q.promise(function(resolve, reject) {
    cachedCSV('team', process.env.MEMBERS_CSV)
      .then(function(members) {
        resolve(_.map(members, parse));
      });
  });
};
