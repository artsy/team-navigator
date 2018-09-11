import { connect, mutation, string, db } from 'joiql-mongo'

const { MONGODB_URI } = process.env

import { runner } from "../../scripts/sync_officespace"

export default mutation('updateOfficeSpaceImages', string(), async (ctx) => {
  const db = connect(MONGODB_URI, { authMechanism: 'ScramSHA1' })
  await runner(db)
  ctx.res.sync = 'success'
})
