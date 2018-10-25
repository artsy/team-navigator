import veact from 'veact'
import Member from './member'
import Members from './members'
import Search from './search'
import LocationsTeams from './locations-teams'
import { state } from '../../controllers'
import { mediumMargin, sidebarWidth, type } from '../lib'
import { assign } from 'lodash'
import { readFileSync } from 'fs'
import path from 'path'

const view = veact()

const { div, span, a, locationsteams, member, members, search } = view.els({
  locationsteams: LocationsTeams,
  member: Member,
  members: Members,
  search: Search
})

const externalLinkIcon = span({ dangerouslySetInnerHTML: { __html: readFileSync(path.join(__dirname, 'external-link.svg')) } })
const extenalLinkProperties = { target: '_blank', rel: 'noopener' }

view.styles({
  containerMobile: {
    width: '100'
  },
  container: {
    padding: mediumMargin,
    paddingTop: '17px',
    width: sidebarWidth,
    position: 'sticky',
    top: '0px',
    maxHeight: '100%',
    display: 'inline-block',
    overflowY: 'scroll'
  },
  homeButton: type('avantgarde', 'smallHeadline'),
  atlas: assign(
    type('avantgarde', 'smallHeadline'),
    {
      float: 'right',
      color: '#777'
    }
  )
})

view.render(() =>
  div(state.get('isMobile') ? '.containerMobile' : '.container',
    div('.headline',
      a('.homeButton', { href: '/' }, 'Team Navigator'),
      a('.atlas', assign({ href: 'http://atlas.artsy.net' }, extenalLinkProperties), 'Atlas', externalLinkIcon)
    ),
    state.get('suppressSearch') ? '' : search(),
    (() => {
      if (state.get('member')) return member()
      else if(state.get('showMembersSidebar')) return members()
      else return locationsteams()
    })())
)

export default view()
