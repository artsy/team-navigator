import veact from 'veact'
import { state } from '../../controllers'
import { type, mediumMargin, purpleRegular, teamNameToID } from '../lib'
import { assign, sortBy, filter, groupBy } from 'lodash'

const view = veact()

const { div, h2, ul, li, a, span } = view.els()

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
  },
  count: {
    color: '#a0a0a0'
  }
})

const extraLinks = [
  {
    name: "NYC OfficeSpace", 
    url: "https://artsy.officespacesoftware.com/visual-directory/floors/4"
  }, { 
    name: "LDN OfficeSpace", 
    url: "https://artsy.officespacesoftware.com/visual-directory/floors/11"
  }, {
    name: 'Atlas',
    href: 'https://sites.google.com/a/artsymail.com/intranet/'
  }, {
    name: 'Who is New?',
    href: '/who-is-new'
  }, {
    name: 'Did you know?',
    href: '/did-you-know'
  }
]

view.render(() => {
  const highlights = state.get('highlightTeams')
  const standouts = state.get('standoutSubTeams')
  const team = Array.from(new Set(filter(sortBy([...standouts, ...state.get('teams')]), team => !highlights.teams.includes(team))))

  const orgBreakdown = groupBy(state.get('allMembers'), ({ org }) => org)
  const cityBreakdown = groupBy(state.get('allMembers'), ({ city }) => city);

  const teamSize = team => state.get('allMembers').filter(member => member.team === team).length

  return div(
    h2('.h2', 'Links'),
    ul('.ul', extraLinks.map(link =>
      a({ href: link.href },
        li('.li', link.name)
      )))))


    h2('.h2', 'Locations'),
    ul('.ul', sortBy(Object.keys(cityBreakdown)).map(city =>
      li('.li',
        a({
          href: `/location/${city}`,
          style: { color: city === state.get('curFilter') ? purpleRegular : '' }
        }, city),
        span('.count', ` (${cityBreakdown[city].length})`)
      )),

    div(Object.keys(orgBreakdown).length > 0 ? div (
      h2('.h2', 'Organizations'),
      ul('.ul', sortBy(Object.keys(orgBreakdown)).map(org =>
        li('.li', 
          a({ href: `/org/${teamNameToID(org)}`,
            style: {
              color: org === state.get('org') ? purpleRegular : ''
            }
          }, org),
          span('.count', ` (${orgBreakdown[org].length})`)
      )))
    ): ''),

    div(highlights ? div(
      h2('.h2', highlights.name),
      ul('.ul', sortBy(highlights.teams).map(team =>
          li('.li', 
        a({ href: `/team/${teamNameToID(team)}`,
            style: {
              color: team === teamNameToID(state.get('team')) ? purpleRegular : ''
            }
          }, team),
          span('.count', ` (${teamSize(team)})`)
        ))),
    ) : ''),

    h2('.h2', 'Teams'),
    ul('.ul', team.filter(t => t).map(team =>
        li('.li',
          a({ href: `/team/${teamNameToID(team)}`,
          style: {
            color: team === teamNameToID(state.get('team')) ? purpleRegular : ''
          }
        }, team),
          span('.count', ` (${teamSize(team)})`)
      ))),
})

export default view()
