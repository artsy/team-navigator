import request from 'superagent'
const router = require('koa-router')()

import passport from 'koa-passport'
import OAuth2Strategy from 'passport-oauth2'

const {
  GRAVITY_API_URL,
  GRAVITY_ID,
  GRAVITY_SECRET,
  MONGODB_URI,
  INTERNAL_REQUESTS_HEADER_SECRET,
  EXCEPTION_USER_IDS
} = process.env

export function validArtsyEmail (email) {
  return /@artsymail.com$/.test(email) || /@artsy.net$/.test(email)
}

export function isUserAuthorized (user) {
  return user.roles.indexOf('team') !== -1
}

export function isOnExceptionList (user) {
  return user && EXCEPTION_USER_IDS && EXCEPTION_USER_IDS.includes(user.id)
}

export function authenticateWithUser (ctx) {
  return ctx && ctx.isAuthenticated() &&
       validArtsyEmail(ctx.state.user.email) &&
       isUserAuthorized(ctx.state.user) || isOnExceptionList(ctx.state.user)
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

app.use(convert(session({ store: new MongoStore({ url: MONGODB_URI }) })))

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
