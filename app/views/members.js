import veact from 'veact'
import MemberGroup from './member-group'
import MemberTree from './member-tree'
import { state } from '../controllers'
import { type, smallMargin, sidebarWidth, mediumMargin, grayRegular } from './lib'

import { groupBy, first, map, toPairs, sortBy, assign } from 'lodash'
import moment from 'moment'

const view = veact()

const { div, membergroup, membertree, h2, a, span } = view.els({ membergroup: MemberGroup, membertree: MemberTree })

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
  subtitles: assign(
    type('avantgarde', 'smallHeadline'),
    {
      float: 'right',
      color: grayRegular,
      paddingTop: '22px'
    }),
  subtitle: {
    marginRight: smallMargin
  }
})

const alphabeticize = (members) => {
  const pairs = toPairs(
    groupBy(members, (member) => first(member.name))
  )
  const sortedPairs = pairs.map(([year, members]) => [year, sortBy(members, m => m.name)])
  return sortBy(sortedPairs, ([title]) => title)
}

const seniority = (members) => {
  const pairs = toPairs(
    groupBy(members, (member) => moment(member.startDate).year())
  )
  const sortedPairs = pairs.map(([year, members]) => [year, sortBy(members, m => moment(m.startDate).dayOfYear())])
  return sortBy(sortedPairs, ([year]) => year)
}

const subteams = (members) => {
  const wholeTeam = state.get('team')
  const pairs = toPairs(
    groupBy(members, (member) => member.subteamID !== wholeTeam ? member.subteam : member.team)
  )
  // Sort by team rank internally in a group
  const sortedPairs = pairs.map(([year, members]) => [year, sortBy(members, m => m.teamRank)])
  // Move "Head" to always be at the top
  return sortBy(sortedPairs, ([title]) => title === 'Head' ? '1' : title)
}

const title = () => h2('.h1', state.get('title'),
                        state.get('subtitles') ? span('.subtitles', state.get('subtitles').map(subtitle)) : ''
                      )
const subtitle = ({title, href}) => a('.subtitle', { href }, title)

view.render(() => {
  const page = (content) =>
    div('.container',
      state.get('title') ? title() : '',
      content
    )

  if (state.get('format') === 'tree') {
    return page(
      membertree({ title: 'hi', members: state.get('members') })
    )
  } else {
    const format = state.get('format')
    let sort = alphabeticize
    if (format === 'subteams') sort = subteams
    if (format === 'seniority') sort = seniority
    
    const shortTitles = (format === 'subteams')
    const sortedPairs = sort(state.get('members'))

    return page(
      map(sortedPairs, ([title, members]) =>
        membergroup({ title, members, shortTitles })))
  }
})

export default view()
