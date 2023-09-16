const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    photo,
    phone,
    nickname,
    city,
    linkedIn,
    github,
    instagram,
    facebook,
    website,
    description,
    services,
    tags
  } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Falta información, por favor verifica los campos')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('Ese usuario ya existe')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    photo,
    phone,
    nickname,
    city,
    linkedIn,
    github,
    instagram,
    facebook,
    website,
    description,
    services,
    tags
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    })
  } else {
    res.status(400)
    throw new Error('No se pudo guardar el registro')
  }
})
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Faltan datos, favor de verificar')
  }

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)

    })
  } else {
    res.status(401)
    throw new Error('Datos de acceso incorrectos')
  }
})

// token generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30m'
  })
}

module.exports = {
  registerUser,
  loginUser
}
