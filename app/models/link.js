import { model, string, number, query, array, db } from 'joiql-mongo'

export const link = model('link', {
  id: string(),
  tags: string(),
  href: string(),
  name: string(),
  type: string(),
  time: number(),
})
