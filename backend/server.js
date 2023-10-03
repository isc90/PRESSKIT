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
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/v1', require('./routes/userRoutes'))

// Error handling middleware
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))

/** const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads') // Ruta donde se guardarán los archivos cargados
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()) // Nombre de archivo único
  }
})

const upload = multer({ storage: storage })

app.post('/profile-upload-single', upload.single('photo'), function (req, res, next) {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})
*/

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary
