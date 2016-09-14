import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import tree from 'universal-tree'
import Index from '../views'
import { filter, values } from 'lodash'

const api = new Lokka({
  transport: new Transport(process.env.APP_URL + '/api')
})

export const state = tree({
  teams: [],
  cities: [],
  members: [],
  allMembers: [],
  curFilter: ''
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
        team
      }
    }`)
  )
  state.set('teams', teams)
  state.set('cities', cities)
  state.set('members', members)
  state.set('allMembers', members)
  ctx.render({ body: Index })
}

export const filterMembers = async (attrs) => {
  state.set('curFilter', values(attrs)[0])
  state.set('members', filter(state.get('allMembers'), attrs))
}
