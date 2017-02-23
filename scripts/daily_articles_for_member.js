// node -r dotenv/config -r babel-core/register scripts/daily_github_history_for_member.js

// Generates a repo history for all users, at 1 API request per user

const { MONGODB_URI } = process.env
import { uniq } from 'lodash'
import request from 'superagent'
import pmongo from 'promised-mongo'

const db = pmongo(MONGODB_URI, { authMechanism: 'ScramSHA1' }, ['members'])

// Gets repos related to a user
const getArticles = async (handle) => {
  const params = `?all_by_author=${handle}&published=true`
  const url = 'https://writer.artsy.net/api/articles'

  try {
    const response = await request.get(url + params)
    return uniq(response.body.results.map(e => {
      return { name: e.title, href: `article/${e.slug}` }
    }))
  } catch (error) {
    return []
  }
}

// Update a User in the db
const updateUser = async (member) => {
  const handle = member.writerAuthorId
  const articles = await getArticles(handle)
  await db.members.update({ _id: member._id }, { $set: { articleHistory: articles } })
}

// Runs a lookup against against all members
const run = async () => {
  const allMembers = await db.members.find().toArray()
  const writers = allMembers.filter(m => m.writerAuthorId)

  // Ensure all db work is done before we kill the db
  await Promise.all(writers.map(updateUser))
  db.close()
}

// Go
run()
