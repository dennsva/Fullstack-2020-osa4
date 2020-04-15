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

  const authors = blogs.map(blog => blog.author)
  const author = authors
    .sort((author1, author2) => 
      authors.filter(author => author === author1).length
      - authors.filter(author => author === author2).length)
    .slice(-1)[0]

  return {
    author: author,
    blogs: authors.filter(auth => auth === author).length
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}