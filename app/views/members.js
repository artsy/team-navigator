import veact from 'veact'
import MemberGroup from './member-group'
import { state } from '../controllers'
import { sidebarWidth, mediumMargin, grayRegular } from './lib'
import { groupBy, first, map, toPairs, sortBy } from 'lodash'

const view = veact()

const { div, membergroup } = view.els({ membergroup: MemberGroup })

view.styles({
  container: {
    display: 'inline-block',
    width: `calc(100% - ${sidebarWidth}px)`,
    paddingLeft: mediumMargin,
    verticalAlign: 'top',
    borderLeft: `1px solid ${grayRegular}`
  }
})

view.render(() => {
  const pairs = toPairs(
    groupBy(state.get('members'), (member) =>
      first(member.name))
  )
  const sortedPairs = sortBy(pairs, ([title]) => title)
  return div('.container',
    map(sortedPairs, ([title, members]) =>
      membergroup({ title, members })))
})

export default view()
