import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
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
    }
`


// Resolvers
// values sent to resolvers
// parent, args, context, info
const resolvers = {
    Query: {
        me() {
            return {
                id: '123098',
                name: 'mike',
                email: 'mike@example.com',
                age: 28
            }
        },
        post() {
            return {
                id: '123abc',
                title: 'This is the title',
                body: 'This is the body of the post',
                published: true
            }
        },
        greeting(parent, args, ctx, info) {
            if(args.name){
                return `Hello, ${args.name}!`
            }
            else{
                return 'Hello!'
            }
        }

    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() =>{
    console.log('The server is up!')
})