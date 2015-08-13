var _ = require('lodash');
var path = require('path')
var express = require('express');
var getTeam = require('./lib/get_team');
var getMember = require('./lib/get_member');
var crop = require('./lib/crop');

var app = express();

app.set('view engine', 'jade');
app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function(req, res, next) {
  var mapObj = _.compose(_.object, _.map);

  getTeam()
    .then(function(members) {
      var teams = mapObj(_.groupBy(members, 'team'), function(members, key) {
        return [key, _.sortBy(members, 'team_rank')];
      });

      res.render('index', {
        teams: teams,
        crop: crop
      });
    })
    .catch(next)
    .done();
});

app.get('/:id', function(req, res, next) {
  getMember(req.params.id)
    .then(function(member) {
      res.render('show', {
        member: member,
        crop: crop
      });
    })
    .catch(next)
    .done();
});

app.get('/api/members', function(req, res, next) {
  getTeam(req.params.id)
    .then(res.send.bind(res))
    .catch(next)
    .done();
});

app.get('/api/members/:id', function(req, res, next) {
  getMember(req.params.id)
    .then(res.send.bind(res))
    .catch(next)
    .done();
});

var port = process.env.PORT || 5000;

app.listen(port);

console.log('Listening on port: ' + port);
