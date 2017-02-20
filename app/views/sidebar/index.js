import veact from 'veact'
import Member from './member'
import Search from './search'
import LocationsTeams from './locations-teams'
import { state } from '../../controllers'
import { mediumMargin, sidebarWidth, type } from '../lib'
import { assign } from 'lodash'

const view = veact()

const { div, locationsteams, member, search, a } = view.els({
  locationsteams: LocationsTeams,
  member: Member,
  search: Search
})

view.styles({
  container: {
    padding: mediumMargin,
    paddingTop: "17px",
    width: sidebarWidth,
    position: 'sticky',
    top: '0px',
    maxHeight: "100%",
    display: 'inline-block',
    overflowY: 'scroll',
  },
  homeButton: type('avantgarde', 'smallHeadline'),
  atlas: assign(
    type('avantgarde', 'smallHeadline'),
    {
      float: "right",
      color: '#777'
    }
  )
})

view.render(() =>
  div('.container',
    div('.headline', 
      a('.homeButton', { href: '/' }, 'Team Navigator'),
      a('.atlas', { href: 'http://atlas.artsy.net' }, 'Atlas')
    ),
    search(),
    (() => {
      if (state.get('member')) return member()
      else return locationsteams()
    })())
)

export default view()
