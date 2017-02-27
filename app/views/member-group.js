import veact from 'veact'
import {
  type, smallMargin, mediumMargin, largeMargin, grayRegular, ellipsisize, graySemibold
} from './lib'
import { assign } from 'lodash'
import url from 'url'
import { state } from '../controllers'
import moment from 'moment'

const view = veact()

const headshotSize = 75
const { div, h2, p, a } = view.els()

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
    marginBottom: largeMargin
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
    width: '390px'
  },
  title: ellipsisize(),
  memberName: {
    fontWeight: 'bold'
  },
  location: {
    color: graySemibold
  }
})

const prettyDate = startDate => moment(startDate).format('MMM DD')

view.render(({ members, title, shortTitles }) => {
  const titleClass = shortTitles ? '.h3' : '.h1'
  const format = state.get('format')

  return div('.container',
    h2(titleClass, title),
    div(members.map(member => {
      const src = url.parse(member.headshot).pathname
      const floorOrNothing = member.floor ? `, Fl. ${member.floor}` : ''
      const subtitle = format === 'seniority' ? prettyDate(member.startDate) : `${member.city}${floorOrNothing}`

      return a('.wrapper', { key: member.email, href: `/member/${member.handle}` },
        div('.headshot', {
          style: { backgroundImage: `url(/img${src})` }
        }),
        div('.text',
          p('.memberName', member.name),
          p('.title', member.title),
          p('.location', subtitle))
        )
    })))
})

export default view()
