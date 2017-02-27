import veact from 'veact'
import { state, filterMembers } from '../../controllers'
import { type, mediumMargin, purpleRegular, teamNameToID } from '../lib'
import { assign, sortBy, filter } from 'lodash'

const view = veact()

const { div, h2, ul, li, a } = view.els()

view.styles({
  h2: assign(
    type('avantgarde', 'smallHeadline'), { marginTop: 30, marginBottom: 4 }
  ),
  ul: type('garamond', 'body'),
  br: {
    height: mediumMargin
  },
  li: {
    cursor: 'pointer'
  }
})

const extraLinks = [{
  name: 'Who is New?',
  href: '/who-is-new'
}]

view.render(() => {
  console.log(state.get('team'))
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

    div(highlights ? div(
      h2('.h2', highlights.name),
      ul('.ul', sortBy(highlights.teams).map(team =>
        a({ href: `/team/${teamNameToID(team)}` },
          li('.li', { style: { color: team === teamNameToID(state.get('team')) ? purpleRegular : '' } }, team)
        ))),
    ) : ''),

    h2('.h2', 'Teams'),
    ul('.ul', team.map(team =>
      a({ href: `/team/${teamNameToID(team)}` },
        li('.li', { style: { color: team === teamNameToID(state.get('team')) ? purpleRegular : '' } }, team)
      ))),

    h2('.h2', 'Links'),
    ul('.ul', extraLinks.map(link =>
      a({ href: link.href },
        li('.li', link.name)
      ))))
})

export default view()
