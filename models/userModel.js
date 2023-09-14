const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor teclea un nombre']
  },
  email: {
    type: String,
    required: [true, 'Por favor teclea un email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Por favor teclea un password']
  },
  photo: {
    type: String,
    required: [true]
  },
  instagram: {
    type: String
  },
  linkedIn: {
    type: String,
    required: [true, 'Introduce tu LinkedIn']
  },
  nickname: {
    type: String,
    required: [true, 'Por favor introduce tu nickname']
  },
  facebook: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Por favor introduce una breve descripcion sobre ti']
  },
  services: {
    type: String,
    required: [true, 'Describe el tipo de servicios que ofreces']
  },
  github: {
    type: String
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Usuario', usuarioSchema)
