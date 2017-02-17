import unikoa from 'unikoa'
import bootstrap from 'unikoa-bootstrap'
import render from 'unikoa-react-render'
import { index, state, show, showTeam, showTeamTree } from './controllers'
import Head from './views/head'

const router = unikoa()

router.use(bootstrap)
router.use(render({
  head: Head,
  subscribe: (cb) => state.on('update', cb)
}))
router.get('/', index)
router.get('/member/:handle', show)
router.get('/team/:team', showTeam)
router.get('/team/:team/tree', showTeamTree)
router.get('/favicon.ico', (ctx) => ctx.redirect('http://artsy.net/favicon.ico'))
export default router
