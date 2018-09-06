import veact from 'veact'
import { state } from '../controllers'
import { type, smallMargin, sidebarWidth, mediumMargin, grayRegular, purpleRegular } from './lib'

import Sidebar from './sidebar'
import TopNav from './topnav'

const view = veact()

const { div, sidebar, topnav, a, span, h2, img, iframe } = view.els({
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


// NOT Used ATM

const floorMap = () => {
  const highlightMember = state.get('member')  
  return div('.map-container',
    iframe({src: "https://artsy.officespacesoftware.com/visual-directory/floors/6" })
  )
}

const seating = () => div('.container', title(), floorMap())
