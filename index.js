import { connect } from 'joiql-mongo'
import hotglue from 'hotglue'
import babelify from 'babelify'
import envify from 'envify'
import brfs from 'brfs-babel'
import path from 'path'

const { MONGODB_URI, PORT, SLACK_AUTH_TOKEN, SESSION_KEYS, NODE_ENV, GRAVITY_API_URL, GITHUB_ORG_LOOKUP_KEY, GITHUB_ORG } = process.env

// Bundle together client and server app for hot reloading, and—
// to be implemented—production ready asset bundle serving
// when NODE_ENV=production
const app = module.exports = hotglue({
  relative: path.join(__dirname, '/app'),
  server: {
    main: 'server.js',
    watch: [
      'views/**/*',
      'controllers/**/*',
      'models/**/*',
      'router.js',
      'server.js'
    ]
  },
  client: {
    main: 'client.js',
    transforms: [brfs, babelify, envify],
    watch: [
      'views/**/*',
      'controllers/**/*',
      'router.js',
      'client.js'
    ]
  }
})

// Connect to Mongo and run app
const db = connect(MONGODB_URI, { authMechanism: 'ScramSHA1' })
app.keys = SESSION_KEYS.split(',')
app.listen(PORT)
console.log('Listening on ' + PORT)

// Every 5 minute tasks
import updateSlackPresence from './scripts/update_slack_presence'

// Daily tasks
import updateUsersFromSlack from './scripts/update_users_from_slack'
import staffNotifications from './scripts/daily_staff_notifications'
import getArticles from './scripts/daily_articles_for_member'
import githubRepos from './scripts/daily_github_history_for_member'

const runOften = (fn, time) => {
  fn(db)
  setInterval(() => { fn(db) }, time)
}

const runDaily = (fn) => runOften(fn, 24 * 60 * 60 * 1000)
const runEveryFiveMin = (fn) => runOften(fn, 5 * 60 * 1000)

if (SLACK_AUTH_TOKEN) {
  console.log('Starting Slack presence updater.')
  runEveryFiveMin(updateSlackPresence)

  console.log('Starting Slack profile updater.')
  runDaily(updateUsersFromSlack)

  // Scoped behind prod because devs shouldn't be triggering this
  if (NODE_ENV === 'production') {
    console.log('Starting manager daily updates.')
    runDaily(staffNotifications)
  }
}

if (GRAVITY_API_URL) {
  console.log('Starting Article repo updates.')
  runDaily(getArticles)
}

if (GITHUB_ORG && GITHUB_ORG_LOOKUP_KEY) {
  console.log('Starting GitHub repo updates.')
  runDaily(githubRepos)
}
