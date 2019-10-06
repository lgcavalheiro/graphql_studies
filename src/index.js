import {GraphQLServer} from "graphql-yoga"

//SCALAR TYPES - String, boolean, int, float and ID

// TYPE DEFS (APP SCHEMA)
const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
    
`

// API RESOLVERS
const resolvers = {
    Query: {
        me() {
            return {
                id: "1230982",
                name: "Jane Doe",
                email: "jdoe@jmail.com",
                age: null
            }
        },
        post() {
            return {
                id: "0012019",
                title: "Test title",
                body: "Lorem ipsum dolor sit amet...",
                published: false,
                author: {
                    id: "1230982",
                    name: "Jane Doe",
                    email: "jdoe@jmail.com",
                    age: null 
                }
            }
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