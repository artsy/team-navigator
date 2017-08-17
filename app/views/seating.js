import veact from 'veact'
import { state } from '../controllers'
import { type, smallMargin, sidebarWidth, mediumMargin, grayRegular, purpleRegular } from './lib'

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
  location: {
    position: "absolute",
  },
  "location-metadata": {
    marginLeft: "-50%",
    marginTop: "-10px",
    float: "left",
    textAlign: "center"
  },
  person: {
    fontWeight: "bold",
    marginBottom: "4px;"
  },
})


const title = () => 
  h2('.h1', state.get('title'))

const floorItem = (seat, highlight) => 
  div('.location', { style: {top: seat.y, left: seat.x}}, 
    a({href: `/seating/${seat.floor_id}/${seat.occupier_handle}`},
      div('.location-metadata', 
        div('.person', highlight ? { style: { color: purpleRegular }}: {}, seat.occupier_name,),
        div('.seat', seat.id),
      )
    )
  )

const floorMap = () => {
  const highlightMember = state.get('member')  
  return div('.map-container',
    img('.map', { src: state.get("background") }), 
    ...state.get("seatings").map(s => floorItem(s, highlightMember && highlightMember.handle === s.occupier_handle))
  )
}

const seating = () => div('.container', title(), floorMap())
