import veact from 'veact'
import { state, filterMembersByTeam } from '../../controllers'
import { type, graySemibold } from '../lib'
import { assign } from 'lodash'

const view = veact()

const { div, h2, h3, a, p } = view.els()

view.styles({
  h2: assign(
    type('garamond', 'body'),
    {
      marginBottom: 10,
      fontWeight: 'bold'
    }
  ),
  h3: assign(
    type('garamond', 'body'),
    {
      marginTop: 10,
      fontWeight: 'bold'
    }
  ),
  backButton: assign(
    type('avantgarde', 'body'),
    {
      color: graySemibold,
      paddingTop: '15px',
      paddingBottom: '15px',
      borderTop: `1px solid ${graySemibold}`,
      borderBottom: `1px solid ${graySemibold}`,
      marginBottom: '30px',
      display: 'block'
    }
  )
})

view.render(() =>
  div(
    a('.backButton', { href: '/' }, 'Back'),
    h2('.h2', state.get('member').name),
    p(state.get('member').title),
    p(`${state.get('member').city}, Fl. ${state.get('member').floor}`),
    div({
      onClick: () => filterMembersByTeam(state.get('member').team)
    }, `View ${state.get('member').name}'s team`),
    h3('.h3', 'Reports to'),
    p(state.get('member').reportsTo)
  )
)

export default view()
