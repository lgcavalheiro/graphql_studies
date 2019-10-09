import {GraphQLServer} from "graphql-yoga"
import { isTSAnyKeyword, exportAllDeclaration } from "@babel/types"

//SCALAR TYPES - String, boolean, int, float and ID

//DUMMY POST DATA

const POSTS = [{
    id: '1',
    title: 'Title 1',
    body: 'Lorem ipsum dolor sit amet...',
    published: true
}, {
    id: '2',
    title: 'Another post title',
    body: 'Lorem ipsum dolor sit amet mussum...',
    published: false
}, {
    id: '3',
    title: 'Yet another title for a post',
    body: 'Lorem ipsum dolor sit amet...',
    published: true
}]

//DEMO USER DATA

const USERS = [{
    id: '1',
    name: 'Dave',
    email: 'dave@dmail.com',
    age: 26
}, {
    id: '2',
    name: 'Jane',
    email: 'jane@jmail.com'
}, {
    id: '3',
    name: 'Michael',
    email: 'michael@mmail.com',
    age: 32
}]

// TYPE DEFS (APP SCHEMA)
const typeDefs = `
    type Query {
        greeting(name: String, job: String): String!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        add(numbers: [Float!]): Float!
        grades: [Int!]!
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
        greeting(parent, args) {
            var msg = ""

            if (args.name) msg += `Hello, ${ args.name }!`
            else msg += "Hello, guest!"
            
            if (args.job) msg += ` Your job position is: ${ args.job }.`
            else msg += ""

            return msg
        },   
        users(parent,args,ctx,info) {
            if (!args.query) {
                return USERS
            }

            return USERS.filter((USERS) => {
                return USERS.name.toLowerCase().includes(args.query.toLowerCase())
            })
            
        },
        posts(parent,args,ctx,info) {
            if (!args.query) return POSTS

            return POSTS.filter((POSTS) => {
               /*  if (POSTS.title.toLowerCase().includes(args.query.toLowerCase())) {
                    return POSTS.title.toLowerCase().includes(args.query.toLowerCase())
                } else if (POSTS.body.toLowerCase().includes(args.query.toLowerCase())) {
                    return POSTS.body.toLowerCase().includes(args.query.toLowerCase())
                } */
                return POSTS.title.toLowerCase().includes(args.query.toLowerCase()) || POSTS.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        grades(parent, args, ctx, info) {
            return [99,80,90]
        },
        add(parent, args) {
            if (args.numbers.length == 0) return 0
            return args.numbers.reduce((acumulator, currentValue) => {
                return acumulator + currentValue
            })
        },
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