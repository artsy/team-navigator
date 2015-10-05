var Q = require('q');
var _ = require('lodash');
var getTeam = require('./team');
var cached = require('../cached');
var parse = require('../parse');

module.exports = function(id) {
  return Q.promise(function(resolve, reject) {
    cached(id, function(resolve, reject) {
      getTeam().then(function(members) {
        var member = _.find(members, function(member) {
          if (!member.email) return reject();
          return id === member.email.replace('@', '');
        });
        if (!member) return reject();
        resolve(member);
      });
    })
    .then(function(member) {
      resolve(parse(member));
    });
  });
};
