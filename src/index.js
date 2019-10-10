import {GraphQLServer} from "graphql-yoga"
import uuidv4 from 'uuid/v4'

//SCALAR TYPES - String, boolean, int, float and ID

//DUMMY POST DATA

const POSTS = [{
    id: '1',
    title: 'Title 1',
    body: 'Lorem ipsum dolor sit amet...',
    published: true,
    author: '3'
}, {
    id: '2',
    title: 'Another post title',
    body: 'Lorem ipsum dolor sit amet mussum...',
    published: false,
    author: '1'
}, {
    id: '3',
    title: 'Yet another title for a post',
    body: 'Lorem ipsum dolor sit amet...',
    published: true,
    author: '3'
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

// DUMMY COMMENTS

const COMMENTS = [{
    id: '1',
    comment: 'Very nice!',
    author: '2',
    post: '3'
}, {
    id: '2',
    comment: 'Don`t agree but ok',
    author: '2',
    post: '1'
}, {
    id: '3',
    comment: 'LOL',
    author: '2',
    post: '2'
}, {
    id: '4',
    comment: 'What`s so funny??',
    author: '1',
    post: '2'
}, {
    id: '5',
    comment: 'First',
    author: '3',
    post: '2'
}, {
    id: '6',
    comment: 'ok',
    author: '1',
    post: '3'
}, {
    id: '7',
    comment: 'test',
    author: '3',
    post: '3'
}, {
    id: '8',
    comment: 'finally',
    author: '2',
    post: '1'
},]

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
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreateCommentInput {
        comment: String!
        author: ID!
        post: ID!
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        comment: String!
        author: User!
        post: Post!
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
                return POSTS.title.toLowerCase().includes(args.query.toLowerCase()) || POSTS.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        comments(parent, args, ctx, info) {
            return COMMENTS
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
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = USERS.some((user) => user.email == args.data.email)

            if (emailTaken) {
                throw new Error('Email is already taken!')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            USERS.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = USERS.some((user) => user.id == args.data.author)

            if (!userExists) throw new Error('User not found!')
            
            const post = {
                id: uuidv4(),
                title: args.data.title,
                ...args.data
            }

            POSTS.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = USERS.some((user) => user.id == args.data.author)
            if (!userExists) throw new Error('User not found!')

            const postExists = POSTS.some((post) => post.id == args.data.post && post.published)
            if (!postExists) throw new Error('Post does not exist or is not published!')

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            COMMENTS.push(comment)
            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return USERS.find((user) => {
                return user.id == parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return COMMENTS.filter((comment) => {
                return comment.post == parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return POSTS.filter((post) => {
                return post.author == parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return COMMENTS.filter((comment) => {
                return comment.author == parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return USERS.find((user) => {
                return user.id == parent.author 
            })
        },
        post(parent, args, ctx, info) {
            return POSTS.find((post) => {
                return post.id == parent.post
            })
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