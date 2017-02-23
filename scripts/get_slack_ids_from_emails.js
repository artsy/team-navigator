// node -r dotenv/config -r babel-core/register scripts/get_slack_ids_from_emails.js

// Prints a C&Pable list of all slack IDs to their corresponding email addresses
// so you could optionally include it inside a spreadsheet

import request from 'superagent'
import { Converter } from 'csvtojson'
import { find } from 'lodash'

const Slack = require('slack-api').promisify()

const converter = new Converter()
const { SHEETS_URL, SLACK_AUTH_TOKEN } = process.env

const convert = (data) =>
new Promise((resolve, reject) => {
  converter.fromString(data, (err, json) => {
    if (err) reject(err)
    else resolve(json)
  })
})

const run = async () => {
  const res = await request.get(SHEETS_URL)
  const csvMembers = await convert(res.text)

  const response = await Slack.users.list({ token: SLACK_AUTH_TOKEN })
  const slackMembers = response.members

  csvMembers.forEach((member) => {
    const slackMember = find(slackMembers, m => m.profile && m.profile.email && m.profile.email.startsWith(member.email))
    if (slackMember) {
      console.log(slackMember.id)
    } else {
      console.log('')
    }
  })
}

run()
