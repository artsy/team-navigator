// node -r dotenv/config -r babel-core/register scripts/update_presence.js

// Updates the presence of everyone inside the MongoDB via Slack's API

import { find } from 'lodash'
import pmongo from 'promised-mongo'

const Slack = require('slack-api').promisify()

const { MONGO_URL, SLACK_AUTH_TOKEN } = process.env

export default async () => {
  const response = await Slack.users.list({ token: SLACK_AUTH_TOKEN, presence: true })
  const slackMembers = response.members
  
  const db = pmongo(MONGO_URL, ["members"])  
  const allMembers = await db.members.find().toArray()
  db.close()

  allMembers.forEach(async member => {
    const slackMember = find(slackMembers, m => m.profile && m.profile.email && m.profile.email.startsWith(member.email))
    if(!slackMember || !slackMember.presence) { return }
    
    const here = slackMember.presence !== "away"
   
    await db.members.update({ _id: member._id }, { $set: { slackPresence: here} })
  })
}
