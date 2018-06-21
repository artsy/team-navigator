// node -r dotenv/config -r babel-core/register scripts/sync_officespace.js

// Hooks up all artsy members to officespace users

import request from "superagent"

import _ from 'lodash'

const isSubset = (aSubset, aSuperset) => (
    _.every(aSubset, (val, key) => {
      const isEqual =  _.isEqual(val, aSuperset[key])
      if(!isEqual){
        
        console.log(key, "does not match")
        console.log(val, aSuperset[key])
      }
      return isEqual
    })
)


export const runner = async db => {
  // Gets all employees in officespace right now
  const getAllEmployees = async handle => {
    const url = "https://artsy.officespacesoftware.com/api/1/employees"

    try {
      const response = await request
        .get(url)
        .set("AUTHORIZATION", `Token token=${process.env.OFFICESPACE_API_KEY}`)
        .set("Content-Type", "application/json; charset=utf-8")

      return response.body.response
    } catch (error) {
      return []
    }
  }

  // Update a User in the db
  const updateUser = officeSpacers => async member => {
    const url = "https://artsy.officespacesoftware.com/api/1/employees"
    const id = member.email

    const employeeFromMember = {
      client_employee_id: member.handle,
      first_name: member.name.split(" ")[0],
      last_name: member.name.split(" ")[1],
      email: member.email + "artsymail.com",
      department: member.team,
      title: member.title,
      bio: member.title
    }

    const officeSpacer = officeSpacers.find(e => e.client_employee_id === member.handle)
    
    if (officeSpacer) {
      if (!isSubset(employeeFromMember, officeSpacer)) {

        // Update if some data has changed
        console.log("Updating " + member.handle)
        return request
          .put(url + "/" + officeSpacer.id)
          .set("AUTHORIZATION", `Token token=${process.env.OFFICESPACE_API_KEY}`)
          .set("Content-Type", "application/json; charset=utf-8")
          .send({ record: employeeFromMember })
      } else {
        // Skip if not
        console.log("Skipping " + member.handle)
      }
    } else {
      console.log("Creating " + member.handle)
      // Create an employee
      return request
        .post(url)
        .set("AUTHORIZATION", `Token token=${process.env.OFFICESPACE_API_KEY}`)
        .set("Content-Type", "application/json; charset=utf-8")
        .send({ record: employeeFromMember })
    }
  }

  // Runs a lookup against against all members
  const run = async () => {
    const allMembers = await db.members.find().toArray()
    const allOfficeSpaceEmployees = await getAllEmployees()
    for (const member of allMembers) {
      try {
        await updateUser(allOfficeSpaceEmployees)(member)
      } catch (error) {
        console.error(error)
      }
    }
    // Ensure all db work is done before we kill the db
  }

  process.on("unhandledRejection", function(reason, p) {
    console.log("A promise raised an error")
    console.error(reason)
    process.exit()
  })

  // Go
  run()
}

export default runner

// Uncomment these to run this file solo

// import { connect } from "joiql-mongo"

// const db = connect(
//   process.env.MONGODB_URI,
//   { authMechanism: "ScramSHA1" }
// )
// runner(db)
