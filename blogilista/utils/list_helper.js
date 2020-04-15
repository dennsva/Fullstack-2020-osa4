const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
  ? 0 
  : blogs.reduce(reducer, 0)
}

const maxLikes = (blogs) => {
  const reducer = (max, blog) => {
    return Math.max(max, blog.likes)
  }

  return blogs.length === 0
  ? -1
  : blogs.reduce(reducer, -1)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const max = maxLikes(blogs)

  return blogs.find(blog => blog.likes === max)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const map = blogs
    .map(blog => blog.author)
    .reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())

  const author = [...map].reduce((acc, e) => e[1] > acc[1] ? e : acc)

  return {
    author: author[0],
    blogs: author[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const map = blogs
    .reduce((acc, e) => acc.set(e.author, (acc.get(e.author) || 0) + e.likes), new Map())

  const author = [...map].reduce((acc, e) => e[1] > acc[1] ? e : acc)

  return {
    author: author[0],
    likes: author[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}