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
    required: [true, 'Por favor introduce tu telefono'],
    validate: {
      validator: value => validatePhoneLength(value, 10),
      message: 'Ingresa un numero valido de 10 digitos'
    },
    unique: true
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
  },
  qr: {
    //
  }

}, {
  timestamps: true
})

function validatePhoneLength (value, length) {
  return value.toString().length === length
}

module.exports = mongoose.model('User', userSchema)
