import veact from 'veact'
import { state } from '../../controllers'
import { type } from '../lib'
import { assign } from 'lodash'

const view = veact()

const { div, h2, a } = view.els()

view.styles({
  h2: assign(
    type('avantgarde', 'smallHeadline'),
    { marginBottom: 10 }
  )
})

view.render(() =>
  div(
    a({ href: '/' }, 'Back'),
    h2('.h2', state.get('member').name))
)

export default view()
