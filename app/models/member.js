import { model, array, string, query, db } from 'joiql-mongo'

export const member = model('member', {
  name: string(),
  title: string(),
  team: string(),
  subteam: string(),
  productTeam: string(),
  reportsTo: string(),
  teamRank: string(),
  email: string(),
  city: string(),
  country: string(),
  floor: string(),
  phone: string(),
  birthday: string(),
  startDate: string(),
  headshot: string(),
  roleText: string(),
  introEmail: string(),
  personalBio: string(),
  feedbackFormUrl: string(),
  notes: string()
})

export const teams = query('teams', array().items(string()), async (ctx, next) => {
  ctx.res.teams = await db.members.distinct('team')
  await next()
})

export const cities = query('cities', array().items(string()), async (ctx, next) => {
  ctx.res.cities = await db.members.distinct('city')
  await next()
})
