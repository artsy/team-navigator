import { model, array, string, boolean, number, query, db, object } from 'joiql-mongo'

export const member = model('member', {
  name: string(),
  namePronounciation: string(),
  handle: string(),
  title: string(),
  team: string(),
  teamID: string(),
  subteam: string(),
  subteamID: string(),
  productTeam: string(),
  productTeamID: string(),
  reportsTo: string(),
  teamRank: string(),
  email: string(),
  city: string(),
  country: string(),
  floor: string(),
  phone: string(),
  birthday: string(),
  startDate: string(),
  headshot: string(),
  roleText: string(),
  introEmail: string(),
  personalBio: string(),
  feedbackFormUrl: string(),
  notes: string(),
  slackHandle: string(),
  slackID: string(),
  slackPresence: boolean(),
  githubHandle: string(),
  githubHistory: array().items(string()),
  writerAuthorId: string(),
  articleHistory: array().items(object({
    name: string(),
    href: string()
  })),
  timeZone: string(),
  timeZoneOffset: number(),
  timeZoneLabel: string()
})

export const teams = query('teams', array().items(string()),
  async (ctx, next) => {
    ctx.res.teams = await db.members.distinct('team')
    await next()
  }
)

export const cities = query('cities', array().items(string()),
  async (ctx, next) => {
    ctx.res.cities = await db.members.distinct('city')
    await next()
  }
)

const {
  STANDOUT_SUBTEAMS,
  HIGHLIGHT_TEAM_NAME,
  HIGHLIGHT_TEAMS
} = process.env

export const highlightTeams = query('highlightTeams', object({
  name: string(),
  teams: array().items(string())
}),
  async (ctx, next) => {
    ctx.res.highlightTeams = {
      name: HIGHLIGHT_TEAM_NAME || '',
      teams: HIGHLIGHT_TEAMS ? HIGHLIGHT_TEAMS.split(',') : []
    }
    await next()
  }
)

export const standoutSubTeams = query('standoutSubTeams', array().items(string()),
  async (ctx, next) => {
    ctx.res.standoutSubTeams = STANDOUT_SUBTEAMS ? STANDOUT_SUBTEAMS.split(',') : []
    await next()
  }
)
