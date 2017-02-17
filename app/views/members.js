import veact from 'veact'
import MemberGroup from './member-group'
import MemberTree from './member-tree'
import { state } from '../controllers'
import { type, smallMargin, sidebarWidth, mediumMargin, grayRegular } from './lib'
import { groupBy, first, map, toPairs, sortBy, assign } from 'lodash'

const view = veact()

const { div, membergroup, membertree, h2 } = view.els({ membergroup: MemberGroup, membertree: MemberTree })

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
    { margin: `${smallMargin}px 0` }
  )
})

const alphabeticize = (members) => {
  const pairs = toPairs(
    groupBy(members, (member) => first(member.name))
  )
  return sortBy(pairs, ([title]) => title)
}

const subteams = (members) => {
  const wholeTeam = state.get('team')
  const pairs = toPairs(
    groupBy(members, (member) => member.subteamID !== wholeTeam ? member.subteam : member.team)
  )
  // Move "Head" to always be at the top
  return sortBy(pairs, ([title]) => title === "Head" ? "1" : title)
}

view.render(() => {
  if (state.get('format') === "tree") {
    return div('.container',
      state.get('title') ? h2('.h1', state.get('title')) : '',
      membertree("hi", state.get("members"))
    )

  } else {
    const useSubteam = state.get('format') === 'subteams'
    const sort = useSubteam ? subteams : alphabeticize
    const shortTitles = useSubteam
    const sortedPairs = sort(state.get('members'))

    return div('.container',
    state.get('title') ? h2('.h1', state.get('title')) : '',
      map(sortedPairs, ([title, members]) =>
        membergroup({ title, members, shortTitles })))
  }  
})

export default view()
