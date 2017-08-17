import { model, string, number } from 'joiql-mongo'

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
