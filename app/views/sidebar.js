import veact from 'veact'
import { state } from '../controllers'
import { type, mediumMargin, grayRegular, sidebarWidth } from './lib'
import { assign } from 'lodash'

const view = veact()

const { div, h2, ul, li, br } = view.els()

view.styles({
  h2: assign(
    type('avantgarde', 'smallHeadline'),
    { marginBottom: 10 }
  ),
  ul: type('garamond', 'body'),
  container: {
    padding: mediumMargin,
    width: sidebarWidth,
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'top'
  },
  br: {
    height: mediumMargin
  }
})

view.render(() =>
  div('.container',
    h2('.h2', 'Locations'),
    ul('.ul', state.get('cities').map((city) =>
      li(city))),
    br('.br'),
    h2('.h2', 'Teams'),
    ul('.ul', state.get('teams').map((team) =>
      li(team))))
)

export default view()
