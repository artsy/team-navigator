import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import tree from 'universal-tree'
import Index from '../views'
import { filter, values, find } from 'lodash'

const api = new Lokka({
  transport: new Transport(process.env.APP_URL + '/api')
})

export const state = tree({
  teams: [],
  cities: [],
  members: [],
  allMembers: [],
  curFilter: '',
  member: null
})

export const initData = async (ctx) => {
  const { teams, cities, members } = await ctx.bootstrap(() =>
    api.query(`{
      teams
      cities
      members {
        _id
        name
        email
        title
        floor
        city
        headshot
        team
        productTeam
        reportsTo
      }
    }`)
  )
  state.set({ teams, cities, members, allMembers: members, member: null })
}

export const index = async (ctx) => {
  await initData(ctx)
  ctx.render({ body: Index })
}

export const show = async (ctx) => {
  if (!state.get('allMembers').length) await initData(ctx)
  state.set('member', find(state.get('members'), { _id: ctx.params.id }))
  ctx.render({ body: Index })
}

export const filterMembers = async (attrs) => {
  state.set('curFilter', values(attrs)[0])
  state.set('members', filter(state.get('allMembers'), attrs))
}

export const filterMembersByTeam = async (team) => {
  state.set('members', filter(state.get('allMembers'), { team: team }))
}

export const searchMembers = (term) => {
  state.unset('curFilter')
  state.set('members', filter(state.get('allMembers'), (member) =>
    member.name.match(new RegExp(term, 'i'))
  ))
}
