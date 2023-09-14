const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
    type: String
  },
  phone: {
    type: Number,
    required: [true, 'Por favor introduce tu telefono']
  },

  nickname: {
    type: String
  },
  city: {
    type: String,
    required: [true, 'Por favor introduce tu ciudad']
  },
  linkedIn: {
    type: String
  },
  github: {
    type: String
  },
  instagram: {
    type: String
  },
  facebook: {
    type: String
  },
  website: {
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
  tags: {
    type: String
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
