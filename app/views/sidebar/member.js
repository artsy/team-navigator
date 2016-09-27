import veact from 'veact'
import { state } from '../../controllers'
import { type, graySemibold } from '../lib'
import { assign } from 'lodash'

const view = veact()

const { div, h2, a, p } = view.els()

view.styles({
  h2: assign(
    type('garamond', 'body'),
    {
      marginBottom: 10,
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
    p(`${state.get('member').city}, Fl. ${state.get('member').floor}`))
)

export default view()
