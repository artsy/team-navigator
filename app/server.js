import Koa from 'koa'
import { graphqlize } from 'joiql-mongo'
import router from './router'
import * as models from './models'

const app = new Koa()

router.all('/api', graphqlize(models))
app.use(router.routes())

export default app
