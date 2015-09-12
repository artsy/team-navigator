var _ = require('lodash');
var qs = require('qs');

module.exports = function(url, options) {
  var params = _.extend({ url: url }, _.defaults(options, {
      width: 200,
      height: 200,
      quality: 90,
      grow: false,
      key: process.env.EMBEDLY_KEY
    })
  );

  return 'https://i.embed.ly/1/display/crop?' + qs.stringify(params);
};
