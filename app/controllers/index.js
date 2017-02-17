import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import tree from 'universal-tree'
import Index from '../views'
import { filter, values, find, startCase, camelCase, uniq } from 'lodash'

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
        handle
        name
        email
        title
        floor
        city
        headshot
        team
        teamID
        subteam
        subteamID
        productTeam
        productTeamID
        reportsTo
        roleText
        startDate
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
  state.set('member', find(state.get('members'), { handle: ctx.params.handle }))
  ctx.render({ body: Index })
}

export const filterMembers = async (attrs) => {
  state.set('curFilter', values(attrs)[0])
  state.set('members', filter(state.get('allMembers'), attrs))
  state.set('format', 'alphabetical')
  state.set('title', values(attrs)[0])
}

export const filterMembersByTeam = async (team) => {
  state.set('members', filter(state.get('allMembers'), { team: team }))
  state.set('format', 'alphbetical')
  state.set('title', `Members of ${team}`)
}

export const searchMembers = (term) => {
  state.unset('curFilter')
  state.set('members', filter(state.get('allMembers'), (member) =>
    member.name.match(new RegExp(term, 'i'))
  ))
  state.set('format', 'alphabetical')
}

const membersForTeam = (teamID) => {
  const mainTeam = filter(state.get('allMembers'), { teamID: teamID })
  const subTeam = filter(state.get('allMembers'), { subteamID: teamID })
  const productTeam = filter(state.get('allMembers'), { productTeamID: teamID })
  return uniq([...mainTeam, ...subTeam, ...productTeam])
}

export const showTeam = async (ctx) => {
  if (!state.get('allMembers').length) await initData(ctx)

  state.set('team', ctx.params.team)
  state.set('members', membersForTeam(ctx.params.team))
  state.set('format', 'subteams')

  const prettyTeam = startCase(camelCase(ctx.params.team))
  state.set('title', `Members of ${prettyTeam}`)
  ctx.render({ body: Index })
}

export const showTeamTree = async (ctx) => {
  if (!state.get('allMembers').length) await initData(ctx)

  state.set('members', membersForTeam(ctx.params.team))
  state.set('format', 'tree')

  const prettyTeam = startCase(camelCase(ctx.params.team))
  state.set('title', `Members of ${prettyTeam}`)
  ctx.render({ body: Index })
}
