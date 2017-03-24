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

const view = veact()
const headshotSize = 100

const { SLACK_TEAM_ID } = process.env

const { div, h2, h3, nav, a, p } = view.els()

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
    borderBottom: `1px solid ${grayRegular}`,
    display: 'block',
    padding: '20px 0',
    color: purpleRegular
  },
  reporting: {
    display: 'block',
    marginTop: 6,
    color: '#777'
  }
})

view.render(() => {
  const member = state.get('member')
  const src = url.parse(member.headshot).pathname
  const noDLhref = member.headshot.replace('?dl=1', '')
  const floorOrNothing = member.floor ? `, Fl. ${member.floor}` : ''
  const reportees = state.get('allMembers').filter(reportee => reportee.reportsTo === member.name)
  const slackClickLink = `slack://user?team=${SLACK_TEAM_ID}&id=${member.slackID}`
  const calendarLink = `https://calendar.google.com/calendar/embed?src=${member.email}artsymail.com&ctz=America/New_York`
  const mailTo = `mailto:${member.email}artsymail.com`
  const github = `https://github.com/${member.githubHandle}`
  const reportsTo = member.reportsTo && find(state.get('allMembers'), { 'name': member.reportsTo })

  return div(
      a('.backButton', { href: '/' }, 'Back'),
      a('.headshotLink', {href: noDLhref},
        div('.headshot', { style: { backgroundImage: `url(/img${src})` } }),
      ),
      div('.bio',
        h2('.h2', member.name),
        member.namePronounciation ? p('.job', `Pronounced: ${member.namePronounciation}`) : '',
        p('.job', member.title),
        p('.location', `${member.city}${floorOrNothing}`),
        nav('.nav', [
          a('.navItemChat', { href: slackClickLink, dangerouslySetInnerHTML: { __html: member.slackPresence ? activeChat : chat } }),
          a('.navItem', { href: mailTo, dangerouslySetInnerHTML: { __html: email } }),
          a('.navItem', { href: calendarLink, dangerouslySetInnerHTML: { __html: calendar } }),
          member.githubHandle ? a('.navItem', { href: github, dangerouslySetInnerHTML: { __html: githubCat } }) : ''
        ]),
      ),
      p('.role', member.roleText),
      div('.nav', [
        member.startDate ? p('.location', `Joined: ${moment(member.startDate).fromNow()}`) : '',
        member.timeZone ? p('.location', `Time Zone: ${member.timeZone}`) : ''
      ]),
      member.feedbackFormUrl ? a('.feedback', { href: member.feedbackFormUrl }, `Click to give ${member.name} feedback`) : '',
      h3('.h3', 'Teams'),
      a('.wrapper', { href: `/team/${member.teamID}`, style: { display: 'block' } }, member.team),
      member.productTeamID ? a('.wrapper', { href: `/team/${member.productTeamID}`, style: { display: 'block' } }, member.productTeam) : '',
      div(reportees.length
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
      div(member.githubHandle && member.githubHistory
        ? div(
            h3('.h3', 'Recent GitHub Repos'),
              member.githubHistory.map(repo =>
                a('.wrapper', { href: `https://github.com/${repo}`, style: { display: 'block' } }, repo))
          )
        : ''
      ),
      div(member.writerAuthorId && member.articleHistory
        ? div(
            h3('.h3', 'Recent Published Articles'),
              member.articleHistory.map(article =>
                a('.wrapper', { href: `https://artsy.net/${article.href}`, style: { display: 'block' } }, article.name))
          )
        : ''
      )

    )
}
)

export default view()
