const config = require('./utils/config')
const express = require('express')
require('express-async-errors')


const logger = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const Blog = require('./models/blog.js')

logger.info('Connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error.message)
  })

app.use(cors())
// FRONTEND STATIC THING
app.use(express.json())
//app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.get('', (request, response) => {
  response.send("Hello World!\n")
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app