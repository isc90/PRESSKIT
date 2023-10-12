const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor teclea un nombre']
  },
  email: {
    type: String,
    required: [true, 'Por favor teclea un email'],
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value)
      },
      message: 'El campo "email" debe ser una dirección de correo electrónico válida.'
    }
  },
  password: {
    type: String,
    required: [true, 'Por favor teclea un password']
  },
  photo: {
    type: String
  },
  phone: {

    type: String,
    required: [true, 'Por favor introduce tu telefono'],
    validate: {
      validator: (value) => {
        return validator.isMobilePhone(value, 'es-MX')
      },
      message: 'El campo "phone" debe ser un número de teléfono válido en formato mexicano.'
    },
    unique: true
  },

  nickname: {
    type: String,
    unique: true
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
  vcf: {
    type: String
  },
  qr: {
    type: String
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
