var _ = require('lodash');
var Q = require('q');
var express = require('express');
var request = require('request');
var toJSON = require('./to_json');

var app = express();

var csv = process.env.CSV;

app.get('/', function(req, res) {
  res.send('Hello world.');
});

app.get('/api/members', function(req, res) {
  request(csv, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      toJSON(body, function(err, data) {
        res.send(data);
      });
    }
  });
});

var port = process.env.PORT || 5000;

app.listen(port);

console.log('Listening on port: ' + port);
