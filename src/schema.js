const fs = require('fs')
const path = require('path')
const { makeExecutableSchema } = require('graphql-tools')

const schemaFile = path.join(path.dirname(__dirname), 'schema.graphql')
const typeDefs = fs.readFileSync(schemaFile, 'utf8')
const resolvers = require('./resolvers')

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})