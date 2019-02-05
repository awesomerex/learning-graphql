import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

// Resolvers
// values sent to resolvers
// parent, args, context, info
const resolvers = {
    Query: {
        users(parent, args, {db}, info) {
            if (!args.query) {
                return db.users
            }

            return db.users.filter((user) => {
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
        posts(parent, args, {db}, info){
            if(!args.query) {
                return db.posts
            }

            return db.posts.filter((post) => {
                if( post.title.toLowerCase().includes(args.query.toLowerCase()) ||
                post.body.toLowerCase().includes(args.query.toLowerCase())){
                    return post
                }
            })
        },
        comments(parent, args, {db}, info){
            if (!args.query){
                return db.comments
            }
        }
    },
    Mutation: {
        createUser(parent, args, {db}, info){
          const emailTaken = db.users.some((user) => user.email === args.data.email)

          if(emailTaken) {
            throw new Error('Email taken.')
          }
          const user = {
            id: uuidv4(),
            ...args.data
          }

          db.users.push(user)

          return user
        },
        deleteUser(parent, args, {db}, info){
          const userIndex = db.users.findIndex((user)=> user.id === args.id)

          if(userIndex === -1){
            throw new Error('User not found')
          }

          const deletedUsers = db.users.splice(userIndex, 1)

          db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if(match){
              db.comments = db.comments.filter((comment) => {
                return comment.post !== post.id
              })
            }

            return !match
          })
          db.comments = db.comments.filter((comment) => comment.author !== args.id)

          return deletedUsers[0]
        },
        createPost(parent, args, {db}, info){
          const userExists = db.users.some((user) => user.id === args.data.author)

          if(!userExists){
            throw new Errror('User not found')
          }

          const post = {
            id: uuidv4(),
            ...args.data
          }

          db.posts.push(post)

          return post
        },
        deletePost(parent, args, {db}, info){
          const postIndex = db.posts.findIndex((post) => post.id === args.id)

          if(postIndex === -1){
            throw new Error('Post not found')
          }
          const deletedPost = db.posts.splice(postIndex, 1)

          console.log(deletedPost)

          db.comments = db.comments.filter((comment) => {
            return comment.post !== args.id
          })

          return deletedPost

        },
        createComment(parent, args, {db}, info){
          const userExists = db.users.some((user) => user.id ===args.data.author)
          const postExists = db.posts.some((post) => post.id === args.data.post)
          const postPublished = db.posts.find((post) => {
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

          db.comments.push(comment)

          return comment
        },
      deleteComment(parent, args, {db}, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if(commentIndex === -1){
          throw new error( "Comment Not Found" )
        }

        const deletedComment = db.comments.splice(commentIndex, 1)

        return deletedComment[0]
      }

    },
    Post: {
        author(parent, args, {db}, info){
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, {db}, info){
            return db.comments.filter((comment) =>{
                return comment.postId = parent.id
            })
        }
    },
    User: {
        posts(parent, args, {db}, info){
            return db.posts.find((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, {db}, info){
            return db.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, {db}, info){
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, {db}, info){
            return db.posts.find((post) => {
                return post.id === parent.postId
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
      db
    }
})

server.start(() =>{
    console.log('The server is up!')
})
