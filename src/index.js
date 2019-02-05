import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

//Demo user data
let users = [{
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

let posts = [{
    id: '1',
    title: 'Title',
    body: 'the body',
    published: true,
    author: '1'
}, {
    id: '2',
    title: 'Title 2',
    body: 'the body 2',
    published: true,
    author: '2'
}, {
    id: '3',
    title: 'Title 3',
    body: 'the body 3',
    published: false,
    author: '3'
}]

let comments = [{
    id: '1',
    text: 'Stuff',
    author: '1',
    postId: '1'
}, {
    id: '2',
    text: 'Great!',
    author: '1',
    postId: '2'
}, {
    id: '3',
    text: 'Cool stuff!',
    author: '2',
    postId: '3'
}, {
    id: '4',
    text: 'Great post!',
    author: '3',
    postId: '1'
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
    
    type Mutation{
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!):Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    input CreatePostInput{
      title: String!,
      body: String!,
      published: Boolean!
    }
    
    input CreateCommentInput{
      text: String!
      author: ID!
      post: ID!
    }
    
    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User
        comments: [Comment]!
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
    Mutation: {
        createUser(parent, args, ctx, info){
          const emailTaken = users.some((user) => user.email === args.data.email)

          if(emailTaken) {
            throw new Error('Email taken.')
          }
          const user = {
            id: uuidv4(),
            ...args.data
          }

          users.push(user)

          return user
        },
        deleteUser(parent, args, ctx, info){
          const userIndex = users.findIndex((user)=> user.id === args.id)

          if(userIndex === -1){
            throw new Error('User not found')
          }

          const deletedUsers = users.splice(userIndex, 1)

          posts = posts.filter((post) => {
            const match = post.author === args.id

            if(match){
              comments = comments.filter((comment) => {
                return comment.post !== post.id
              })
            }

            return !match
          })
          comments = comments.filter((comment) => comment.author !== args.id)

          return deletedUsers[0]
        },
        createPost(parent, args, ctx, info){
          const userExists = users.some((user) => user.id === args.data.author)

          if(!userExists){
            throw new Errror('User not found')
          }

          const post = {
            id: uuidv4(),
            ...args.data
          }

          posts.push(post)

          return post
        },
        deletePost(parent, args, ctx, info){
          const postIndex = posts.findIndex((post) => post.id === args.id)

          if(postIndex === -1){
            throw new Error('Post not found')
          }
          const deletedPost = posts.splice(postIndex, 1)

          console.log(deletedPost)

          comments = comments.filter((comment) => {
            return comment.post !== args.id
          })

          return deletedPost

        },
        createComment(parent, args, ctx, info){
          const userExists = users.some((user) => user.id ===args.data.author)
          const postExists = posts.some((post) => post.id === args.data.post)
          const postPublished = posts.find((post) => {
            return (post.id === args.data.post && post.published === true)
          })

          if( !userExists ){
            throw new Error('User not found')
          }

          if( !postExists ){
              throw new Error('Post not found')
          }

          if( !postPublished ){
              throw new Error('Post not published')
          }

          const comment = {
            id: uuidv4(),
            ...args.data
          }

          comments.push(comment)

          return comment
        },
      deleteComment(parent, args, ctx, info){
        const commentIndex = comments.findIndex((comment) => comment.id === args.id)

        if(commentIndex === -1){
          throw new error( "Comment Not Found" )
        }

        const deletedComment = comments.splice(commentIndex, 1)

        return deletedComment[0]
      }

    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment) =>{
                return comment.postId = parent.id
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
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find((post) => {
                return post.id === parent.postId
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
