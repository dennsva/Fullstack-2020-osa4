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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}