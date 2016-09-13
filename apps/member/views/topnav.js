import veact from 'veact'

const view = veact()

const { div } = view.els()

view.render(() =>
  div(
    div())
)

export default view()
