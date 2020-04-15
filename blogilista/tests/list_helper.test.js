const listHelper = require('../utils/list_helper')
const exampleBlogs = require('./example_blogs')

describe('dummy', () => {
  const emptyList = []

  test('dummy returns one', () => {
    const result = listHelper.dummy(emptyList)
    expect(result).toBe(1)
  })
})

describe('totalLikes', () => {
  test('empty list', () => {
    expect(listHelper.totalLikes([]))
      .toBe(0)
  })

  test('list with one blog', () => {
    expect(listHelper.totalLikes(exampleBlogs.listWithOneBlog))
      .toBe(5)
  })

  test('example blog list with six blogs', () => {
    expect(listHelper.totalLikes(exampleBlogs.listWithSixBlogs))
      .toBe(36)
  })
})

describe('favorite blog', () => {
  test('empty list', () => {
    expect(listHelper.favoriteBlog([]))
      .toBe(null)
  })

  test('list with one blog', () => {
    expect(listHelper.favoriteBlog(exampleBlogs.listWithOneBlog).likes)
      .toBe(5)
  })

  test('example blog list with six blogs', () => {
    expect(listHelper.favoriteBlog(exampleBlogs.listWithSixBlogs).likes)
      .toBe(12)
  })
})