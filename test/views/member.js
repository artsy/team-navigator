/* eslint-env mocha */
import Baobab from 'baobab'
import { fixture, render } from '../helpers'
import Member from '../../app/views/sidebar/member'

describe('Member', () => {
  let state

  beforeEach(() => {
    state = new Baobab({
      allMembers: [
        fixture('member', { name: 'Zeus' })
      ],
      member: fixture('member', {
        name: 'Orta',
        reportsTo: 'Zeus',
        slackProfile: {}
      })
    })
    Member.__set__('state', state)
  })

  it('renders names', async () => {
    render(Member).html().should.containEql('Orta')
  })

  it('renders reports to', async () => {
    const html = render(Member).html()
    html.should.containEql('Zeus')
    html.should.containEql('Reports to')
  })

  it('will safely not render reports to if missing a manager', async () => {
    state.set('allMembers', [fixture('member', { name: 'Atlas' })])
    const html = render(Member).html()
    html.should.not.containEql('Reports to')
    html.should.containEql('Orta')
  })
})
