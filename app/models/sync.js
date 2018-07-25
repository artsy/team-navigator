import { mutation, string, db } from 'joiql-mongo'
import request from 'superagent'
import { Converter } from 'csvtojson'
import { camelCase, mapKeys, find } from 'lodash'
import { teamNameToID } from '../views/lib'

const Slack = require('slack-api').promisify()

const { SHEETS_URL, SEATING_URL, LINKS_URL, MESSAGES_URL, SLACK_AUTH_TOKEN } = process.env

const convert = (data) =>
  new Promise((resolve, reject) => {
    new Converter().fromString(data, (err, json) => {
      if (err) reject(err)
      else resolve(json)
    })
  })

const updateTeamRanks = (members) => {
  members.forEach(m => {
    m.teamRank = getNumberOfManagers(members, m, 0)
  })
}

const getNumberOfManagers = (members, member, depth) => {
  if (depth > 10) {
    console.log(`[Sync] Looped too many times for ${JSON.stringify(member)} returning null`)
    return null
  }
  if (!getManager(members, member)) { return depth }
  return getNumberOfManagers(members, getManager(members, member), depth + 1)
}

const getManager = (members, member) => find(members, (m) => m.name === member.reportsTo)

const updateTeamMembers =  async () => {
  console.log("[Sync] Starting")
  console.log("[Sync] Removing all users")
  // Remove old entries
  await db.members.remove()

  const seats = await db.seatings.find().toArray()
  
  console.log("[Sync] Grabbing slack users")
  const response = await Slack.users.list({ token: SLACK_AUTH_TOKEN })
  const slackMembers = response.members

  console.log(`[Sync] Grabbing CSV from Google Sheets at ${SHEETS_URL}`)
  const res = await request.get(SHEETS_URL)
  const parsed = await convert(res.text)

  const peeps = parsed.filter(obj => !!obj.name)
  console.log(`[Sync] Setting up ${peeps.length} members`)
  console.log(`[Sync] First item: ${JSON.stringify(peeps[0])}`)

  const members = peeps
  .map((obj) => mapKeys(obj, (v, k) => camelCase(k)))
  .map((member) =>  {
    // Use email prefix as a global handle for pretty URLs
    member.handle = member.email.replace('@', '')

    // Generate a team ID for URLs
    member.teamID = teamNameToID(member.team)
    member.subteamID = teamNameToID(member.subteam)
    member.productTeamID = teamNameToID(member.productTeam)

    // Hook Up Slack IDs
    const slackMember = find(slackMembers, m => m.profile && m.profile.email && m.profile.email.startsWith(member.email))
    if (slackMember) { member.slackID = slackMember.id } else { console.error(`Could not find Slack ID for ${member.name}`) }

    // Find a seat and update it if we need to
    member.seat = find(seats, s => s.id === member.seat)
    if (member.seat) {
       db.seatings.update({ _id: member.seat._id }, { $set: { 
        occupier_name: member.handle,
        occupier_handle: member.handle 
      } })
      member.floor_id = member.seat.floor_id
    }

    return member
  })

  console.log("[Sync] Updating Team Ranks")
  updateTeamRanks(members)

  console.log("[Sync] Saving")
  await Promise.all(members.map((member) => db.members.save(member)))
  console.log(`[Sync] Saved ${members.length} members`)
}

const updateTeamSeating = async () => {
  await db.seatings.remove()
  
  const res = await request.get(SEATING_URL)
  const parsed = await convert(res.text)

  const seats = parsed.map(f => ({
    id: f.seat_id,
    url: f.floor_plan_url,
    name: f.floor_name,
    floor_id: f.floor_name && teamNameToID(f.floor_name),
    x: f.x,
    y: f.y,
    status: f.status
  }))

  await Promise.all(seats.map((seat) => db.seatings.save(seat)))  
}

const updateMessages = async () => {
  if (!MESSAGES_URL) {
    return
  }

  await db.messages.remove()
  
  const res = await request.get(MESSAGES_URL)
  const parsed = await convert(res.text)

  const messages = parsed.map(m => ({
    id: m.message,
    message: m.message,
    tags: m.tags,
  }))

  await Promise.all(messages.map((m) => db.messages.save(m)))
}

const updateLinks = async () => {
  if (!LINKS_URL) {
    return
  }

  await db.links.remove()
  
  const res = await request.get(LINKS_URL)
  const parsed = await convert(res.text)

  const links = parsed.map(l => ({
    id: l.link,
    href: l.href,
    tags: l.tags,
    time: l.time,
    name: l.name,
    type: l.type
  }))

  await Promise.all(links.map((l) => db.links.save(l)))
}

export default mutation('sync', string(), async (ctx) => {
  await updateTeamSeating()
  await updateTeamMembers()
  await updateMessages()
  await updateLinks()
  ctx.res.sync = 'success'
})
