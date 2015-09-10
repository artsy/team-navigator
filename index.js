var _ = require('lodash');
var Q = require('q');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var get = require('./lib/get');
var cache = require('./lib/cache');
var crop = require('./lib/crop');
var teamify = require('./lib/teamify');

var app = express();

app.set('view engine', 'jade');
app.use(express.static(path.resolve(__dirname, './public')));
app.use(require('morgan')('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  key: process.env.SESSION_KEY
}));

require('./lib/auth')(app);

app.get('/', function(req, res, next) {
  var mapObj = _.compose(_.object, _.map);

  Q.all([
    get.team(),
    get.teams()
  ])
    .spread(function(members, teams) {
      res.render('index', {
        teams: teamify(members, teams),
        crop: crop
      });
    })
    .catch(next)
    .done();
});

app.get('/:id', function(req, res, next) {
  get.member(req.params.id)
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
  get.team(req.params.id)
    .then(res.send.bind(res))
    .catch(next)
    .done();
});

app.get('/api/members/:id', function(req, res, next) {
  get.member(req.params.id)
    .then(res.send.bind(res))
    .catch(next)
    .done();
});

app.post('/refresh', function(req, res, next) {
  cache.flushall(function() {
    res.redirect('/');
  });
});

var port = process.env.PORT || 5000;

app.listen(port);

console.log('Listening on port: ' + port);
