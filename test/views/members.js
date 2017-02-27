/* eslint-env mocha */
import Baobab from 'baobab'
import { fixture, render } from '../helpers'
import Members from '../../app/views/members'
import React from 'react'

const { div } = React.DOM

describe('Members', () => {
  let state

  beforeEach(() => {
    state = new Baobab({ members: [fixture('member')] })
    Members.__set__('state', state)
    Members.__set__('membergroup', ({ members }) => div({}, members[0].name))
  })

  it('renders list of member groups', async () => {
    const $ = render(Members)
    $.html().should.containEql('Orta')
  })
})
