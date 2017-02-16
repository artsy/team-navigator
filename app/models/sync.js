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

export default mutation('sync', string(), async (ctx) => {
  // Remove old entries
  await db.members.remove()

  const res = await request.get(SHEETS_URL)
  const parsed = await convert(res.text)
  const members = parsed.map((obj) => mapKeys(obj, (v, k) => camelCase(k)))
                        .map((member) => {
                          // Use email prefix as a global handle for pretty URLs
                          member.handle = member.email.replace("@", "")
                          // Generate a team ID for URLs
                          member.teamID = member.team.toLowerCase().replace(" ", "-").replace(",", "-");
                          return member
                        })

  await Promise.all(members.map((member) => db.members.save(member)))
  ctx.res.sync = 'success'
})
