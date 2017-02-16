import veact from 'veact'
import { state, filterMembers } from '../../controllers'
import { type, mediumMargin, purpleRegular } from '../lib'
import { assign } from 'lodash'

const view = veact()

const { div, h2, ul, li, br, a } = view.els()

view.styles({
  h2: assign(
    type('avantgarde', 'smallHeadline'),
    { marginBottom: 10 }
  ),
  ul: type('garamond', 'body'),
  br: {
    height: mediumMargin
  },
  li: {
    cursor: 'pointer'
  }
})

view.render(() =>
  div(
    h2('.h2', 'Locations'),
    ul('.ul', state.get('cities').map((city) =>
      li('.li', {
        onClick: () => filterMembers({ city }),
        style: { color: city === state.get('curFilter') ? purpleRegular : '' }
      }, city))),
    br('.br'),
    h2('.h2', 'Teams'),
    ul('.ul', state.get('teams').map((team) =>
      a({ href: `/team/${team.toLowerCase().replace(' ', '-').replace(',', '-')}` },
        li('.li', team)
      ))))
)

export default view()
