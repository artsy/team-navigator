import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import tree from 'universal-tree'
import Index from '../views'
import { filter, values } from 'lodash'

const api = new Lokka({
  transport: new Transport(process.env.APP_URL + '/api')
})

const treeData = {
  teams: [],
  cities: [],
  members: [],
  allMembers: [],
  curFilter: '',
  member: null
}

export const state = tree(treeData)

export const initData = async (ctx) => {
  const { teams, cities, members } = await ctx.bootstrap(() =>
    api.query(`{
      teams
      cities
      members {
        _id
        name
        title
        floor
        city
        headshot
        team
      }
    }`)
  )
  state.set(treeData)
  state.set('teams', teams)
  state.set('cities', cities)
  state.set('members', members)
  state.set('allMembers', members)
}

export const index = async (ctx) => {
  await initData(ctx)
  ctx.render({ body: Index })
}

export const show = async (ctx) => {
  const { member } = await ctx.bootstrap(() =>
    api.query(`{
      member(_id: "${ctx.params.id}") {
        name
        title
        floor
        city
        headshot
        team
      }
    }`)
  )
  await initData(ctx)
  state.set('member', member)
  ctx.render({ body: Index })
}

export const filterMembers = async (attrs) => {
  state.set('curFilter', values(attrs)[0])
  state.set('members', filter(state.get('allMembers'), attrs))
}

export const searchMembers = (term) => {
  state.set('members', filter(state.get('allMembers'), (member) =>
    member.name.match(new RegExp(term, 'i'))
  ))
}
