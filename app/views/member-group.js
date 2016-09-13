import veact from 'veact'
import {
  type, smallMargin, mediumMargin, largeMargin, grayRegular, ellipsisize
} from './lib'
import { assign } from 'lodash'

const view = veact()

const headshotSize = 75
const { div, h1, p } = view.els()

view.styles({
  h1: assign(
    type('garamond', 'largeHeadline'),
    { margin: `${smallMargin}px 0` }
  ),
  container: {
    borderTop: `1px solid ${grayRegular}`,
    marginTop: largeMargin
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
    width: `calc(100% - ${headshotSize + 10}px)`
  }),
  wrapper: {
    marginBottom: mediumMargin,
    display: 'inline-block',
    width: '50%'
  },
  title: ellipsisize()
})

view.render(({ members, title }) =>
  div('.container',
    h1('.h1', title),
    div(members.map((member) =>
      div('.wrapper',
        div('.headshot', {
          style: { backgroundImage: `url(${member.headshot})` }
        }),
        div('.text',
          p(member.name),
          p('.title', member.title),
          p(`${member.city}, Fl. ${member.floor}`))
        ))))
)

export default view()
