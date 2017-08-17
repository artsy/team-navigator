import veact from 'veact'
import Sidebar from './sidebar'
import TopNav from './topnav'
import { type, smallMargin, sidebarWidth, mediumMargin, grayRegular, purpleRegular } from './lib'
import { groupBy, first, map, toPairs, sortBy, assign, orderBy } from 'lodash'

const view = veact()

const { div, sidebar, topnav, h1, h2, p } = view.els({
  sidebar: Sidebar,
  topnav: TopNav,
})

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
  h2: assign(
    type('garamond', 'smallHeadline'),
    {
      margin: `${smallMargin}px 0`,
      marginTop: '50px',
      marginBottom: '26px',
      fontSize: "32px"
    }
  ),
  subtitle: {
    marginRight: smallMargin
  },
  p: {
    fontSize: "18px",
    width: "60%",
    lineHeight: "24px"

  }
})

view.render(() =>
  div(
    topnav(),
    sidebar(),
    didYouKnow())
)

export default view()

const didYouKnows = [
  { title: "Team Nav is a Hackathon Project", message: "Team Nav started as an Artsy hackathon project, and has evolved every year through hackathons and the occasional amount of some developer's free time. If you want to help improve it, there's a #team-nav-2 slack channel." },
  { title: "Team Heirarchies", message: "If you go to a team, in the top right you can see an option to show the reporting strucutre for a team." },
  { title: "Who reports to who", message: "On the flip side, if you go to any profile you can see who reports to someone by clicking 'Show Reporting Structure' in the sidebar" },
  { title: "Floor Plans", message: "When working in a big location like our company HQ, that you'll see a link to all of the floor plans as well as who is sitting there." },
  { title: "Audio Pronounciations", message: "Find out how to pronounce someone's name from themselves. We have recorded " },
  { title: "Slack Profiles", message: "Team Nav gets a lot of it's data from Artsy's slack. So if you fill in your slack profile then that data will show up in Team Nav. For example your Twitter or Instagram handle will show up." },
  { title: "Someone is online?", message: "You can see a green dot on someone's profile if they're online." },
  { title: "Team Timezones", message: "Team Nav gets a lot of it's data from Artsy's slack. We get everyone's timezones from Slack too, which is pretty unreliable, but it's better than nothing. On any team you can see a link in the top right for their timezones." },
]

const knowView = (dyk) => div('', div('.h2', dyk.title), p('.p', dyk.message))

const title = () =>  h2('.h1', "Did you know?")

const didYouKnow = () => div('.container', 
  title(), 
  ...didYouKnows.map(knowView))
