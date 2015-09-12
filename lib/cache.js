if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  var client = require('redis').createClient(process.env.REDIS_URL);

  client.on('error', function (err) {
    console.log('Error ' + err);
  });
}

module.exports = client;
