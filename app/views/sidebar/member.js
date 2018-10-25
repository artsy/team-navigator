import veact from 'veact'
import { assign, find } from 'lodash'
import url from 'url'
import moment from 'moment'
import { readFileSync } from 'fs'
import path from 'path'

import { state } from '../../controllers'
import { type, borderedButton, grayRegular, purpleRegular } from '../lib'

const email = readFileSync(path.join(__dirname, 'email.svg'))
const calendar = readFileSync(path.join(__dirname, 'calendar.svg'))
const chat = readFileSync(path.join(__dirname, 'chat.svg'))
const activeChat = readFileSync(path.join(__dirname, 'active-chat.svg'))
const githubCat = readFileSync(path.join(__dirname, 'github-cat.svg'))
const audioIcon = readFileSync(path.join(__dirname, 'audio.svg'))

const view = veact()
const headshotSize = 100

const { SLACK_TEAM_ID } = process.env

const { div, span, h2, h3, nav, a, p, audio, source } = view.els()

const externalLinkIcon = span({ dangerouslySetInnerHTML: { __html: readFileSync(path.join(__dirname, 'external-link.svg')) } })
const extenalLinkProperties = { target: '_blank', rel: 'noopener' }

view.styles({
  h2: assign(
    type('garamond', 'body'),
    {
      marginBottom: 0,
      fontWeight: 'bold'
    }
  ),
  h3: assign(
    type('garamond', 'body'),
    {
      marginTop: 10,
      fontWeight: 'bold'
    }
  ),
  backButton: assign(
    type('avantgarde', 'body'),
    borderedButton(),
    {
      marginTop: 0,
      borderTop: 'none'
    }
  ),
  teamButton: assign(
    type('avantgarde', 'body'),
    borderedButton(),
    {
      cursor: 'pointer',
      marginTop: 20
    }
  ),
  location: {
    marginTop: 4,
    color: '#777'
  },
  list: {
    color: '#777',
    margin: '8px 0'
  },
  grey: {
    color: '#777'
  },
  nav: {
    marginTop: 20,
    marginBottom: 20
  },
  navItem: {
    marginRight: 10
  },
  navItemChat: {
    marginRight: 10,
    marginTop: 10
  },
  wrapper: {
    display: 'block',
    paddingBottom: '10px'
  },
  headshotLink: {
    display: 'block',
    height: headshotSize,
    width: headshotSize,
    float: 'right'
  },
  headshot: {
    borderRadius: headshotSize,
    height: headshotSize,
    width: headshotSize,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 10
  },
  section: {
    paddingTop: '20px',
    paddingBottom: '20px',
    borderBottom: `1px solid ${grayRegular}`
  },
  role: {
    marginTop: 20,
    lineHeight: 1.4,
    paddingBottom: '20px',
    borderBottom: `1px solid ${grayRegular}`
  },
  bio: {
    borderBottom: `1px solid ${grayRegular}`
  },
  feedback: {
    textDecoration: 'underline',
    display: 'block',
    color: purpleRegular
  },
  reporting: {
    display: 'block',
    marginTop: 6,
    color: '#777'
  },
  audio: {
    cursor: 'pointer',
    width: '8px',
    height: '8px',
    display: 'inline-block',
    marginLeft: '8px'
  }
})

