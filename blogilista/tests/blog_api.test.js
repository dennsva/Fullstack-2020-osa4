const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Blog = require('../models/blog')

const exampleBlogs = require('./example_blogs')
const initialBlogs = exampleBlogs.listWithSixBlogs

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  const savedUser = await user.save()

  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs
    .map(blog => ({
      ...blog,
      user: savedUser._id
    })))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('all blogs have an id', async () => {
  const response = await api.get('/api/blogs')

  response.body .forEach(blog => {
    expect(blog.id).toBeDefined()
  })
  response.body .forEach(blog => {
    expect(blog._id).not.toBeDefined()
  })
})

describe('post blog', () => {
  test('a valid blog can be added', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      title: "Maths is cool",
      author: "Mikko Malliblogaaja",
      url: "http://google.com",
      likes: 4,
    }
  
    await api
      .post('/api/blogs')
      .set('authorization', "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
  
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'Maths is cool'
    )
  })

  test('cannot add blog without token', async () => {
    const newBlog = {
      title: "Maths is cool",
      author: "Mikko Malliblogaaja",
      url: "http://google.com",
      likes: 4,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('a blog with no title is not added', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      author: "Sini Kosini Tangentti",
      url: "http://google.fi",
    }
  
    await api
      .post('/api/blogs')
      .set('authorization', "bearer " + token)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length)
  })

  test('a blog with no url is not added', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      title: "Maths is very cool",
      author: "Sini Kosini Tangentti",
    }
  
    await api
      .post('/api/blogs')
      .set('authorization', "bearer " + token)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length)
  })

  test('a blog with undefined likes gets 0 likes', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      title: "Maths is very cool",
      author: "Sini Kosini Tangentti",
      url: "http://google.fi",
    }
  
    const response = await api
      .post('/api/blogs')
      .set('authorization', "bearer " + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes).toBe(0)
  })
})

describe('delete blog', () => {
  test('a blog can be deleted', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('authorization', "bearer " + token)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd.length).toBe(
      initialBlogs.length - 1
    )
  
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('put blog', () => {
  test('a blog can be updated', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[3]
    
    const updatedBlog = {
      title: "Maths is NEW",
      author: "Milla the Reborn Mathematician",
      url: "http://google.com",
      likes: 40,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('authorization', "bearer " + token)
      .send(updatedBlog)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length)
  
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(updatedBlog.title)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'demo',
      name: 'Dennis Dinosaurusintoilija',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is undefined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'My Name',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'aa',
      name: 'My Name',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is undefined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'My Name',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'asd',
      name: 'My Name',
      password: 'aa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})