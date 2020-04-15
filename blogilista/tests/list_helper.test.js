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

describe('most blogs', () => {
  test('empty list', () => {
    expect(listHelper.mostBlogs([]))
      .toBe(null)
  })

  test('list with one blog', () => {
    expect(listHelper.mostBlogs(exampleBlogs.listWithOneBlog).author)
      .toBe('Edsger W. Dijkstra')
    expect(listHelper.mostBlogs(exampleBlogs.listWithOneBlog).blogs)
      .toBe(1)
  })

  test('example blog list with six blogs', () => {
    expect(listHelper.mostBlogs(exampleBlogs.listWithSixBlogs).author)
      .toBe('Robert C. Martin')
    expect(listHelper.mostBlogs(exampleBlogs.listWithSixBlogs).blogs)
      .toBe(3)
  })
})