var client = require('redis').createClient(process.env.REDIS_URL);

client.on('error', function (err) {
  console.log('Error ' + err);
});

module.exports = client;
