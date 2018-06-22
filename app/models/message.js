import { model, string, number, query, array, db } from 'joiql-mongo'

export const message = model('message', {
  id: string(),
  tags: string(),
  message: string(),
})
