import request from 'superagent'
const router = require('koa-router')()

import passport from 'koa-passport'
import OAuth2Strategy from 'passport-oauth2'

const {
  GRAVITY_API_URL,
  GRAVITY_ID,
  GRAVITY_SECRET,
  MONGO_URL,
  INTERNAL_REQUESTS_HEADER_SECRET
} = process.env

export function validArtsyEmail (email) {
  return /@artsymail.com$/.test(email) || /@artsy.net$/.test(email)
}

export function isUserAdmin (user) {
  return user.type === 'Admin' || user.roles.indexOf('admin') !== -1
}

export function authenticateWithUser (ctx) {
  return ctx && ctx.isAuthenticated() &&
       validArtsyEmail(ctx.state.user.email) &&
       isUserAdmin(ctx.state.user)
}

export function isNodeFetchSelf (ctx) {
  return ctx && ctx.request.headers['secret'] === INTERNAL_REQUESTS_HEADER_SECRET
}

export function authenticateOrLogin (ctx, next) {
  if (authenticateWithUser(ctx) || isNodeFetchSelf(ctx)) {
    return next()
  }

  ctx.redirect('/login')
}

const strategy = new OAuth2Strategy({
  authorizationURL: GRAVITY_API_URL + '/oauth2/authorize',
  tokenURL: GRAVITY_API_URL + '/oauth2/access_token',
  clientID: GRAVITY_ID,
  clientSecret: GRAVITY_SECRET,
  callbackURL: '/auth/artsy/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const reponse = await request
    .get(GRAVITY_API_URL + '/api/v1/me')
    .set('X-Access-Token', accessToken)

  const user = JSON.parse(reponse.text)
  done(null, user)
})

passport.use('artsy', strategy)
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

import Koa from 'koa'
const app = new Koa()

// sessions
const convert = require('koa-convert')
const session = require('koa-generic-session')
const MongoStore = require('koa-generic-session-mongo')

app.keys = ['our-secret-team-nav-secret']
app.use(convert(session({ store: new MongoStore({ url: MONGO_URL }) })))

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

app.use(passport.initialize())
app.use(passport.session())

router.get('/login', passport.authenticate('artsy', {
  successRedirect: '/',
  failureRedirect: '/failure'
}))

router.get('/auth/artsy/callback', passport.authenticate('artsy', {
  successRedirect: '/',
  failureRedirect: '/logout',
  failureFlash: true
}), (req, res) => {
  res.redirect('/')
})

router.get('/logout', (ctx) => {
  ctx.logout()
  ctx.redirect(GRAVITY_API_URL + '/users/sign_out')
})

app.use(router.routes())
app.use(authenticateOrLogin)

export default app
