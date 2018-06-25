import Koa from "koa"
import { graphqlize } from "joiql-mongo"
import router from "./router"
import * as models from "./models"
import { resizeImg } from "./controllers/image"
import auth from "./auth"
import mount from "koa-mount"
import enforceHttps from "koa-sslify"
import route from "koa-route"
import staticRoute from "koa-static"
import fs from "fs"
import path from "path"

const { NODE_ENV } = process.env
const app = new Koa()

if (NODE_ENV === "production") {
  app.use(enforceHttps({ trustProtoHeader: true }))
}
router.get("/img/*", resizeImg)
app.use(mount(auth))

router.all("/api", graphqlize(models))

// For static assets from the built version of CRA
app.use(mount("/v3/", staticRoute(path.resolve('build/'))))
// For client-side routing in CRA
app.use(
  route.get("/v3/*", ctx => {
    ctx.body = fs.readFileSync(path.resolve(path.join("build", "index.html")), "utf8")
  })
)

app.use(router.routes())

export default app
