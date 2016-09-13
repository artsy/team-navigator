import veact from 'veact'
import Sidebar from './sidebar'
import TopNav from './topnav'
import Members from './members'

const view = veact()

const { div, sidebar, topnav, members } = view.els({
  sidebar: Sidebar,
  topnav: TopNav,
  members: Members
})

view.render(() =>
  div(
    topnav(),
    sidebar(),
    members())
)

export default view()
