/* eslint-env mocha */
import { fixture, render } from '../helpers'
import MemberGroup from '../../app/views/member-group'

describe('MemberGroup', () => {
  let props

  beforeEach(() => {
    props = {
      members: [fixture('member')],
      title: 'O'
    }
  })

  it('renders an alphbetically grouped list of members', async () => {
    const $ = render(MemberGroup, props)
    $('h2').text().should.equal('O')
    $('a').text().should.equal('OrtaBadassNYC, Fl. 25')
  })
})
