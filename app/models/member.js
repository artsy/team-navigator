import { model, array, string, boolean, query, db } from 'joiql-mongo'

export const member = model('member', {
  name: string(),
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
  githubHistory: array().items(string())
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
