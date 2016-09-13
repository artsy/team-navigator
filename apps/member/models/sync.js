import { mutation, string, db } from 'joiql-mongo'
import request from 'superagent'
import { Converter } from 'csvtojson'
import { camelCase, mapKeys } from 'lodash'

const converter = new Converter()
const { SHEETS_URL } = process.env
const convert = (data) =>
  new Promise((resolve, reject) => {
    converter.fromString(data, (err, json) => {
      if (err) reject(err)
      else resolve(json)
    })
  })

export default mutation('sync', string(), async (ctx, next) => {
  const res = await request.get(SHEETS_URL)
  const parsed = await convert(res.text)
  const members = parsed.map((obj) => mapKeys(obj, (v, k) => camelCase(k)))
  await Promise.all(members.map((member) => db.members.save(member)))
  ctx.res.sync = 'succesful'
})
