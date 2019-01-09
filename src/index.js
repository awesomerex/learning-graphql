import { GraphQLServer } from 'graphql-yoga'

//Demo user data
const users = [{
    id: '1',
    name: 'Rex',
    email: 'rex@example.com',
    age: 30
},{
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}]

const posts = [{
    id: '1',
    title: 'Title',
    body: 'the body',
    published: true,
    author: 1
}, {
    id: '2',
    title: 'Title 2',
    body: 'the body 2',
    published: true,
    author: 2
}, {
    id: '3',
    title: 'Title 3',
    body: 'the body 3',
    published: false,
    author: 3
}]

const comments = [{
    id: '1',
    text: 'Stuff',
    authorId: '1'
}, {
    id: '2',
    text: 'Great!',
    authorId: '1'
}, {
    id: '3',
    text: 'Cool stuff!',
    authorId: '2'
}, {
    id: '4',
    text: 'Great post!',
    authorId: '3'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        authorId: ID!
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
    }
`


// Resolvers
// values sent to resolvers
// parent, args, context, info
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })

        },
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
        posts(parent, args, ctx, info){
            if(!args.query) {
                return posts
            }

            return posts.filter((post) => {
                if( post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                post.body.toLowerCase().includes(args.query.toLowerCase())){
                    return post
                }
            })
        },
        comments(parent, args, ctx, info){
            if (!args.query){
                return comments
            }
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.find((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) => {
                return comment.authorId === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.authorId
            })
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
