var _ = require('lodash');
var url = require('url')
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var get = require('./lib/get');
var cache = require('./lib/cache');
var crop = require('./lib/crop');
var teamify = require('./lib/teamify');
var productTeamify = require('./lib/product_teamify');
var parse = require('./lib/parse');

var app = express();

app
  .set('view engine', 'jade')
  .use(express.static(path.resolve(__dirname, './public')))
  .use(require('morgan')('dev'))
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY
  }))
  .use(function(req, res, next) {
    res.locals.CURRENT_PATH = url.parse(req.url).pathname;
    next();
  });

require('./lib/auth')(app);

app
  .get('/', function(req, res, next) {
    Promise.all([
      get.team(),
      get.teams()
    ])
      .then(function(xs) {
        var members, teams;
        members = xs[0]; teams = xs[1];
        members = _.map(members, parse);
        res.render('index', {
          count: members.length,
          teams: teamify(members, teams),
          crop: crop
        });
      })
      .catch(next);
  })

  .get('/product', function(req, res, next) {
    get.team()
      .then(function(members) {
        members = _.map(members, parse);
        res.render('index', {
          count: 0,
          teams: productTeamify(members),
          crop: crop
        });
      })
      .catch(next);
  })

  .get('/staff', function(req, res, next) {
    Promise.all([
      get.staff(),
      get.teams()
    ])
      .then(function(xs) {
        var staff, teams;
        staff = xs[0]; teams = xs[1];
        staff = _.map(staff, parse);
        res.render('index', {
          count: staff.length,
          teams: teamify(staff, teams),
          crop: crop
        });
      })
      .catch(next);
  })

  .get('/:id', function(req, res, next) {
    get.member(req.params.id)
      .then(function(member) {
        res.render('show', {
          member: parse(member),
          crop: crop
        });
      })
      .catch(next);
  })

  .get('/api/teams', function(req, res, next) {
    get.teams()
      .then(res.send.bind(res))
      .catch(next);
  })

  .get('/api/members', function(req, res, next) {
    get.team()
      .then(res.send.bind(res))
      .catch(next);
  })

  .get('/api/members/:id', function(req, res, next) {
    get.member(req.params.id)
      .then(res.send.bind(res))
      .catch(next);
  })

  .post('/refresh', function(req, res, next) {
    if (req.user.privileged) {
      cache.flushall(function() {
        res.redirect('/');
      });
    } else {
      res.status(403)
        .send('Forbidden');
    }
  });

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log('Listening on port: ' + port);
});
