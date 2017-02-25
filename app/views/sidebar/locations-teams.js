import veact from 'veact'
import { state, filterMembers } from '../../controllers'
import { type, mediumMargin, purpleRegular, teamNameToID } from '../lib'
import { assign, sortBy, filter } from 'lodash'

const view = veact()

const { div, h2, ul, li, br, a } = view.els()

view.styles({
  h2: assign(
    type('avantgarde', 'smallHeadline'),
    { marginTop: 30, marginBottom: 4 }
  ),
  ul: type('garamond', 'body'),
  br: {
    height: mediumMargin
  },
  li: {
    cursor: 'pointer'
  }
})

view.render(() => {
  console.log(state)
  const highlights = state.get('highlightTeams')
  const standouts = state.get('standoutSubTeams')
  const team = filter(sortBy([...standouts, ...state.get('teams')]), team => !highlights.teams.includes(team))
  return div(
    h2('.h2', 'Locations'),
    ul('.ul', sortBy(state.get('cities')).map(city =>
      li('.li', {
        onClick: () => filterMembers({ city }),
        style: { color: city === state.get('curFilter') ? purpleRegular : '' }
      }, city))),
    br('.br'),
    div(highlights ? div(
      h2('.h2', highlights.name),
      ul('.ul', sortBy(highlights.teams).map(team =>
        a({ href: `/team/${teamNameToID(team)}` },
          li('.li', team)
        ))),
    ) : ""),
    h2('.h2', 'Teams'),
    ul('.ul', team.map(team =>
      a({ href: `/team/${teamNameToID(team)}` },
        li('.li', team)
      ))))
  }
)

export default view()
