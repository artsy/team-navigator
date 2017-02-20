import { connect } from 'joiql-mongo'
import hotglue from 'hotglue'
import babelify from 'babelify'
import envify from 'envify'
import path from 'path'

const { MONGO_URL, PORT } = process.env

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
    transforms: [babelify, envify],
    watch: [
      'views/**/*',
      'controllers/**/*',
      'router.js',
      'client.js'
    ]
  }
})

// Error propagation.
app.use(function *(next) {
  try {
    yield next;
    // Handle 404 upstream.
    var status = this.status || 404;
    if (status === 404) this.throw(404);
  } catch (err) {
    err.status = err.status || 500;
    err.message = err.expose ? err.message : 'Kaboom!';

    // Set our response.
    this.status = err.status;
    this.body = {code: err.status, message: err.message};

    // Since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    this.app.emit('error', err, this);
  }
});


// Connect to Mongo and run app
connect(MONGO_URL)

import auth from "./app/auth"
const mount = require('koa-mount');

auth.use(mount(app))
auth.listen(PORT)

console.log('Listening on ' + PORT)
