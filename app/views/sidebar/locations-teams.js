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

// Support per-project custom teams etc
const { STANDOUT_SUBTEAMS, HIGHLIGHT_TEAM_NAME, HIGHLIGHT_TEAMS} = process.env

const extraTeams = STANDOUT_SUBTEAMS.split(",")
const highlightTeams = HIGHLIGHT_TEAMS.split(",")

view.render(() => {
  const team = filter(sortBy([...extraTeams, ...state.get('teams')]), team => !highlightTeams.includes(team))
  return div(
    h2('.h2', 'Locations'),
    ul('.ul', sortBy(state.get('cities')).map(city =>
      li('.li', {
        onClick: () => filterMembers({ city }),
        style: { color: city === state.get('curFilter') ? purpleRegular : '' }
      }, city))),
    br('.br'),
    h2('.h2', HIGHLIGHT_TEAM_NAME),
    ul('.ul', sortBy(highlightTeams).map(team =>
      a({ href: `/team/${teamNameToID(team)}` },
        li('.li', team)
      ))),
    h2('.h2', 'Teams'),
    ul('.ul', team.map(team =>
      a({ href: `/team/${teamNameToID(team)}` },
        li('.li', team)
      ))))
  }
)

export default view()
