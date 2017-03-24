// Updates the presence of everyone inside the MongoDB via Slack's API

import { find } from 'lodash'

const Slack = require('slack-api').promisify()

const { SLACK_AUTH_TOKEN } = process.env

export default async (db) => {
  const response = await Slack.users.list({ token: SLACK_AUTH_TOKEN, presence: true })
  const slackMembers = response.members

  const allMembers = await db.members.find().toArray()

  allMembers.forEach(async member => {
    const slackMember = find(slackMembers, m => m.profile && m.profile.email && m.profile.email.startsWith(member.email))
    if (!slackMember || !slackMember.presence) { return }

    const here = slackMember.presence !== 'away'

    await db.members.update({ _id: member._id }, { $set: {
      slackPresence: here,
      timeZone: slackMember.tz,
      timeZoneLabel: slackMember.tz_label,
      timeZoneOffset: slackMember.tz_offset
    } })
  })
}
