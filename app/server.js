import Koa from 'koa'
import { graphqlize } from 'joiql-mongo'
import router from './router'
import * as models from './models'
import { resizeImg } from './controllers/image'

const app = new Koa()
const { NODE_ENV } = process.env

router.all('/api', graphqlize(models))
if (NODE_ENV !== 'development') router.get('/img/*', resizeImg)
app.use(router.routes())

export default app
