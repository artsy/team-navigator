import veact from 'veact'
import Sidebar from './sidebar'
import Members from './members'

const view = veact()

const { div, sidebar, topnav, members } = view.els({
  sidebar: Sidebar,
  members: Members
})

view.render(() =>
  div(
    sidebar(),
    members())
)

export default view()
