const express = require('express')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5001
const cloudinary = require('cloudinary').v2

connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/api/v1', require('./routes/userRoutes'))

// Error handling middleware
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
// console.log(cloudinary.config())

module.exports = cloudinary

/**
cloudinary.uploader
  .upload('C:/Users/ivanp/OneDrive/Escritorio/PRESSKIT/backend/assets/bicho.jpg', {
    resource_type: 'image'
  })
  .then((result) => {
    console.log('success', JSON.stringify(result, null, 2))
  })
  .catch((error) => {
    console.log('error', JSON.stringify(error, null, 2))
  }) */
