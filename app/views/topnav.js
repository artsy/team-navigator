import veact from 'veact'
import { state, filterMembersByLetter } from '../controllers/index'
import { purpleRegular } from './lib'
const view = veact()
const { div, ul, li } = view.els()

const aToZ = () => "abcdefghijklmnopqrstuvwxyz".split("")

view.styles({
  li: {
    display: 'inline-block',
    marginRight: 20,
    cursor: 'pointer'
  },
  container: {
    paddingTop: 20
  }
})

view.render(() =>
  div('.container',
    ul(
      aToZ().map((letter) =>
        li('.li', {
          onClick: () => filterMembersByLetter(letter),
          style: { color: letter === state.get('curFilter') ? purpleRegular : '' }
        }, letter)
      )
    )
  )
)

export default view()
