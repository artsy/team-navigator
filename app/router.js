import unikoa from 'unikoa'
import bootstrap from 'unikoa-bootstrap'
import render from 'unikoa-react-render'
import {
  index,
  indexByAge,
  state,
  show,
  showTeam,
  showTeamTree,
  showMemberTree,
  showTeamTimezones,
  showAllTeamTimezones,
  byLocation,
  showSeatings,
  showMemberSeatings
} from './controllers'
import Head from './views/head'

const router = unikoa()

router.use(bootstrap)
router.use(async (ctx, next) => {
  const isMobile = await ctx.bootstrap(async () => {
    if (typeof navigator !== 'undefined') return !!navigator.userAgent.match('Mobile')
    if (ctx.headers) return !!ctx.headers['user-agent'].match('Mobile')
    return false
  })
  state.set({ isMobile, allMembers: [] })
  return next()
})

router.use(render({
  head: Head,
  subscribe: (cb) => state.on('update', cb)
}))

router.get('/', index)
router.get('/who-is-new', indexByAge)
router.get('/team-timezones', showAllTeamTimezones)
router.get('/location/:location', byLocation)
router.get('/member/:handle', show)
router.get('/member/:handle/reportees', showMemberTree)
router.get('/team/:team', showTeam)
router.get('/team/:team/tree', showTeamTree)
router.get('/team/:team/timezones', showTeamTimezones)
router.get('/seating/:floor_id', showSeatings)
router.get('/seating/:floor_id/:user_handle', showMemberSeatings)

router.get('/favicon.ico', (ctx) => ctx.redirect('http://artsy.net/favicon.ico'))
export default router
