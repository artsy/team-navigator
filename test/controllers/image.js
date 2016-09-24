/* eslint-env mocha */
import sinon from 'sinon'
import controller, { resizeImg } from '../../app/controllers/image'

describe('resizeImg', () => {
  let ctx, request, sharp, cache

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
    // Stub context
    ctx = { set: sinon.stub(), url: 'foo', body: '' }
  })

  it('converts a local url into a resized request to dropbox', async () => {
    ctx.url = 'img/s/a/amy.jpg'
    await resizeImg(ctx)
    request.get.args[0][0].should.equal('https://dropbox.com//s/a/amy.jpg?raw=1')
  })

  it('returns the sharp resized img as the body', async () => {
    const stream = sinon.stub()
    stream.toBuffer = sinon.stub()
    request.pipe.returns(stream)
    await resizeImg(ctx)
    request.pipe.calledWith(sharp).should.be.ok()
    ctx.body.should.equal(stream)
  })

  it('returns images from the cache', async () => {
    ctx.url = 'img/s/a/amy.jpg'
    cache['https://dropbox.com//s/a/amy.jpg?raw=1'] = 'foobar'
    await resizeImg(ctx)
    ctx.body.should.equal('foobar')
    request.get.called.should.not.be.ok()
  })
})
