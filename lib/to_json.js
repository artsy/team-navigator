var Converter = require('csvtojson').Converter;

module.exports = function(data, callback) {
  var converter = new Converter();
  converter.fromString(data, callback);
};
