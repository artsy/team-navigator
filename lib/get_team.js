var cached = require('./cached');
var request = require('request');
var toJSON = require('./to_json');
var key = 'team';

module.exports = function() {
  return cached(key, function(resolve, reject) {
    request(process.env.MEMBERS_CSV, function (err, response, body) {
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
