/* eslint-env mocha */
import sinon from 'sinon'
import sync from '../../app/models/sync'

describe('Sync', () => {
  let ctx, next, request, db, resolve, Slack

  beforeEach(() => {
    // Stub middleware arguments
    ctx = { req: { mutation: { sync: {} } }, res: {} }
    next = sinon.stub()
    // Stub superagent
    request = {}
    request.get = sinon.stub().returns(request)
    sync.__set__('request', request)
    // Stub mongojs
    db = {
      members: {
        save: sinon.stub().returns(Promise.resolve()),
        remove: sinon.stub()
      }
    }
    sync.__set__('db', db)
    // Helper to run resolve function
    resolve = () => sync.middleware[0](ctx, next)
    // Slack IDs
    Slack = { users: { list: sinon.stub().returns(Promise.resolve([])) } }
    sync.__set__('Slack', Slack)
  })

  it('can sync twice', async () => {
    const sync = async () => {
      request.get.returns(Promise.resolve({
        text: 'name,title,email,reports_to\nOrta,Badass,orta@,db'
      }))
      await resolve()
      db.members.save.firstCall.args.should.eql([{
        name: 'Orta',
        title: 'Badass',
        email: 'orta@',
        reportsTo: 'db',
        handle: 'orta',
        teamID: undefined,
        subteamID: undefined,
        productTeamID: undefined,
        teamRank: 0
      }])
    }
    await sync()
    await sync()
    ctx.res.sync.should.equal('success')
  })

  it('syncs a csv of team members into mongo documents', async () => {
    request.get.returns(Promise.resolve({
      text: 'name,title,email,reports_to\nOrta,Badass,orta@,db'
    }))
    await resolve()
    db.members.save.firstCall.args.should.eql([{
      name: 'Orta',
      title: 'Badass',
      email: 'orta@',
      reportsTo: 'db',
      handle: 'orta',
      teamID: undefined,
      subteamID: undefined,
      productTeamID: undefined,
      teamRank: 0
    }])
    ctx.res.sync.should.equal('success')
  })
})
