// Updates the user details of everyone inside the MongoDB via Slack's API

import { find, includes } from 'lodash'

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

    const title = getDetailsForLabel('Artsy Title', profile.profile.fields) || { value: "[]"}
    const team = getDetailsForLabel('Artsy Team', profile.profile.fields) || { value: ""}
    const subteam = getDetailsForLabel('Artsy Subteam', profile.profile.fields) || {value: ""}
    
    // https://artsy.slack.com/customize/profile
    if (title.value !== member.title || team.value !== member.team || subteam.value !== member.subteam) {
      console.log(`Updating: ${member.name}`)
      
      const titleField = find(profileFields, field => field.label === "Artsy Title").id
      const teamField = find(profileFields, field => field.label === "Artsy Team").id
      const subteamField = find(profileFields, field => field.label === "Artsy Subteam").id
      const teamNavField = find(profileFields, field => field.label === "Team Nav Page").id
      const locationField = find(profileFields, field => field.label === "Location").id

      const fields = {}
      fields[titleField] = { value: member.title, alt: member.title }

      const url = process.env.APP_URL + "/member/" + member.handle
      if(!includes(url, "localhost")) {
        fields[teamNavField] = { value: url, alt: url }
      }

      if (member.team) {
        fields[teamField] = { value: member.team, alt: member.team }
      }

      if (member.subteam) {
        fields[subteamField] = { value: member.subteam, alt: member.subteam }
      }

      if (member.floor) {
        const floorOrNothing = member.floor ? `, Fl. ${member.floor}` : ''
        const location = `${member.city}${floorOrNothing}`
        fields[locationField] = { value: location, alt: location }
      }

      const profile = JSON.stringify({ fields }, null, '')
      const params = { token: SLACK_AUTH_TOKEN, user: member.slackID, profile }

      try {
        await Slack.users['profile.set'](params)
      } catch (error) {
        console.error(error)
      }
    }

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
