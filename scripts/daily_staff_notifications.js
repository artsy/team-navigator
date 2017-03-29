// Sends out messages on a daily basis

import { find } from 'lodash'
import moment from 'moment'

const { SLACK_BOT_TOKEN } = process.env

export default async (db) => {
  var SlackBot = require('slackbots')
  var bot = new SlackBot({ token: SLACK_BOT_TOKEN, name: 'team-nav-bot' })

  bot.on('start', async () => {
    const now = moment(new Date())
    const today = now.dayOfYear()

    const allMembers = await db.members.find().toArray()

    allMembers.forEach(async member => {
      const startDate = moment(member.startDate)
      if (startDate) {
        const inAWeek = startDate.subtract(7, 'd').dayOfYear()
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

  process.on('unhandledRejection', function (reason, p) {
    console.log('A promise raised an error')
    console.error(reason)
    bot.ws.close()
    process.exit()
  })
}
