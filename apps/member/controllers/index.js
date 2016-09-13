import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import tree from 'universal-tree'
import Index from '../views'

const api = new Lokka({
  transport: new Transport(process.env.APP_URL + '/api/member')
})

export const state = tree({
  teams: [],
  cities: [],
  members: []
})

export const index = async (ctx) => {
  const { teams, cities, members } = await ctx.bootstrap(() =>
    api.query(`{
      teams
      cities
      members {
        name
        title
        floor
        city
        headshot
      }
    }`)
  )
  state.set('teams', teams)
  state.set('cities', cities)
  state.set('members', members)
  ctx.render({ body: Index })
}
