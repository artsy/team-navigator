/* eslint-env mocha */
import sinon from 'sinon'
import sync from '../../app/models/sync'

describe('Sync', () => {
  let ctx, next, request, db, resolve

  beforeEach(() => {
    // Stub middleware arguments
    ctx = { req: { mutation: { sync: {} } }, res: {} }
    next = sinon.stub()
    // Stub superagent
    request = {}
    request.get = sinon.stub().returns(request)
    sync.__set__('request', request)
    // Stub mongojs
    db = { members: { save: sinon.stub().returns(Promise.resolve()), remove: sinon.stub() } }
    sync.__set__('db', db)
    // Helper to run resolve function
    resolve = () => sync.middleware[0](ctx, next)
  })

  it('syncs a csv of team members into mongo documents', async () => {
    request.get.returns(Promise.resolve({ text: 'name,title\nOrta,Badass,thing, }))
    await resolve()
    db.members.save.calledWith({ name: 'Orta', title: 'Badass' }).should.be.ok()
    ctx.res.sync.should.equal('success')
  })
})
