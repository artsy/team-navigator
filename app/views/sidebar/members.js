import veact from 'veact'
import { state } from '../../controllers'
import { type, mediumMargin, purpleRegular, teamNameToID } from '../lib'
import { assign, sortBy, filter } from 'lodash'
import {showMember} from "../member-tree"

const view = veact()

const { div, h2, ul, li, a } = view.els()

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
  const members = state.get('members')

  return div(
    h2('.h2', 'Members'),
    ul('.ul', sortBy(members, m => m.handle).map(m => showMember(m, 0)))
  )
})

export default view()
