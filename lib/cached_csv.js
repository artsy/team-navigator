var cached = require('./cached');
var request = require('request');
var toJSON = require('./to_json');

module.exports = function(key, url) {
  return cached(key, function(resolve, reject) {
    request(url, function (err, response, body) {
      if (err) return reject(err);
      if (response.statusCode === 200) {
        toJSON(body, function(err, data) {
          if (err) return reject(err);
          resolve(data);
        });
      }
    });
  });
};
