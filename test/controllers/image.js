/* eslint-env mocha */
import sinon from 'sinon'
import controller, { resizeImg } from '../../app/controllers/image'

describe('resizeImg', () => {
  let ctx, next, request, sharp, cache

  beforeEach(() => {
    // Stub cache
    cache = {}
    controller.__set__('cache', cache)
    // Stub superagent
    request = {}
    request.get = sinon.stub().returns(request)
    request.pipe = sinon.stub().returns(request)
    request.toBuffer = sinon.stub()
    controller.__set__('request', request)
    // Stub sharp
    sharp = sinon.stub()
    sharp.returns({ resize: sinon.stub().returns(sharp) })
    controller.__set__('sharp', sharp)
    // Stub middleware args
    ctx = { set: sinon.stub(), url: 'foo', body: '' }
    next = sinon.stub()
  })

  it('converts a local url into a resized request to dropbox', async () => {
    ctx.url = 'img/s/a/amy.jpg'
    await resizeImg(ctx, next)
    request.get.args[0][0].should.equal('https://dropbox.com//s/a/amy.jpg?raw=1')
  })

  it('returns the sharp resized img as the body', async () => {
    const stream = sinon.stub()
    stream.toBuffer = sinon.stub()
    request.pipe.returns(stream)
    await resizeImg(ctx, next)
    request.pipe.calledWith(sharp).should.be.ok()
    ctx.body.should.equal(stream)
  })

  it('returns images from the cache', async () => {
    ctx.url = 'img/s/a/amy.jpg'
    cache['https://dropbox.com//s/a/amy.jpg?raw=1'] = 'foobar'
    await resizeImg(ctx, next)
    ctx.body.should.equal('foobar')
    request.get.called.should.not.be.ok()
  })
})
