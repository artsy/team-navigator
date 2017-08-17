import veact from 'veact'
import { state } from '../controllers'
import { type, smallMargin, sidebarWidth, mediumMargin, grayRegular } from './lib'

import Sidebar from './sidebar'
import TopNav from './topnav'

const view = veact()

const { div, sidebar, topnav, a, span, h2, img } = view.els({
  sidebar: Sidebar,
  topnav: TopNav,
})

view.render(() =>
  div(
    topnav(),
    sidebar(),
    seating()
  )
)

export default view()


import { groupBy, first, map, toPairs, sortBy, assign, orderBy } from 'lodash'

view.styles({
  container: {
    display: 'inline-block',
    width: `calc(100% - ${sidebarWidth}px)`,
    paddingLeft: mediumMargin,
    verticalAlign: 'top',
    borderLeft: `1px solid ${grayRegular}`
  },
  h1: assign(
    type('garamond', 'largeHeadline'),
    {
      margin: `${smallMargin}px 0`,
      marginTop: '50px',
      marginBottom: '26px'
    }
  ),
  subtitle: {
    marginRight: smallMargin
  },
  "map-container": {
    position: "relative"
  },
})

const divisor = 4

const title = () => 
  h2('.h1', state.get('title'))

const floorItem = (seat) => 
  div('.location', { style: {top: seat.y / divisor, left: seat.x / divisor, position: "absolute"}}, seat.occupier_name)

const floorMap = () => {
  return div('.map-container',
    img('.map', { src: state.get("background") })
    , ...state.get("seatings").map(floorItem)
  )
}

const seating = () =>  div('.container', title(), floorMap())
