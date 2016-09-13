import { connect } from 'joiql-mongo'
import hotglue from 'hotglue'
import babelify from 'babelify'
import envify from 'envify'

const { MONGO_URL, PORT } = process.env

// Bundle together client and server app for hot reloading, and,
// to be implemented, production ready asset bundle serving
// when NODE_ENV=production
const app = module.exports = hotglue({
  relative: __dirname + '/app',
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
    transforms: [babelify, envify],
    watch: [
      'views/**/*',
      'controllers/**/*',
      'router.js',
      'client.js'
    ]
  }
})

// Connect to Mongo and run app
connect(MONGO_URL)
app.listen(PORT)
console.log('Listening on ' + PORT)
