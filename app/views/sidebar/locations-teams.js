import veact from 'veact'
import { state, filterMembers } from '../../controllers'
import { type, mediumMargin, purpleRegular, teamNameToID } from '../lib'
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

// These are not true "top level" teams, but are important enough to 
// warrent inclusion in the results
const extraTeams = ["Design", "Performance Marketing", "Collector Experience & GMV", "Partner Success & Revenue"]

view.render(() =>
  div(
    h2('.h2', 'Locations'),
    ul('.ul', state.get('cities').sort().map((city) =>
      li('.li', {
        onClick: () => filterMembers({ city }),
        style: { color: city === state.get('curFilter') ? purpleRegular : '' }
      }, city))),
    br('.br'),
    h2('.h2', 'Teams'),
    ul('.ul', [...extraTeams, ...state.get('teams')].sort().map((team) =>
      a({ href: `/team/${teamNameToID(team)}` },
        li('.li', team)
      ))))
)

export default view()
