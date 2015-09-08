var _ = require('lodash');
var path = require('path');
var express = require('express');
var getTeam = require('./lib/get_team');
var getMember = require('./lib/get_member');
var crop = require('./lib/crop');
var teamify = require('./lib/teamify');

var app = express();

app.set('view engine', 'jade');
app.use(express.static(path.resolve(__dirname, './public')));
app.use(require('morgan')('dev'));

app.get('/', function(req, res, next) {
  var mapObj = _.compose(_.object, _.map);

  getTeam()
    .then(function(members) {
      res.render('index', {
        teams: teamify(members),
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
