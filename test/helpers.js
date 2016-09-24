import { merge } from 'lodash'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import cheerio from 'cheerio'

export const fixture = (type, attrs) =>
  merge({}, {
    member: {
      name: 'Orta',
      title: 'Badass',
      headshot: 'http://foobar.com/img/1.jpg',
      floor: 25,
      city: 'NYC'
    }
  }[type], attrs)

export const render = (Component, props = {}) =>
  cheerio.load(renderToString(createElement(Component, props)))
