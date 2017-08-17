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
  floor_id: string(),  
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
  timeZoneLabel: string(),
  slackProfile: object({
    facebook: string(),
    facebook_url: string(),
    instagram: string(),
    instagram_url: string(),
    twitter: string(),
    twitter_url: string(),
    website: string(),
    website_url: string()
  }),
  // TODO, this is wrong, there should be a way to to the existing model somehow
  seat: object({
    id: string(),
    url: string(),
    name: string(),
    x: number(),
    y: number(),
    floor_id: string(),
    status: string()
  }),
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

export const memberAppGraphQLValues = `
_id
handle
name
namePronounciation
email
introEmail
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
timeZone
timeZoneOffset
timeZoneLabel
slackProfile {
  facebook
  facebook_url
  instagram
  instagram_url
  twitter
  twitter_url
  website
  website_url
}
seat {
  id
  x
  y
  name
  url
  floor_id
}
`
