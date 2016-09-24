import veact from 'veact'
import Member from './member'
import LocationsTeams from './locations-teams'
import { state } from '../../controllers'
import { mediumMargin, sidebarWidth } from '../lib'

const view = veact()

const { div, locationsteams, member } = view.els({
  locationsteams: LocationsTeams,
  member: Member
})

view.styles({
  container: {
    padding: mediumMargin,
    width: sidebarWidth,
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'top'
  }
})

view.render(() =>
  div('.container',
    (() => {
      if (state.get('member')) return member()
      else return locationsteams()
    })())
)

export default view()
