const Query = {
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
}

export { Query as default }
