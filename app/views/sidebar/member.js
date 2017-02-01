import veact from 'veact'
import { assign, find } from 'lodash'
import { state, filterMembersByTeam } from '../../controllers'
import { type, borderedButton } from '../lib'

import email from "./email.svg"
import calendar from "./calendar.svg"
import chat from "./chat.svg"

const view = veact()

const { div, h2, h3, nav, a, p, img } = view.els()

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

view.render(() => {
    const member = state.get('member')
    return div(
      a('.backButton', { href: '/' }, 'Back'),
      h2('.h2', member.name),
      p(member.title),
      p(`${member.city}, Fl. ${member.floor}`),
      nav([
        a({ href: `${member.email}artsymail.com`, dangerouslySetInnerHTML: { __html: email }}),
        a({ href: `https://calendar.google.com/calendar/embed?src=${member.email}artsymail.com&ctz=America/New_York`, dangerouslySetInnerHTML: { __html: calendar }}),
      ]),
      div('.teamButton', {
        onClick: () => filterMembersByTeam(member.team)
      }, `View ${member.name}'s team`),
      h3('.h3', 'Teams'),
      p(member.team),
      p(member.productTeam),
      div(member.reportsTo
        ? div(
            h3('.h3', 'Reports to'),
            a('.wrapper',
              { href: `/member/${find(state.get('allMembers'), { 'name': member.reportsTo })._id}`
            }, state.get('member').reportsTo)
          )
        : ''
      )
    )
  }
)

export default view()
