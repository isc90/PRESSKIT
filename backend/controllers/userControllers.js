const asyncHandler = require('express-async-handler')
const { upload } = require('../middleware/uploadMiddleware')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
// const { uploadImage } = require('../utils/cloudinary')
const cloudinary = require('../utils/cloudinary')
const fs = require('fs')
const path = require('path');
const QRCode = require('qrcode')

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

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30m'
  })
}

const getUserData = asyncHandler(async (req, res) => {
  res.json(req.user)
})

const getProfile = asyncHandler(async (req, res) => {
  req.user = await User.findOne({ nickname: req.params.nickname }).select('-password')
  const u = req.user
  const nicknameU = u.nickname
  // const data = `https://cute-jade-drill-sock.cyclic.cloud/api/v1/${nicknameU}`
  const fileName = `${nicknameU}qrcode.png`
  const folderPath = './backend/QR'
  const filePath = `${folderPath}/${fileName}`
  generateQRCode(data, filePath)
  res.json(req.user)
})

async function generateQRCode (data, filename) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data)
    // Remove the "data:image/png;base64," prefix to get the raw base64 data
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '')
    // Convert base64 data to a buffer
    const qrCodeBuffer = Buffer.from(base64Data, 'base64')
    // Save the buffer as an image file
    fs.writeFileSync(filename, qrCodeBuffer)
    console.log(`QR code saved as ${filename}`)
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const getUserVcf = asyncHandler(async (req, res) => {
  req.user = await User.findOne({ nickname: req.params.nickname }).select('-password')
  const user1 = req.user
  const name = user1.name
  const email = user1.email
  const phone = user1.phone
  if (!req.user) {
    return res.status(404).json({ error: 'User not found' })
  }
  function userToVcf (n, e, p) {
    return `BEGIN:VCARD
  VERSION:3.0
  FN:${n}
  EMAIL:${e}
  TEL:${p}
  END:VCARD
  `
  }
  const folderPath = './backend/VCF' //El error estaba AQUI y se ocasionaba por el require
  const fileName = `${name}.vcf`
  const filePath = `${folderPath}/${fileName}`;
  const vcfData = userToVcf(name, email, phone)
  fs.writeFileSync(filePath, vcfData, 'utf-8')
  // fs.writeFileSync(fileName, vcfData, 'utf-8')
  res.download(filePath, filePath, (err) => {
    if (err) {
      console.error('Error sending VCF file:', err)
    }
  })
})

// Function to read a file and convert it to a data URL
function readFileToDataURL(inputFilePath) {
  try {
    // Read the file synchronously and store its content as a Buffer
    const fileContent = fs.readFileSync(inputFilePath);

    // Convert the file content to a Base64 data URL
    const dataURL = `data:${getMimeType(inputFilePath)};base64,${fileContent.toString('base64')}`;
    
    console.log(dataURL)
    return dataURL;
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
}

// Function to determine the MIME type based on file extension
function getMimeType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  switch (extname) {
    case '.txt':
      return 'text/plain';
    case '.jpg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    // Add more MIME types as needed
    default:
      return 'application/octet-stream'; // Default to binary data
  }
}

const uploadProfilePicture = async (req, res) => {
  upload.single('photo')(req, res, (err) => {
    // Verifica si se produjo un error durante la carga
    if (err) {
      console.error(err)
      return res.status(500).send('Error al cargar el archivo.')
    }

    // Verifica si se cargó un archivo
    if (!req.file) {
      return res.status(400).send('Ningún archivo fue cargado.')
    }

    // Sube el archivo a Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error(error)
          return res.status(500).send('Error al subir el archivo a Cloudinary.')
        }

        // Aquí puedes acceder a la URL del archivo subido en result.secure_url
        const fileUrl = result.secure_url
        res.send(`Archivo subido a Cloudinary: ${fileUrl}`)
      }
    ).end(req.file.buffer)
  })
}

const editUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    photo,
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

  const userId = req.user._id

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (name) {
      user.name = name
    }
    if (email) {
      user.email = email
    }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user.password = hashedPassword
    }

    if (req.file) {
      const fileName = req.file.originalname + '-' + Date.now()
      const filePath = 'uploads/' + fileName

      fs.rename(req.file.path, filePath, (err) => {
        if (err) {
          // Handle the error if the file couldn't be moved
          return res.status(500).json({ message: 'Error al guardar la imagen', error: err.message })
        } else {
          user.photo = filePath
          return res.status(202).json({ message: 'Foto actualizada con exito' })
        }
      })
    }

    if (phone) {
      user.phone = phone
    }

    if (photo) {
      user.photo = photo
    }

    if (nickname) {
      user.nickname = nickname
    }

    if (city) {
      user.city = city
    }

    if (linkedIn) {
      user.linkedIn = linkedIn
    }

    if (github) {
      user.github = github
    }

    if (instagram) {
      user.instagram = instagram
    }

    if (facebook) {
      user.facebook = facebook
    }

    if (website) {
      user.website = website
    }

    if (description) {
      user.description = description
    }

    if (services) {
      user.services = services
    }

    if (tags) {
      user.tags = tags
    }

    await user.save()

    res.status(200).json({ message: 'Usuario actualizado con éxito' })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message })
  }
})

module.exports = {
  registerUser,
  loginUser,
  getUserData,
  editUser,
  uploadProfilePicture,
  getProfile,
  getUserVcf
}
