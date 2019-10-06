import {GraphQLServer} from "graphql-yoga"

// TYPE DEFS (APP SCHEMA)
const typeDefs = `
    type Query {
        hello: String!
        location: String!
        bio: String!
    }
`

// API RESOLVERS
const resolvers = {
    Query: {
        hello() {
            return "This is my query!"
        },
        location(){
            return "This is location"
        },
        bio(){
            return "This is bio"
        }
    }
}

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.start(() => {
    console.log("Server is up")
})