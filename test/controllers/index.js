/* eslint-env mocha */
import sinon from 'sinon'
import { fixture } from '../helpers'
import mod, * as controller from '../../app/controllers/index'

describe('index controller', () => {
  let ctx, state

  beforeEach(() => {
    ctx = {
      params: { team: 'foo' },
      render: sinon.stub(),
      bootstrap: sinon.stub()
    }
    mod.__set__('api', sinon.stub())
    state = mod.__get__('state')
  })

  describe('#byLocation', () => {
    it('sets members from a city', async () => {
      state.set('allMembers', [
        fixture('member', { name: 'Craig', city: 'earth' }),
        fixture('member', { name: 'Orta', city: 'earth' }),
        fixture('member', { name: 'Marty', city: 'mars' })
      ])
      ctx.bootstrap.returns(Promise.resolve({ teams: ['engineering'] }))
      ctx.params.location = 'earth'
      await controller.byLocation(ctx)
      state.get('members').map((m) => m.name).join(',')
        .should.equal('Craig,Orta')
    })
  })

  describe('#showTeam', () => {
    it('loads init data', async () => {
      ctx.bootstrap.returns(Promise.resolve({ teams: ['foo'] }))
      await controller.showTeam(ctx)
      state.get().teams[0].should.equal('foo')
    })

    it('works when members are not in a product team', async () => {
      state.set('allMembers', [
        fixture('member', { name: 'Craig', teamID: 'engineering' }),
        fixture('member', { name: 'Orta', teamID: 'engineering' }),
        fixture('member', { name: 'Madeline', teamID: 'learning' })
      ])
      ctx.bootstrap.returns(Promise.resolve({ teams: ['engineering'] }))
      ctx.params.team = 'engineering'
      await controller.showTeam(ctx)
      state.get('members').map((m) => m.name).join(',')
        .should.equal('Craig,Orta')
    })
  })
})
