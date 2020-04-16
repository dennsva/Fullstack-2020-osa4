const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const exampleBlogs = require('./example_blogs')
const initialBlogs = exampleBlogs.listWithSixBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
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
    const newBlog = {
      title: "Maths is cool",
      author: "Mikko Malliblogaaja",
      url: "http://google.com",
      likes: 4,
    }
  
    await api
      .post('/api/blogs')
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

  test('a blog with no title is not added', async () => {
    const newBlog = {
      author: "Sini Kosini Tangentti",
      url: "http://google.fi",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const notesAtEnd = await helper.blogsInDb()
    expect(notesAtEnd.length).toBe(initialBlogs.length)
  })

  test('a blog with no url is not added', async () => {
    const newBlog = {
      title: "Maths is very cool",
      author: "Sini Kosini Tangentti",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const notesAtEnd = await helper.blogsInDb()
    expect(notesAtEnd.length).toBe(initialBlogs.length)
  })

  test('a blog with undefined likes gets 0 likes', async () => {
    const newBlog = {
      title: "Maths is very cool",
      author: "Sini Kosini Tangentti",
      url: "http://google.fi",
    }
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes).toBe(0)
  })
})

afterAll(() => {
  mongoose.connection.close()
})