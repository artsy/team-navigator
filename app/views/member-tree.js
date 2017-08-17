import veact from 'veact'
import {
  type, smallMargin, mediumMargin, largeMargin, grayRegular, ellipsisize, graySemibold
} from './lib'
import { state } from '../controllers'
import { assign, filter, find } from 'lodash'
import url from 'url'

const view = veact()

const headshotSize = 75
const { div, p, a } = view.els()

view.styles({
  h1: assign(
    type('garamond', 'largeHeadline'),
    { margin: `${smallMargin}px 0` }
  ),
  h3: assign(
    type('avantgarde', 'smallHeadline'),
    { margin: `${smallMargin}px 0` }
  ),
  container: {
    borderTop: `1px solid ${grayRegular}`,
    marginBottom: largeMargin,
    paddingTop: smallMargin
  },
  headshot: {
    borderRadius: headshotSize,
    height: headshotSize,
    width: headshotSize,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'inline-block',
    verticalAlign: 'top'
  },
  text: assign(type('garamond', 'body'), {
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 10,
    width: `calc(100% - ${headshotSize + 10}px)`,
    paddingRight: mediumMargin
  }),
  wrapper: {
    marginBottom: mediumMargin,
    display: 'inline-block',
    width: '50%'
  },
  title: ellipsisize(),
  memberName: {
    fontWeight: 'bold'
  },
  location: {
    color: graySemibold
  }
})

const userForName = name => find(state.get('allMembers'), { 'name': name })

export const showMember = (member, depth) => {
  const src = url.parse(member.headshot).pathname
  const floorOrNothing = member.floor ? `, Fl. ${member.floor}` : ''
  const style = { marginLeft: depth * 60, width: `calc(100% - ${depth * 60}px)` }
  return a('.wrapper', { href: `/member/${member.handle}`, style },
    div('.headshot', {
      style: { backgroundImage: `url(/img${src})` }
    }),
    div('.text',
      p('.memberName', member.name),
      p('.title', member.title),
      p('.location', `${member.city}${floorOrNothing}`))
    )
}

const showReports = (member, depth, members) => {
  const reportees = filter(members, m => m.reportsTo === member.name)
  return div(
    showMember(member, depth),
    reportees.map((reportee) => {
      return showReports(reportee, depth + 1, members)
    }))
}

view.render(({ members }) => {
  // Anyone with a reportTo who isn't in the team, might not be perfect
  // but it's a good start and seems to work for most cases. You can click on them to see their manager.
  const roots = filter(members, m => m.reportsTo && !members.includes(userForName(m.reportsTo)))

  return div('.container',
   // Recurse through the roots showing their reportees
   roots.map(root => showReports(root, 0, members))
  )
})

export default view()
