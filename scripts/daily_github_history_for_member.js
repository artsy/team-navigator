// node -r dotenv/config -r babel-core/register scripts/daily_github_history_for_member.js

// Generates a repo history for all users, at 1 API request per user

const { MONGODB_URI, GITHUB_ORG_LOOKUP_KEY, GITHUB_ORG } = process.env
import { uniq } from 'lodash'
import request from 'superagent'
import pmongo from 'promised-mongo'

const db = pmongo(MONGODB_URI, ['members'])

// Gets repos related to a user
const getRepos = async (handle) => {
  const path = `/search/commits?q=user:${GITHUB_ORG}%20committer:${handle}&per_page=100&sort=committer-date&order=desc`

  const url = 'https://api.github.com'
  try {
    const response = await request
      .get(url + path)
      .set('Authorization', `token ${GITHUB_ORG_LOOKUP_KEY}`)
      .set('Accept', 'application/vnd.github.cloak-preview')

    return uniq(response.body.items.map(e => e.repository.full_name))
  } catch (error) {
    return []
  }
}

// Update a User in the db
const updateUser = async (member) => {
  const handle = member.githubHandle
  const repos = await getRepos(handle)
  await db.members.update({ _id: member._id }, { $set: { githubHistory: repos } })
}

// Runs a lookup against against all members
const run = async () => {
  const allMembers = await db.members.find().toArray()
  const githubbers = allMembers.filter(m => m.githubHandle)

  // Ensure all db work is done before we kill the db
  await Promise.all(githubbers.map(updateUser))
  db.close()
}

// Go
run()
