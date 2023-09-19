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

connectDB()

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', require('./routes/userRoutes'))

app.use(errorHandler)
app.listen(port, () => console.log(`Server started on port ${port}`))
