import { model, string, number, query, array, db } from 'joiql-mongo'

export const seating = model('seating', {
  id: string(),
  url: string(),
  name: string(),
  x: number(),
  y: number(),
  floor_id: string(),
  status: string(),
  occupier_name: string(),
  occupier_handle: string()
})

export const floors = query('floors', array().items(string()),
  async (ctx, next) => {
    ctx.res.floors = await db.seatings.distinct('name')
    await next()
  }
)
