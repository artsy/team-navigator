import sharp from 'sharp'
import request from 'superagent'

const cache = {}

export const resizeImg = async (ctx) => {
  ctx.set('Content-Type', 'image/jpeg')
  const url = `https://dropbox.com/${ctx.url.replace('img', '')}?raw=1`
  if (cache[url]) {
    ctx.body = cache[url]
  } else {
    ctx.body = request.get(url).pipe(sharp().resize(75))
    cache[url] = await ctx.body.toBuffer()
  }
}
