import request from 'superagent'

const router = require('koa-router')();

import passport from 'koa-passport';
import OAuth2Strategy from 'passport-oauth2';

export function validArtsyEmail(email) {
  return /@artsymail.com$/.test(email) || /@artsy.net$/.test(email);
}

export function isUserAdmin(user) {
  return user.type === 'Admin' || user.roles.indexOf('admin') !== -1;
}

export function authenticateWithUser(ctx) {
  console.log(ctx)
    return ctx && ctx.isAuthenticated()
      && validArtsyEmail(ctx.state.user.email)
      && isUserAdmin(ctx.state.user);
}

export function authenticateOrLogin(ctx, next) {
  if (authenticateWithUser(ctx) || ctx.request.url === '/login') {
    return next();
  }

  ctx.redirect('/login');
}

const {
  GRAVITY_API_URL,
  GRAVITY_ID,
  GRAVITY_SECRET,
} = process.env;

const strategy = new OAuth2Strategy({
  authorizationURL: GRAVITY_API_URL + '/oauth2/authorize',
  tokenURL: GRAVITY_API_URL + '/oauth2/access_token',
  clientID: GRAVITY_ID,
  clientSecret: GRAVITY_SECRET,
  callbackURL: '/auth/artsy/callback',
}, async (accessToken, refreshToken, profile, done)  => {
  const reponse = await request
    .get(GRAVITY_API_URL + '/api/v1/me')
    .set('X-Access-Token', accessToken)
  
  const user = JSON.parse(reponse.text)
  done(null, user);
});

passport.use('artsy', strategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default (app) => {

  // sessions
  const convert = require('koa-convert')
  const session = require('koa-generic-session')
  app.keys = ['your-session-secret']
  app.use(convert(session()))

  // body parser
  const bodyParser = require('koa-bodyparser')
  app.use(bodyParser())

  // authentication
  // require('./auth')

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(router.get('/login', passport.authenticate('artsy')));
  app.use(router.get('/auth/artsy/callback', passport.authenticate('artsy', {
    successRedirect: '/',
    failureRedirect: '/logout',
    failureFlash: true,
  }), (req, res) => {
    res.redirect('/');
  }))

  app.use(router.get('/logout', (ctx) => {
    ctx.logout()
    ctx.redirect(GRAVITY_API_URL + '/users/sign_out')
  }))

  app.use(authenticateOrLogin);
};
