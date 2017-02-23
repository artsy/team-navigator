import Lokka from 'lokka'
import Transport from 'lokka-transport-http'
import tree from 'universal-tree'
import Index from '../views'
import { filter, values, find, startCase, camelCase, uniq, flatten } from 'lodash'

// As we're making real API calls through node, we need to allow it to get through auth
const { INTERNAL_REQUESTS_HEADER_SECRET } = process.env

const api = new Lokka({
  transport: new Transport(process.env.APP_URL + '/api', { headers: { 'secret': INTERNAL_REQUESTS_HEADER_SECRET } })
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
        namePronounciation
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
        teamRank
        startDate
        slackHandle
        slackID
        slackPresence
        githubHandle
        githubHistory
        feedbackFormUrl
        writerAuthorId
        articleHistory {
          href
          name
        }
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
  state.unset('subtitles')
  state.set('title', values(attrs)[0])
}

export const searchMembers = (term) => {
  state.unset('curFilter')
  state.unset('team')
  state.unset('subtitles')
  state.set('members', filter(state.get('allMembers'), (member) =>
    member.name.match(new RegExp(term, 'i')) ||
    member.team.match(new RegExp(term, 'i')) ||
    member.subteam.match(new RegExp(term, 'i')) ||
    member.subteam.match(new RegExp(term, 'i')) ||
    member.title.match(new RegExp(term, 'i'))
  ))
  state.set('format', 'alphabetical')
  state.set('title', `Searching for ${term}`)
}

const membersForTeam = (teamID) => {
  const mainTeam = filter(state.get('allMembers'), { teamID: teamID })
  const subTeam = filter(state.get('allMembers'), { subteamID: teamID })
  const productTeam = filter(state.get('allMembers'), { productTeamID: teamID })
  return uniq([...mainTeam, ...subTeam, ...productTeam])
}

const reporteesForUser = (member) => filter(state.get('allMembers'), m => m.reportsTo === member.name)
const getReporteeTreeForUser = (member) => {
  const reportees = reporteesForUser(member)
  return flatten([...reportees, ...reportees.map(getReporteeTreeForUser)])
}

const setupForTeam = teamID => {
  state.set('team', teamID)
  state.set('members', membersForTeam(teamID))

  const prettyTeam = startCase(camelCase(teamID))
  state.set('title', `Members of ${prettyTeam}`)

  state.set('subtitles', [
    { title: 'Teams', href: `/team/${teamID}` },
    { title: 'Reporting Structure', href: `/team/${teamID}/tree` }
  ])
}

export const showTeam = async (ctx) => {
  if (!state.get('allMembers').length) await initData(ctx)

  setupForTeam(ctx.params.team)
  state.set('format', 'subteams')

  ctx.render({ body: Index })
}

export const showTeamTree = async (ctx) => {
  if (!state.get('allMembers').length) await initData(ctx)

  setupForTeam(ctx.params.team)
  state.set('format', 'tree')

  ctx.render({ body: Index })
}

export const showMemberTree = async (ctx) => {
  if (!state.get('allMembers').length) await initData(ctx)

  const member = find(state.get('members'), { handle: ctx.params.handle })
  state.set('member', member)
  state.set('members', flatten(getReporteeTreeForUser(member)))
  state.set('format', 'tree')
  state.unset('subtitles')

  state.set('title', `Reportees of ${member.name}`)
  ctx.render({ body: Index })
}
