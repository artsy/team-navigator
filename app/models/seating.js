import { model, string, number } from 'joiql-mongo'

export const seating = model('seating', {
  id: string(),
  url: string(),
  name: string(),
  x: number(),
  y: number()
})
