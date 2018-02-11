const express = require("express")
const graphqlHTTP = require('express-graphql')
const schema = require('./src/schema')
const app = express()
const pastebin = require('./src/pastebin/adapter')
const cron = require('node-cron')
const maskErrors = require('graphql-errors').maskErrors

const getPasteTrends = () => pastebin.listTrendingPastes()
  .then(trends => app.set('pasteTrends', trends))
const getUserInfo = () => pastebin.getUserInfo()
  .then(user => app.set('userInfo', user))

cron.schedule('*/1 * * * *', () => {
    console.log('cron update')
    getPasteTrends()
    getUserInfo()
  }, true)

maskErrors(schema)

app.use('/graphql', graphqlHTTP(req => {
  const startTime = Date.now()
  return {
    schema: schema,
    graphiql: true,
    extensions: (/*{ document, variables, operationName, result }*/) => ({
      timing: Date.now() - startTime,
    })
  }
}))

getPasteTrends()
getUserInfo()

app.listen(4000)
console.log('Listening...')