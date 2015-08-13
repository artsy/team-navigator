var Q = require('q');
var request = require('request');
var toJSON = require('./to_json');

module.exports = function() {
  return Q.promise(function(resolve, reject) {

    request(process.env.CSV, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        toJSON(body, function(err, data) {
          resolve(data);
        });
      }
    });

  });
}
