// node -r dotenv/config -r babel-core/register scripts/daily_notifications.js

// Sends out messages on a daily basis

import { find } from 'lodash'
import moment from 'moment'
import pmongo from 'promised-mongo'

const { MONGO_URL, SLACK_BOT_TOKEN } = process.env
const db = pmongo(MONGO_URL, ["members"])

var SlackBot = require('slackbots');
var bot = new SlackBot({ token: SLACK_BOT_TOKEN, name: 'team-nav-bot' });

bot.on('start', async () => {
  const now = moment(new Date())
  const today = now.dayOfYear()

  const allMembers = await db.members.find().toArray()
  db.close()

  allMembers.forEach(async member => {
  
    const startDate = moment(member.startDate)
    if (startDate) {
      const inAWeek = startDate.subtract(7, "d").dayOfYear()
      if (today === inAWeek) {
        const manager = find(allMembers, (m) => m.name === member.reportsTo)
        if (manager) {
          console.log(`Sending ${manager.name} a message about ${member.name} starting on ${member.startDate}`)
          await bot.postMessageToUser(manager.slackHandle, `It is ${member.name}'s workaversary: https://team.artsy.net/member/${member.handle} in a week :tada: - they joined on ${member.startDate}`)
        }
      }
    }
  })

  bot.ws.close()
})
