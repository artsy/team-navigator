import veact from 'veact'
import Member from './member'
import Search from './search'
import LocationsTeams from './locations-teams'
import { state } from '../../controllers'
import { mediumMargin, sidebarWidth, type, grayRegular } from '../lib'
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
    width: sidebarWidth,
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'top',
    position: 'fixed',
    left: 0,
    top: 0,
    overflow: 'scroll',
    background: 'white',
    borderRight: `1px solid ${grayRegular}`
  },
  homeButton: assign(
    type('avantgarde', 'smallHeadline'),
    {
      marginBottom: '15px',
      display: 'block'
    }
  )
})

view.render(() =>
  div('.container',
    a('.homeButton', { href: '/' }, 'Team Navigator'),
    search(),
    (() => {
      if (state.get('member')) return member()
      else return locationsteams()
    })())
)

export default view()
