import sharp from 'sharp'
import request from 'superagent'
import { existsSync, readFileSync, createWriteStream } from 'fs'
import { tmpdir } from 'os'
import { join, basename } from 'path'

export const resizeImg = async (ctx, next) => {
  ctx.set('Content-Type', 'image/jpeg')
  const url = `https://dropbox.com/${ctx.url.replace('img', '')}?raw=1`
  const localPath = join(tmpdir(), basename(ctx.url))
  console.log(localPath)
  
  if (existsSync(localPath)) {
    ctx.body = readFileSync(localPath)
  } else {
    const writableStream = createWriteStream(localPath)
    const resizer = sharp().rotate().resize(100)

    // Allow passing directly to the response, but also write to a tmp file
    ctx.body = request.get(url).pipe(resizer).on('data', (data) => {
      writableStream.write(data)
    })
  }

  await next()
}

