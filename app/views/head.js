import veact from 'veact'

const reset = `
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
a {
  color: black;
  text-decoration: none;
}`
const fontsUrl = '//fast.fonts.net/cssapi/' +
  'f7f47a40-b25b-44ee-9f9c-cfdfc8bb2741.css'

const view = veact()
const { style, link, head, meta } = view.els()

view.render(() =>
  head(
    style({ dangerouslySetInnerHTML: { __html: reset } }),
    link({ type: 'text/css', rel: 'stylesheet', href: fontsUrl }),
    meta({ name: 'viewport', content: 'width=390, initial-scale=1, maximum-scale=1, user-scalable=0' })
  )
)

export default view()
