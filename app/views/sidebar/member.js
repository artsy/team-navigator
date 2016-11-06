import veact from 'veact'
import { state, filterMembersByTeam } from '../../controllers'
import { type, borderedButton } from '../lib'
import { assign, find } from 'lodash'

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
    borderedButton(),
    {
      marginTop: 0
    }
  ),
  teamButton: assign(
    type('avantgarde', 'body'),
    borderedButton(),
    {
      cursor: 'pointer'
    }
  )
})

view.render(() =>
  div(
    a('.backButton', { href: '/' }, 'Back'),
    h2('.h2', state.get('member').name),
    p(state.get('member').title),
    p(`${state.get('member').city}, Fl. ${state.get('member').floor}`),
    div('.teamButton', {
      onClick: () => filterMembersByTeam(state.get('member').team)
    }, `View ${state.get('member').name}'s team`),
    h3('.h3', 'Teams'),
    p(state.get('member').team),
    p(state.get('member').productTeam),
    div(state.get('member').reportsTo
      ? div(
          h3('.h3', 'Reports to'),
          a('.wrapper',
            { href: `/member/${find(state.get('allMembers'), { 'name': state.get('member').reportsTo })._id}`
          }, state.get('member').reportsTo)
        )
      : ''
    )
  )
)

export default view()
