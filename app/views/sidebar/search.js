import veact from 'veact'
import { state, searchMembers } from '../../controllers'
import { type, grayRegular } from '../lib'
import { assign } from 'lodash'

const view = veact()

const { input } = view.els()

view.styles({
  input: assign(
    type('garamond', 'body'),
    {
      width: '100%',
      border: `2px solid ${grayRegular}`,
      marginBottom: '30px',
      paddingLeft: '5px'
    }
  )
})

view.render(() =>
  input('.input', {
    placeholder: `Search ${state.get('allMembers').length} team members`,
    onChange: (e) => searchMembers(e.target.value)
  })
)

export default view()
