import { mutation, string, db } from 'joiql-mongo'
import request from 'superagent'
import { Converter } from 'csvtojson'
import { camelCase, mapKeys, find } from 'lodash'
import { teamNameToID } from '../views/lib'

const Slack = require('slack-api').promisify()

const { SHEETS_URL, SLACK_AUTH_TOKEN } = process.env

const converter = new Converter()
const convert = (data) =>
new Promise((resolve, reject) => {
  converter.fromString(data, (err, json) => {
    if (err) reject(err)
    else resolve(json)
  })
})

export default mutation('sync', string(), async (ctx) => {
// Remove old entries
  await db.members.remove()

const response = await Slack.users.list({ token: SLACK_AUTH_TOKEN })
const slackMembers = response.members

const res = await request.get(SHEETS_URL)
const parsed = await convert(res.text)
const members = parsed
  .map((obj) => mapKeys(obj, (v, k) => camelCase(k)))
  .map((member) => {
    
    // Use email prefix as a global handle for pretty URLs
    member.handle = member.email.replace('@', '')
    
    // Generate a team ID for URLs
    member.teamID = teamNameToID(member.team)
    member.subteamID = teamNameToID(member.subteam)
    member.productTeamID = teamNameToID(member.productTeam)
    
    // Hook Up Slack IDs
    const slackMember = find(slackMembers, m => m.profile && m.profile.email && m.profile.email.startsWith(member.email))
    if (slackMember) { member.slackID = slackMember.id }
    else { console.error(`Could not find Slack ID for ${member.name}`) }
    
    return member
  })

  await Promise.all(members.map((member) => db.members.save(member)))
  ctx.res.sync = 'success'
})
