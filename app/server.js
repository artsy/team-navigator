import Koa from 'koa'
import { graphqlize } from 'joiql-mongo'
import router from './router'
import * as models from './models'
import { resizeImg } from './controllers/image'

const app = new Koa()

router.all('/api', graphqlize(models))
// router.get('/img/*', resizeImg)
app.use(router.routes())

export default app