view.render(() => {
  const member = state.get('member')
  const src = url.parse(member.headshot).pathname
  const noDLhref = member.headshot.replace('?dl=1', '')
  const floorOrNothing = member.floor_id ? `, ${member.floor_id}` : ''
  const reportees = state.get('allMembers') && state.get('allMembers').filter(reportee => reportee.reportsTo === member.name)
  const slackClickLink = `slack://user?team=${SLACK_TEAM_ID}&id=${member.slackID}`
  const calendarLink = `https://calendar.google.com/calendar/embed?src=${member.email}artsymail.com&ctz=America/New_York`
  const mailTo = `mailto:${member.email}artsymail.com`
  const github = `https://github.com/${member.githubHandle}`
  const reportsTo = member.reportsTo && find(state.get('allMembers'), { 'name': member.reportsTo })
  const profile = member.slackProfile
  const playAudio = () => {
    document.getElementById('audio').play()
  }
  const nameAudio = member.nameAudioUrl ? div('.audio',
    div({ dangerouslySetInnerHTML: { __html: audioIcon }, onClick: playAudio }),
    audio({id: 'audio'}, source({src: member.nameAudioUrl, type: 'audio/mp4'}))
  ) : false

  return div(
      a('.backButton', { href: '/' }, 'Back'),
      a('.headshotLink', assign({ href: noDLhref }, extenalLinkProperties),
        div('.headshot', { style: { backgroundImage: `url(/img${src})` } }),
      ),
      div('.bio',
        h2('.h2',
          member.name,
          nameAudio
        ),
        member.namePronounciation ? p('.job', `Pronounced: ${member.namePronounciation}`) : '',
        p('.job', member.title),
        p('.location', `${member.city}${floorOrNothing}`),
        nav('.nav', [
          a('.navItemChat', { href: slackClickLink, dangerouslySetInnerHTML: { __html: member.slackPresence ? activeChat : chat } }),
          a('.navItem', { href: mailTo, dangerouslySetInnerHTML: { __html: email } }),
          a('.navItem', assign({ href: calendarLink, dangerouslySetInnerHTML: { __html: calendar } }, extenalLinkProperties)),
          member.githubHandle ? a('.navItem', assign({ href: github, dangerouslySetInnerHTML: { __html: githubCat } }, extenalLinkProperties)) : ''
        ]),
      ),
      p('.role', member.roleText),
      // Artsy Related
      div('.section', [
        member.introEmail ? p('.list', a('.grey', assign({ href: member.introEmail }, extenalLinkProperties), 'Intro Email', externalLinkIcon)) : '',
        member.startDate ? p('.list', `Joined: ${moment(member.startDate).fromNow()}`) : '',
        member.timeZone ? p('.list', `Time Zone: ${member.timeZone}`) : '',
      ]),
      // Social Related
      profile && (profile.facebook_url || profile.twitter_url || profile.instagram_url || profile.website_url)
         ? div('.section', [
           profile.facebook_url ? p('.list', a('.grey', assign({ href: profile.facebook_url }, extenalLinkProperties), `Facebook: ${profile.facebook}`, externalLinkIcon)) : '',
           profile.twitter ? p('.list', a('.grey', assign({ href: profile.twitter_url }, extenalLinkProperties), `Twitter: @${profile.twitter}`, externalLinkIcon)) : '',
           profile.instagram ? p('.list', a('.grey', assign({ href: profile.instagram_url }, extenalLinkProperties), `Instagram: @${profile.instagram}`, externalLinkIcon)) : '',
           profile.website ? p('.list', a('.grey', assign({ href: profile.website_url }, extenalLinkProperties), `Site ${profile.website}`,  externalLinkIcon)) : ''
         ]) : '',
      div('.section', [
        member.feedbackFormUrl ? a('.feedback', assign({ href: member.feedbackFormUrl }, extenalLinkProperties), `Click to give ${member.name} feedback`, externalLinkIcon) : ''
      ]),
      h3('.h3', 'Teams'),
      a('.wrapper', { href: `/team/${member.teamID}`, style: { display: 'block' } }, member.team),
      member.productTeamID ? a('.wrapper', { href: `/team/${member.productTeamID}`, style: { display: 'block' } }, member.productTeam) : '',
      div(reportees && reportees.length
        ? div(
            h3('.h3', 'Reportees'),
              reportees.map(reportee =>
                a('.wrapper', { href: `/member/${reportee.handle}`, style: { display: 'block' } }, reportee.name)),
            a('.reporting', { href: `/member/${member.handle}/reportees` }, 'Show Reporting Structure')
          )
      : ''
      ),
      div(reportsTo
        ? div(
            h3('.h3', 'Reports to'),
            a('.wrapper', { href: `/member/${reportsTo.handle}` }, state.get('member').reportsTo)
          )
        : ''
      ),
      // Temporarily disabled
      // div(member.seat 
      //   ? div('.section', [
      //     member.seat ? p('.list', a('.grey', {href: `/seating/${member.seat.floor_id}/${member.handle}` }, member.seat.name)) : '',
      //   ])
      //   : ''
      // ),
      div(member.githubHandle && member.githubHistory
        ? div(
            h3('.h3', 'Recent GitHub Repos'),
              member.githubHistory.map(repo =>
                a('.wrapper', assign({ href: `https://github.com/${repo}`, style: { display: 'block' } }, extenalLinkProperties), repo, externalLinkIcon)
              )
          )
        : ''
      ),
      div(member.writerAuthorId && member.articleHistory
        ? div(
            h3('.h3', 'Recent Published Articles'),
              member.articleHistory.map(article =>
                a('.wrapper', assign({ href: `https://artsy.net/${article.href}`, style: { display: 'block' } }, extenalLinkProperties), article.name, externalLinkIcon)
              )
          )
        : ''
      )

    )
}
)

export default view()
