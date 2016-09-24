/* eslint-env mocha */
import Baobab from 'baobab'
import { fixture, render } from '../helpers'
import Members from '../../app/views/members'

describe('Members', () => {
  let state

  beforeEach(() => {
    state = new Baobab({ members: [fixture('member')] })
    Members.__set__('state', state)
  })

  it('renders list of member groups', async () => {
    render(Members).html().should.containEql('Orta')
  })
})
