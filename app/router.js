import unikoa from 'unikoa'
import bootstrap from 'unikoa-bootstrap'
import render from 'unikoa-react-render'
import { index, state, show, showTeam } from './controllers'
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

export default router
