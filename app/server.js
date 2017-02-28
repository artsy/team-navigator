import Koa from 'koa'
import { graphqlize } from 'joiql-mongo'
import router from './router'
import * as models from './models'
import { resizeImg } from './controllers/image'
import auth from './auth'
import mount from 'koa-mount'
import enforceHttps from 'koa-sslify'

const { NODE_ENV } = process.env
const app = new Koa()

if (NODE_ENV === 'production') {
  app.use(enforceHttps({ trustProtoHeader: true }))
}
router.get('/img/*', resizeImg)
router.all('/api', graphqlize(models))
app.use(mount(auth))
app.use(router.routes())

export default app
