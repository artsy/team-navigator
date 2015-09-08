var Q = require('q');
var cache = require('./cache');

module.exports = function(key, cb) {
  return Q.promise(function(resolve, reject) {
    var set = function(data) {
      cache.set(key, JSON.stringify(data));
      resolve(data);
    };

    cache.get(key, function(err, cached) {
      if (err) return reject(err);
      if (cached) return resolve(JSON.parse(cached));
      cb(set, reject);
    });
  });
};
