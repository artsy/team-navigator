import { connect } from 'joiql-mongo'
import Koa from 'koa'
import member from './apps/member'

const app = new Koa()
const { PORT, MONGO_URL } = process.env

// Mount apps
app.use(...member.middleware)

// Connect to Mongo and start server
connect(MONGO_URL)
app.listen(PORT)
console.log('Listening on ' + PORT)
