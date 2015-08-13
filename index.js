var _ = require('lodash');
var path = require('path')
var express = require('express');
var getTeam = require('./lib/get_team');
var crop = require('./lib/crop');

var app = express();

app.set('view engine', 'jade');
app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function(req, res) {
  getTeam().then(function(members) {
    var teams = _.object(_.map(_.groupBy(members, 'team'), function(members, key) {
      return [key, _.sortBy(members, 'team_rank')];
    }));

    res.render('index', {
      teams: teams,
      crop: crop
    });
  });
});

app.get('/api/members', function(req, res) {
  getTeam().then(function(members) {
    res.send(members);
  });
});

var port = process.env.PORT || 5000;

app.listen(port);

console.log('Listening on port: ' + port);
