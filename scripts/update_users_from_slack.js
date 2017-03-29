// Updates the user details of everyone inside the MongoDB via Slack's API

import { find } from 'lodash'

const Slack = require('slack-api').promisify()

const { SLACK_AUTH_TOKEN } = process.env

export default async (db) => {
  const response = await Slack.users.list({ token: SLACK_AUTH_TOKEN, presence: true })
  const slackMembers = response.members

  const profileFieldsResponse = await Slack.team['profile.get']({ token: SLACK_AUTH_TOKEN })
  const profileFields = profileFieldsResponse.profile.fields

  const getDetailsForLabel = (label, memberFields) => {
    const field = find(profileFields, field => field.label === label)
    return memberFields && memberFields[field.id]
  }

  const allMembers = await db.members.find().toArray()

  allMembers.forEach(async member => {
    const slackMember = find(slackMembers, m => m.profile && m.profile.email && m.profile.email.startsWith(member.email))
    if (!slackMember || !slackMember.presence) { return }

    const profile = await Slack.users['profile.get']({ token: SLACK_AUTH_TOKEN, user: member.slackID })

    // This will look up a field based on it's label, return { value: x, alt: y }
    const facebook = getDetailsForLabel('Facebook', profile.profile.fields) || {}
    const instagram = getDetailsForLabel('Instagram', profile.profile.fields) || {}
    const twitter = getDetailsForLabel('Twitter', profile.profile.fields) || {}
    const website = getDetailsForLabel('Website', profile.profile.fields) || {}

    await db.members.update({ _id: member._id }, { $set: {
      // Timezone comes in as an offset from UTC
      timeZone: slackMember.tz,
      timeZoneLabel: slackMember.tz_label,
      timeZoneOffset: slackMember.tz_offset,
      // Profile settings
      slackProfile: {
        facebook: facebook.alt,
        facebook_url: facebook.value,
        instagram: instagram.alt,
        instagram_url: instagram.value,
        twitter: twitter.alt,
        twitter_url: twitter.value,
        website: website.alt,
        website_url: website.value
      }
    } })
  })
}
