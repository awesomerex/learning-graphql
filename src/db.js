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

const comments = [{
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

const db = {
  users,
  posts,
  comments
}

export { db as default }
