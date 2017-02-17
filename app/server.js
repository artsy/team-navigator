import Koa from 'koa'
import { graphqlize } from 'joiql-mongo'
import router from './router'
import * as models from './models'
import { resizeImg } from './controllers/image'
import auth from "./auth"

const app = new Koa()
auth(app, router)

router.all('/api', graphqlize(models))
router.get('/img/*', resizeImg)
app.use(router.routes())

export default app
