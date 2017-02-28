import { connect } from 'joiql-mongo'
import hotglue from 'hotglue'
import babelify from 'babelify'
import envify from 'envify'
import brfs from 'brfs-babel'
import path from 'path'

const { MONGODB_URI, PORT, SLACK_AUTH_TOKEN } = process.env

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

import auth from './app/auth'
const mount = require('koa-mount')

auth.use(mount(app))
auth.listen(PORT)

console.log('Listening on ' + PORT)

import updatePresence from './scripts/update_presence'
if (SLACK_AUTH_TOKEN) {
  console.log('Starting Slack presence updater.')
  updatePresence(db)
  setInterval(() => { updatePresence(db) }, 5 * 60 * 1000)
}
